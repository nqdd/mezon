use anyhow::Result;
use gpui::{px, size, App, AppContext, AsyncApp, Bounds, Entity, WindowBounds, WindowOptions};
use gpui_platform::application;
use mezon_native::instance::SingleInstance;
use mezon_store::{AuthState, Settings};
use mezon_ui::{title_bar::TitleBar, RootView};
use tracing_subscriber::{fmt, EnvFilter};

fn main() -> Result<()> {
    fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("mezon=debug,info")),
        )
        .init();

    tracing::info!("Starting Mezon desktop app v{}", env!("CARGO_PKG_VERSION"));

    // Check if a mezonapp:// deep link URL was passed as argv[1].
    let deep_link_url: Option<String> = std::env::args()
        .nth(1)
        .filter(|a| a.starts_with("mezonapp://"));

    // Single instance guard — forward deep link URL to an existing instance if running.
    let lock_result = match deep_link_url.as_deref() {
        Some(url) => SingleInstance::try_acquire_or_forward(url)?,
        None => SingleInstance::try_acquire()?,
    };

    match lock_result {
        None => {
            tracing::info!("Another instance is already running — exiting");
            return Ok(());
        }
        Some(lock) => run_app(lock, deep_link_url),
    }

    Ok(())
}

fn run_app(lock: SingleInstance, initial_url: Option<String>) {
    let settings = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("Failed to build tokio runtime")
        .block_on(Settings::load())
        .unwrap_or_default();

    tracing::debug!(
        "Settings: theme={}, zoom={}, auto_start={}",
        settings.theme,
        settings.zoom_factor,
        settings.auto_start
    );

    // Sync login-item with settings.
    mezon_native::autostart::sync_auto_start(settings.auto_start);

    application().run(move |cx: &mut App| {
        tracing::debug!("App started");

        // Shared channel so background threads can send deep link URLs to the GPUI main thread.
        let (url_tx, url_rx) =
            std::sync::mpsc::channel::<String>();

        // Listen for deep link URLs forwarded from secondary instances.
        {
            let tx = url_tx.clone();
            lock.listen_for_urls(move |url| {
                let _ = tx.send(url);
            });
        }

        // If we were launched with a deep link, inject it immediately.
        if let Some(url) = initial_url {
            let _ = url_tx.send(url);
        }

        // Open the main window and obtain the auth_state entity handle.
        let auth_state_handle = open_main_window(cx, &settings);

        // Background task: poll `url_rx` and update auth state on the main thread.
        {
            let auth_state = auth_state_handle.clone();
            cx.spawn(async move |cx: &mut AsyncApp| {
                let exec = cx.background_executor().clone();
                loop {
                    match url_rx.try_recv() {
                        Ok(url) => {
                            tracing::info!("Received deep link: {url}");
                            cx.update(|cx| {
                                auth_state.update(cx, |state, cx| {
                                    if url.starts_with("mezonapp://callback") {
                                        *state = AuthState::AwaitingCallback;
                                    }
                                    cx.notify();
                                });
                            });
                        }
                        Err(std::sync::mpsc::TryRecvError::Disconnected) => break,
                        Err(std::sync::mpsc::TryRecvError::Empty) => {}
                    }
                    exec.timer(std::time::Duration::from_millis(100)).await;
                }
            })
            .detach();
        }

        // System tray.
        let _tray = setup_tray(cx);

        cx.activate(true);
    });
}

/// Open the main window and return a cloneable handle to the `AuthState` entity.
fn open_main_window(cx: &mut App, settings: &Settings) -> Entity<AuthState> {
    let window_bounds = if let Some([x, y, w, h]) = settings.window_bounds {
        WindowBounds::Windowed(Bounds {
            origin: gpui::point(px(x as f32), px(y as f32)),
            size: size(px(w as f32), px(h as f32)),
        })
    } else {
        WindowBounds::Windowed(Bounds::centered(None, size(px(1280.0), px(720.0)), cx))
    };

    let options = WindowOptions {
        titlebar: Some(gpui::TitlebarOptions {
            title: None,
            appears_transparent: true,
            traffic_light_position: Some(gpui::point(px(-100.0), px(-100.0))),
        }),
        window_bounds: Some(window_bounds),
        window_min_size: Some(size(px(950.0), px(500.0))),
        kind: gpui::WindowKind::Normal,
        focus: true,
        show: true,
        ..Default::default()
    };

    // Smuggle the Entity out of the open_window closure via an Arc<Mutex<Option<_>>>.
    let auth_out = std::sync::Arc::new(std::sync::Mutex::new(
        None::<Entity<AuthState>>,
    ));
    let auth_out_clone = auth_out.clone();

    cx.open_window(options, move |_window, cx| {
        let auth_state = cx.new(|_cx| AuthState::default());
        *auth_out_clone.lock().unwrap() = Some(auth_state.clone());

        let title_bar = cx.new(|_cx| TitleBar::new("Mezon"));
        cx.new(|_cx| RootView::new(title_bar, auth_state))
    })
    .unwrap_or_else(|e| {
        tracing::error!("Failed to open main window: {e}");
        std::process::exit(1);
    });

    auth_out
        .lock()
        .unwrap()
        .clone()
        .expect("auth_state not initialised after open_window")
}

/// Create the system tray (best-effort — log a warning on failure).
fn setup_tray(cx: &mut App) -> Option<mezon_native::tray::MezonTray> {
    let quit_flag = std::sync::Arc::new(std::sync::atomic::AtomicBool::new(false));
    let quit_flag_clone = quit_flag.clone();

    // Background task that watches the quit flag and fires cx.quit().
    cx.spawn(async move |cx: &mut AsyncApp| {
        let exec = cx.background_executor().clone();
        loop {
            if quit_flag_clone.load(std::sync::atomic::Ordering::Relaxed) {
                cx.update(|cx| cx.quit());
                break;
            }
            exec.timer(std::time::Duration::from_millis(200)).await;
        }
    })
    .detach();

    match mezon_native::tray::MezonTray::new(
        || {
            tracing::debug!("Tray: Show Mezon");
            // TODO Stage 2: bring window to front via stored WindowHandle
        },
        move || {
            tracing::info!("Tray: Quit requested");
            quit_flag.store(true, std::sync::atomic::Ordering::Relaxed);
        },
    ) {
        Ok(tray) => {
            tracing::debug!("System tray initialised");
            Some(tray)
        }
        Err(e) => {
            tracing::warn!("Failed to create system tray: {e}");
            None
        }
    }
}
