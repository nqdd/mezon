/// Set the app badge count on the dock/taskbar icon.
/// Full implementation added in Stage 2 with platform-specific APIs.
pub fn set_badge_count(count: u32) {
    // TODO Stage 2: implement via objc2 (macOS) and windows-rs (Windows)
    tracing::debug!("set_badge_count({})", count);
}
