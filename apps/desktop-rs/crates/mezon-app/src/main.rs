use anyhow::Result;
use gpui::{px, size, App, AppContext, Bounds, WindowBounds, WindowOptions};
use gpui_platform::application;
use mezon_native::instance::SingleInstance;
use mezon_store::Settings;
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

    match SingleInstance::try_acquire()? {
        None => {
            tracing::info!("Another instance is already running — exiting");
            return Ok(());
        }
        Some(_lock) => run_app(),
    }

    Ok(())
}

fn run_app() {
    let settings = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("Failed to build tokio runtime")
        .block_on(Settings::load())
        .unwrap_or_default();

    tracing::debug!(
        "Settings: theme={}, zoom={}",
        settings.theme,
        settings.zoom_factor
    );

    application().run(move |cx: &mut App| {
        // Register deep link handler (mezonapp://)
        // NOTE: on_open_urls is on gpui::App directly via platform APIs
        // In GPUI v0.232 the API is available as a method, called via cx.update_default
        // For Stage 0 we stub this — full deep link handling added in Stage 1
        tracing::debug!("App started, registering URL handler");

        open_main_window(cx, &settings);
        cx.activate(true);
    });
}

fn open_main_window(cx: &mut App, settings: &Settings) {
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
            // Hide macOS traffic lights by pushing them off-screen
            traffic_light_position: Some(gpui::point(px(-100.0), px(-100.0))),
        }),
        window_bounds: Some(window_bounds),
        window_min_size: Some(size(px(950.0), px(500.0))),
        kind: gpui::WindowKind::Normal,
        focus: true,
        show: true,
        ..Default::default()
    };

    cx.open_window(options, |_window, cx| {
        let title_bar = cx.new(|_cx| TitleBar::new("Mezon"));
        cx.new(|_cx| RootView::new(title_bar))
    })
    .expect("Failed to open main window");
}
