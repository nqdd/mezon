use std::path::PathBuf;

/// Ensures only one instance of the app runs at a time.
///
/// On macOS/Linux: uses a Unix domain socket at `$XDG_RUNTIME_DIR/mezon.sock`.
/// On Windows: TODO named pipe (Stage 2).
///
/// A second instance can forward a URL to the first by writing it to the socket
/// before exiting (used for deep link handling).
pub struct SingleInstance {
    #[cfg(unix)]
    socket_path: PathBuf,
    #[cfg(unix)]
    _listener: std::os::unix::net::UnixListener,
}

impl SingleInstance {
    /// Try to acquire the single-instance lock.
    ///
    /// Returns `Ok(Some(instance))` — this is the first instance.
    /// Returns `Ok(None)` — another instance is already running.
    ///
    /// On Unix, if the caller passes a non-empty `url`, it is sent to the first
    /// instance over the socket before returning `None`.
    pub fn try_acquire() -> anyhow::Result<Option<Self>> {
        #[cfg(unix)]
        {
            Self::try_acquire_unix(None)
        }

        #[cfg(not(unix))]
        {
            Ok(Some(Self {}))
        }
    }

    /// Same as `try_acquire`, but additionally forwards `url` to the running
    /// first instance if one exists (used when the OS re-launches the app to
    /// handle a `mezonapp://` deep link).
    pub fn try_acquire_or_forward(url: &str) -> anyhow::Result<Option<Self>> {
        #[cfg(unix)]
        {
            Self::try_acquire_unix(Some(url))
        }

        #[cfg(not(unix))]
        {
            // Windows: stub — just acquire
            let _ = url;
            Ok(Some(Self {}))
        }
    }

    #[cfg(unix)]
    fn try_acquire_unix(forward_url: Option<&str>) -> anyhow::Result<Option<Self>> {
        use std::io::Write as _;

        let socket_path = Self::socket_path();

        if socket_path.exists() {
            match std::os::unix::net::UnixStream::connect(&socket_path) {
                Ok(mut stream) => {
                    tracing::info!("Another instance is already running");
                    if let Some(url) = forward_url {
                        let _ = stream.write_all(url.as_bytes());
                        tracing::debug!("Forwarded URL to running instance: {url}");
                    }
                    return Ok(None);
                }
                Err(_) => {
                    // Stale socket — clean up
                    let _ = std::fs::remove_file(&socket_path);
                }
            }
        }

        let listener = std::os::unix::net::UnixListener::bind(&socket_path)?;
        tracing::debug!("Single instance lock acquired at {}", socket_path.display());
        Ok(Some(Self {
            socket_path,
            _listener: listener,
        }))
    }

    /// Spawn a background thread that accepts connections on the Unix socket and
    /// calls `callback` with any URL strings sent by secondary instances.
    ///
    /// This is used for deep link forwarding: the OS launches a second instance
    /// with `mezonapp://…` in `argv[1]`; that instance forwards the URL here and
    /// exits.
    #[cfg(unix)]
    pub fn listen_for_urls(&self, callback: impl Fn(String) + Send + 'static) {
        // Clone the listener fd so the thread can accept() on it.
        // UnixListener doesn't implement Clone, so we dup the fd.
        let listener = match self._listener.try_clone() {
            Ok(l) => l,
            Err(e) => {
                tracing::warn!("Could not clone UnixListener for URL forwarding: {e}");
                return;
            }
        };

        std::thread::spawn(move || {
            use std::io::Read as _;
            for stream in listener.incoming() {
                match stream {
                    Ok(mut s) => {
                        let mut buf = String::new();
                        if s.read_to_string(&mut buf).is_ok() && !buf.is_empty() {
                            let url = buf.trim().to_owned();
                            tracing::debug!(
                                "Received deep link URL from secondary instance: {url}"
                            );
                            callback(url);
                        }
                    }
                    Err(e) => {
                        tracing::warn!("Unix socket accept error: {e}");
                        break;
                    }
                }
            }
        });
    }

    /// No-op on Windows (stub until named pipes are implemented).
    #[cfg(not(unix))]
    pub fn listen_for_urls(&self, _callback: impl Fn(String) + Send + 'static) {}

    #[cfg(unix)]
    fn socket_path() -> PathBuf {
        dirs::runtime_dir()
            .unwrap_or_else(|| std::path::PathBuf::from("/tmp"))
            .join("mezon.sock")
    }
}

#[cfg(unix)]
impl Drop for SingleInstance {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.socket_path);
    }
}
