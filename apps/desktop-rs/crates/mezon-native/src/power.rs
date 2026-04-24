/// Screen lock/unlock event detection.
/// On macOS: uses IOKit distributed notifications (com.apple.screenIsLocked / Unlocked).
/// On Windows: uses WM_WTSSESSION_CHANGE.

pub enum PowerEvent {
    ScreenLocked,
    ScreenUnlocked,
}

pub type PowerEventCallback = Box<dyn Fn(PowerEvent) + Send + 'static>;

pub fn subscribe(_callback: PowerEventCallback) {
    #[cfg(target_os = "macos")]
    {
        // TODO: implement IOKit distributed notification center subscription in Stage 2
        tracing::debug!("Power event subscription registered (macOS stub)");
    }
    #[cfg(not(target_os = "macos"))]
    {
        tracing::debug!("Power event subscription not yet implemented on this platform");
    }
}
