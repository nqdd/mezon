pub mod badge;
pub mod instance;
pub mod notifications;
pub mod power;

/// Opens a URL in the system default browser.
pub fn open_url(url: &str) -> anyhow::Result<()> {
    open::that(url).map_err(|e| anyhow::anyhow!("Failed to open URL: {}", e))
}
