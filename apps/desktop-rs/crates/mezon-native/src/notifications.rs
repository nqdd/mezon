/// Desktop notification support.
/// On macOS: uses UNUserNotificationCenter via objc2.
/// On Linux/Windows: stub (will use notify-rust or windows-rs toast).

#[derive(Debug, Clone)]
pub struct Notification {
    pub title: String,
    pub body: String,
    pub channel_id: Option<String>,
}

pub fn show(notification: &Notification) {
    tracing::info!(
        "Notification: [{}] {}",
        notification.title,
        notification.body
    );

    #[cfg(target_os = "macos")]
    show_macos(notification);

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    tracing::debug!("Native notifications not yet implemented on this platform");
}

#[cfg(target_os = "macos")]
fn show_macos(notification: &Notification) {
    // TODO: implement via objc2 UNUserNotificationCenter in Stage 2
    tracing::debug!("macOS notification: {}", notification.title);
}
