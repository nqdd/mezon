// mezon-client: Rust equivalent of mezon-js
// Handles REST API calls and WebSocket connection to Mezon backend.
// Stub implementation — will be expanded in Stage 1.

pub mod session;

pub use session::Session;

/// Default WebSocket/API host
pub const DEFAULT_HOST: &str = "sock.mezon.ai";
pub const DEFAULT_PORT: u16 = 443;
pub const DEFAULT_SECURE: bool = true;
