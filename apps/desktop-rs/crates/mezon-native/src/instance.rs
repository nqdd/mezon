use std::path::PathBuf;

/// Ensures only one instance of the app runs at a time.
/// Uses a Unix domain socket on macOS/Linux, a named pipe on Windows.
pub struct SingleInstance {
    #[cfg(unix)]
    socket_path: PathBuf,
    #[cfg(unix)]
    _listener: std::os::unix::net::UnixListener,
}

impl SingleInstance {
    /// Try to acquire the single instance lock.
    /// Returns Ok(Some(instance)) if this is the first instance.
    /// Returns Ok(None) if another instance is already running.
    pub fn try_acquire() -> anyhow::Result<Option<Self>> {
        #[cfg(unix)]
        {
            let socket_path = Self::socket_path();

            // Try to connect — if it works, another instance is running
            if socket_path.exists() {
                match std::os::unix::net::UnixStream::connect(&socket_path) {
                    Ok(_) => {
                        tracing::info!("Another instance is already running");
                        return Ok(None);
                    }
                    Err(_) => {
                        // Stale socket — clean it up
                        let _ = std::fs::remove_file(&socket_path);
                    }
                }
            }

            // Bind our own listener to claim the lock
            let listener = std::os::unix::net::UnixListener::bind(&socket_path)?;
            tracing::debug!("Single instance lock acquired at {}", socket_path.display());
            return Ok(Some(Self {
                socket_path,
                _listener: listener,
            }));
        }

        #[cfg(not(unix))]
        {
            // TODO: implement named pipe single instance lock for Windows (Stage 2)
            Ok(Some(Self {}))
        }
    }

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
