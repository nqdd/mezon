# Mezon Desktop — Rust/GPUI Migration Plan

**Status:** Planning  
**Target:** Full native desktop app using [GPUI](https://github.com/zed-industries/zed/tree/main/crates/gpui) (Zed's GPU-accelerated UI framework)  
**Strategy:** Page-by-page migration — each screen is replaced one at a time with a native GPUI view  
**Platform priority:** macOS first, then Windows and Linux  
**Parallel development:** New app lives in `apps/desktop-rs/` alongside the existing Electron app in `apps/desktop/`

---

## Why GPUI

| Property   | Detail                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| Rendering  | GPU-accelerated via Metal (macOS) and wgpu (Linux/Windows)                       |
| Layout     | Tailwind-style utility methods (`flex()`, `p_4()`, `text_color()`)               |
| Reactivity | Fine-grained — `Model<T>` + `cx.notify()` — only subscribed views re-render      |
| Async      | First-class — `cx.spawn()`, `cx.background_executor()`                           |
| Proof      | Powers Zed editor — handles rich text, virtual lists, GPU textures in production |
| Text       | Full Unicode, BiDi, emoji, font fallback, custom inline elements                 |

---

## Architecture

```
apps/desktop-rs/
├── Cargo.toml                    ← workspace root
├── Cargo.lock
├── rust-toolchain.toml           ← pin nightly (GPUI requires it)
├── .cargo/config.toml            ← target-specific linker flags
├── crates/
│   ├── mezon-app/                ← binary entry point, GPUI bootstrap, window management
│   ├── mezon-ui/                 ← all GPUI views (one module per page)
│   ├── mezon-client/             ← Rust equivalent of mezon-js (REST + WebSocket + Protobuf)
│   ├── mezon-store/              ← app state models (Model<T> per domain)
│   ├── mezon-native/             ← OS APIs: tray, badge, notifications, screen capture, activity
│   ├── mezon-updater/            ← auto-update (polls cdn.mezon.ai/release/)
│   └── mezon-proto/              ← generated Protobuf types via prost-build
└── assets/
    ├── fonts/                    ← Inter, JetBrains Mono, NotoEmoji
    ├── icons/                    ← app.icns, app.ico, trayicon-linux.png
    └── sounds/                   ← notification sounds
```

### GPUI Data Flow

```
WebSocket (mezon API — Protobuf frames)
        │
        ▼
  tokio task (background executor)
        │
   cx.update() ──► MessagesModel.update()
                          │
                    cx.notify() ──► MessageList view re-renders
                                         │
                                   Element Tree (div/flex/text)
                                         │
                                   Taffy layout pass (Flexbox)
                                         │
                                   GPU draw calls
                                         │
                                  Metal (macOS) / wgpu (Linux/Windows)
                                         │
                                      Display
```

### Backend Transport (Rust equivalent of mezon-js)

| Layer                | Electron/JS               | Rust                                             |
| -------------------- | ------------------------- | ------------------------------------------------ |
| HTTP REST            | `mezon-js` Client         | `reqwest` async client                           |
| WebSocket + Protobuf | `WebSocketAdapterPb`      | `tokio-tungstenite` + `prost`                    |
| Auth tokens          | `localStorage`            | `keyring` crate (OS keychain)                    |
| OAuth2               | Browser window            | System browser + `mezonapp://callback` deep link |
| Session refresh      | `client.onRefreshSession` | Background `tokio` task                          |

API host is dynamically returned in the Session object after auth. Default: `sock.mezon.ai`.

### Crate Dependency Map

```
mezon-app
  ├── mezon-ui        (GPUI views)
  │     └── mezon-store   (Model<T> state)
  ├── mezon-client    (REST + WebSocket)
  │     └── mezon-proto   (Protobuf types)
  ├── mezon-native    (OS APIs)
  └── mezon-updater   (auto-update)
```

---

## Key Dependencies

```toml
# UI framework
gpui = { git = "https://github.com/zed-industries/zed", rev = "<pinned-commit>" }

# Async runtime
tokio = { version = "1", features = ["full"] }

# Networking
reqwest = { version = "0.12", features = ["json", "stream"] }
tokio-tungstenite = "0.24"

# Protobuf
prost = "0.13"
prost-build = "0.13"

# Serialization
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# Native OS
tray-icon = "0.19"       # system tray
rfd = "0.15"             # native file dialogs
arboard = "3"            # clipboard
scap = "0.3"             # screen capture
open = "5"               # open URLs in system browser
auto-launch = "0.5"      # login item / startup registration
keyring = "3"            # OS keychain (auth tokens)

# Image & media
image = "0.25"           # PNG/WebP/JPEG decoding

# Voice/video (Stage 12+)
livekit = { git = "https://github.com/livekit/rust-sdks" }
cpal = "0.15"            # cross-platform audio I/O

# Syntax highlighting (Stage 6)
syntect = "5"

# Logging
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }

# macOS-specific
[target.'cfg(target_os = "macos")'.dependencies]
objc2 = "0.5"
objc2-foundation = "0.2"
objc2-app-kit = "0.2"

# Windows-specific
[target.'cfg(target_os = "windows")'.dependencies]
windows = { version = "0.58", features = [
  "Win32_UI_Shell",
  "Win32_UI_WindowsAndMessaging",
  "Win32_System_Threading",
  "Win32_Foundation",
] }
```

---

## Migration Stages

### Stage 0 — Foundation (Weeks 1–3)

**Goal:** Shippable macOS binary replacing Electron. No chat UI yet.

**Tasks:**

-   [ ] Scaffold `apps/desktop-rs/` Cargo workspace with all crates (empty stubs)
-   [ ] Pin GPUI from Zed repo at a stable release tag in `Cargo.toml`
-   [ ] Open frameless window (1280×720, min 950×500, background `#313338`)
-   [ ] Custom title bar: macOS hidden traffic lights + drag region + app menu bar
-   [ ] System tray: icon + "Show Mezon" / "Check for Updates" / "Quit"
-   [ ] Deep link: register `mezonapp://` scheme (macOS `LSURLSchemes`, Windows registry, Linux `.desktop`)
-   [ ] Single instance lock (Unix socket on macOS/Linux, named pipe on Windows)
-   [ ] Persistent settings: `~/.config/mezon/settings.json` (autoStart, hardwareAcceleration, windowBounds, zoomFactor)
-   [ ] Auto-start on login (`auto-launch` crate, wired to settings)
-   [ ] Badge count on dock icon (`objc2` on macOS, `ITaskbarList3` on Windows)
-   [ ] Screen lock/unlock detection (`IOKit` distributed notifications on macOS, `WM_WTSSESSION_CHANGE` on Windows)
-   [ ] OAuth2 flow: open system browser → receive `mezonapp://callback?token=...` deep link → extract + store token
-   [ ] "Connecting..." placeholder view while auth is pending
-   [ ] GitHub Actions build matrix: `macos-latest` (arm64 + x64), `windows-latest`, `ubuntu-latest`

**Deliverable:** DMG installer. Opens native frameless window. OAuth login works. System tray works.

**Validation spikes (must pass before proceeding):**

1. Frameless window + custom title bar renders correctly on macOS 13+ and Windows 11
2. Virtual scroll list of 10,000 items renders at 60fps
3. PNG/WebP image decoded and rendered as GPUI texture
4. System tray + context menu works on all 3 platforms
5. `mezonapp://` deep link is received and parsed correctly

---

### Stage 1 — Auth Pages (Weeks 4–5)

**Pages:** `/desktop/login`, `/login/callback`, `/logout/callback`

**`mezon-client` work:**

-   `POST /v2/account/authenticate/email` — email/password login
-   `POST /v2/account/authenticate/mezon` — OAuth2 token exchange
-   Session struct: `token`, `refresh_token`, `expires_at`, `ws_url`, `api_url`
-   Keychain: store/load token via `keyring` crate
-   Background refresh task: re-authenticate before expiry

**GPUI views:**

```
LoginView
├── App logo + "Mezon" wordmark
├── "Sign in with Mezon" button → opens system browser for OAuth2
├── Email / password form (alternative)
├── "Forgot password" link → open browser
├── Error message display (invalid credentials, network error)
└── Loading spinner while awaiting deep link callback
```

**Deliverable:** User can sign in. Token persisted to keychain. App remembers login across restarts.

---

### Stage 2 — App Shell + Navigation (Weeks 6–8)

**Pages:** `/chat/` shell — `MainLayout` + sidebars

The permanent frame that wraps all authenticated pages.

**`mezon-client` work:**

-   `GET /v2/clans` — fetch user's clan list with icons and unread counts
-   `GET /v2/channels?clan_id=X` — fetch channel tree (categories + channels)
-   `GET /v2/direct` — fetch DM channel list
-   WebSocket connect: `wss://{ws_url}/ws?token=...` with Protobuf framing
-   Subscribe real-time: `channel_message`, `channel_presence`, `status_presence`, `notification`

**`mezon-store` models:**

-   `ClansModel` — clan list, currently active clan
-   `ChannelsModel` — channel tree per clan, unread counts
-   `DirectModel` — DM channels list
-   `PresenceModel` — online/away/offline/dnd per user

**GPUI views:**

```
MainLayout
├── TitleBar (from Stage 0)
│
├── ClanSidebar (72px wide)
│   ├── Direct Messages icon (top)
│   ├── ClanIcon × N (virtual list — avatar, unread dot, tooltip on hover)
│   ├── Separator
│   └── Add Clan / Discover (bottom)
│
├── ChannelSidebar (240px wide)
│   ├── Clan name header + settings gear icon
│   ├── CategorySection × N (collapsible)
│   │   └── ChannelRow × N (# text, 🔊 voice, unread bold, lock icon)
│   ├── DM list (when in DM mode — avatar, name, unread)
│   └── UserInfoBar (avatar, username, status, mic/deaf/settings icons)
│
└── ContentArea (flex-1)
    └── Placeholder: "Select a channel to start chatting"
```

**Deliverable:** Full sidebar renders with real data. Switching clans updates channel list. Unread badges update in real-time via WebSocket. Content area still shows placeholder.

---

### Stage 3 — Settings (Weeks 9–10)

**Route:** `/chat/clans/:clanId/channel-setting` + user settings modal

Self-contained, no real-time data — ideal first native page.

**GPUI views:**

```
SettingsModal (overlay — `Cmd+,` or settings gear)
├── TabBar
│   ├── My Account
│   ├── Privacy & Safety
│   ├── Notifications
│   ├── Appearance
│   ├── Voice & Video
│   └── Advanced
│
├── My Account tab
│   ├── Avatar + username + email display
│   └── Edit profile button → API call
│
├── Notifications tab
│   ├── Enable/disable desktop notifications toggle
│   ├── Notification sound toggle
│   └── Per-channel overrides list
│
├── Appearance tab
│   ├── Theme: Dark / Light / Auto (follows system)
│   └── Zoom: slider 80%–150% → GPUI global scale factor
│
└── Advanced tab
    ├── Hardware acceleration toggle (requires restart prompt)
    └── Auto-start on login toggle
```

**Deliverable:** Settings modal opens/closes (`Cmd+,`). Theme toggle applies instantly. Advanced settings persist.

---

### Stage 4 — Image Viewer Window (Weeks 11–12)

**Replaces:** `apps/desktop/src/assets/image-window/window_image.ts` (1500-line inline HTML popup)

A **separate secondary GPUI Window** — transparent background, popup style.

**GPUI views:**

```
ImageViewerWindow (secondary Window — transparent bg)
├── TitleBar (minimize, toggle-maximize, close)
│
├── MainImageArea
│   ├── ImageElement — GPU-decoded (image crate → GPUI texture)
│   │   ├── Mouse wheel → zoom in/out
│   │   ├── Click + drag → pan
│   │   └── Double-click → fit to window
│   ├── VideoElement (for .mp4/.webm attachments)
│   ├── Zoom controls (+ / - / fit buttons)
│   └── Rotate controls (← 90° / → 90°)
│
├── ThumbnailStrip (bottom, horizontally scrollable, virtualized)
│   ├── ThumbnailItem × N (only visible range rendered — binary search)
│   ├── Selected item: highlighted border
│   └── Load-more trigger at 5 items from edge → fetch next batch
│
└── ContextMenu (right-click)
    ├── Copy Link
    ├── Copy Image → arboard clipboard
    ├── Save Image → rfd save dialog
    └── Open in Browser → open crate
```

**Keyboard shortcuts:** `Esc` close, `←/→` prev/next image, `+/-` zoom, `R` rotate

**imgproxy URL:** `https://imgproxy.mezon.ai/{key}/rs:{type}:{w}:{h}:1/mb:2097152/plain/{url}@webp`

**Deliverable:** Clicking any image in the app opens the native GPUI image viewer. Zoom, rotate, thumbnail navigation all work natively.

---

### Stage 5 — Direct Messages (Weeks 13–16)

**Route:** `/chat/direct/message/:directId/:type`

Core messaging component — establishes the reusable `MessageList` and `MessageInputBar` used by all subsequent stages.

**`mezon-client` work:**

-   `GET /v2/channels/:id/messages?limit=50&cursor=X` — paginated history (cursor-based)
-   WebSocket event: `channel_message` → append to `MessagesModel`
-   `POST /v2/channels/:id/messages` — send message (with temp Snowflake ID for optimistic UI)
-   `PUT /v2/channels/:id/messages/:msgId` — edit
-   `DELETE /v2/channels/:id/messages/:msgId` — delete
-   `PUT /v2/channels/:id/seen` — mark as read
-   WebSocket send: `channel_typing` → update `TypingModel`
-   WebSocket receive: `channel_typing` → show typing indicator

**Message data model (from Redux store analysis):**

```rust
pub struct Message {
    pub id: String,                    // Snowflake ID
    pub channel_id: String,
    pub sender_id: String,
    pub username: String,
    pub content: MessageContent,       // { t: String } + rich content
    pub attachments: Vec<Attachment>,
    pub mentions: Vec<Mention>,
    pub reactions: Vec<Reaction>,
    pub references: Vec<MessageRef>,   // replies
    pub create_time_seconds: i64,
    pub update_time_seconds: Option<i64>,
    pub code: MessageCode,             // FIRST_MESSAGE, etc.
    // UI computed fields:
    pub is_group_start: bool,          // first in consecutive group from same sender
    pub is_day_start: bool,            // first message of the day
}
```

**GPUI views:**

```
DirectMessageView
├── DMHeader
│   ├── Recipient avatar + username
│   └── "This is the beginning of your direct message history with @{user}"
│
├── MessageList (virtual scroll — core reusable component)
│   ├── Only renders messages in viewport + 20-item buffer above/below
│   ├── Variable row heights — measured on first render, cached
│   ├── Scroll-to-bottom on new message (if already at bottom)
│   ├── "New Messages" separator line (last-seen boundary)
│   ├── "Jump to Present" button (when scrolled far up)
│   │
│   ├── DateSeparator ("Today" / "Yesterday" / "April 21, 2025")
│   │
│   └── MessageGroup (consecutive messages, same sender, <5 min apart)
│       ├── SenderAvatar (left, shown once per group)
│       ├── SenderName + Timestamp (shown once per group)
│       └── MessageRow × N
│           ├── TextContent (plain text — markdown in Stage 6)
│           ├── AttachmentGrid (images → click opens ImageViewer)
│           ├── ReactionBar (emoji + count + click to react)
│           ├── HoverActions (visible on mouse hover)
│           │   ├── Reply
│           │   ├── React (emoji picker)
│           │   ├── Edit (own messages)
│           │   └── Delete (own messages)
│           └── EditedIndicator "(edited)"
│
├── TypingIndicator
│   └── "{user} is typing..." / "{user1} and {user2} are typing..."
│
└── MessageInputBar
    ├── TextInput (multi-line, Shift+Enter = newline, Enter = send)
    ├── Attachment button → rfd file picker → upload → show inline preview
    ├── Emoji button → EmojiPicker panel (basic grid)
    └── Send button
```

**Deliverable:** Full DM conversations work. Send/receive real-time. Images open ImageViewer. Basic text. Typing indicators.

---

### Stage 6 — Text Channel (Weeks 17–22)

**Route:** `/chat/clans/:clanId/channels/:channelId`

Extends the message components from Stage 5 with channel-specific features and rich text rendering.

**Additional `mezon-client` work:**

-   Reaction add/remove: `PUT /v2/messages/:id/reactions`
-   Pin messages: `GET /v2/channels/:id/pinned`, `PUT /v2/messages/:id/pin`
-   Thread creation: `POST /v2/threads`
-   Member list: `GET /v2/channels/:id/members`

**Rich text rendering (extends Stage 5 plain text):**

| Syntax                 | Render                                          |
| ---------------------- | ----------------------------------------------- |
| `**bold**`             | Bold weight                                     |
| `*italic*`             | Italic style                                    |
| `~~strikethrough~~`    | Strikethrough                                   |
| `` `code` ``           | Inline code (monospace, bg highlight)           |
| ` ```lang\ncode\n``` ` | Code block with syntax highlighting (`syntect`) |
| `> quote`              | Blockquote with left border                     |
| `@username`            | Mention chip (avatar + name, highlighted bg)    |
| `#channel-name`        | Channel link (clickable → navigate)             |
| `:emoji_name:`         | Custom emoji image inline                       |
| `https://...`          | URL underlined + OGP embed card below           |

**Additional GPUI views:**

-   `PinnedMessagesPanel` — side panel listing pinned messages
-   `MessageContextMenu` — right-click: Reply, Edit, Delete, Pin, Copy ID, Report
-   `SystemMessageRow` — "Alice joined the clan", "Channel created", etc.
-   `UnreadSeparator` — "NEW MESSAGES ──────────────────"
-   `MemberListSidebar` — right panel, grouped by role, virtual list (toggle with `Cmd+Shift+M`)

**Deliverable:** Full channel messaging. Rich text renders. Reactions, pins, context menu functional. Unread badges accurate.

---

### Stage 7 — Rich Text Message Editor (Weeks 23–26)

**Upgrades:** `MessageInputBar` from Stages 5 & 6

The most complex single component. Starting point: adapt Zed's `editor` crate.

**Features:**

-   [ ] Multi-line editor with Shift+Enter newline, Enter send
-   [ ] `@mention` autocomplete dropdown (fuzzy-search clan members)
-   [ ] `#channel` autocomplete dropdown
-   [ ] `:emoji:` autocomplete with emoji picker popup
-   [ ] Markdown shortcuts: type `**` → bold mode, `` ` `` → code mode, etc.
-   [ ] Slash commands: `/giphy`, `/me`, `/shrug`
-   [ ] Paste image → upload to CDN → inline preview in editor
-   [ ] Drag-and-drop file → attachment preview
-   [ ] Press `↑` to edit last sent message
-   [ ] Draft persistence per channel (saved to `mezon-store`)
-   [ ] Character limit indicator (2000 chars)
-   [ ] Send loading state (optimistic UI with Snowflake temp ID)

**Deliverable:** Full-featured message editor matching current React app behavior.

---

### Stage 8 — Threads (Weeks 27–28)

**Route:** `/chat/clans/:clanId/channels/:channelId/threads/:threadId`

Thread panel slides in as a right overlay alongside the main message list. Reuses `MessageList` and `MessageInputBar` from Stage 6/7.

**Additional state:**

-   `ThreadsModel` — thread metadata, parent message reference
-   Thread header: parent message preview + "Thread" title
-   Thread list in channel: inline thread summary below parent message

---

### Stage 9 — Members + User Profiles (Weeks 29–30)

**Route:** `/chat/clans/:clanId/member-safety`

**GPUI views:**

```
MemberSidebar (right panel, toggled)
├── Search members input
├── Role group header ("ONLINE — 12", "OFFLINE — 48")
└── MemberRow × N (virtual list)
    ├── Avatar + presence dot (green/yellow/red/grey)
    ├── Username + display name
    └── Click → UserProfilePopover

UserProfilePopover (floating panel)
├── Banner + Avatar
├── Username + discriminator
├── "Playing {game}" / "Listening to {song}" (activity from ActivityModel)
├── Role badges
├── Note field (editable)
└── Action buttons: Send Message, Call
```

---

### Stage 10 — Notifications Panel (Week 31)

**GPUI views:**

```
NotificationPanel (dropdown from bell icon in TitleBar)
├── "Mark all as read" button
├── Filter tabs: All / Mentions / DMs
└── NotificationRow × N
    ├── Sender avatar + channel context
    ├── Message preview (truncated)
    ├── Timestamp
    └── Click → navigate to message (triggers jump-scroll in MessageList)
```

---

### Stage 11 — App Directory (Week 32)

**Route:** `/apps`

```
AppDirectoryView
├── Search input
├── Category filter tabs
└── AppCard grid × N
    ├── App icon + name + description
    ├── Install / Uninstall button
    └── Click → AppDetailModal
```

---

### Stage 12 — Voice Channel (Weeks 33–36)

**Partial voice — no video yet**

**`mezon-client` work:**

-   LiveKit Rust SDK: `livekit` crate (git dependency: `github.com/livekit/rust-sdks`)
-   Join voice channel → `Room::connect(url, token)`
-   Audio I/O: `cpal` crate — enumerate devices, capture mic, play remote audio
-   Publish local audio track → LiveKit room
-   Subscribe to remote audio tracks → play via `cpal`

**GPUI views:**

```
VoiceChannelBar (bottom overlay, shown when in a voice channel)
├── Channel name + clan name
├── Participant avatars (speaking ring animation)
├── Mute/Unmute button
├── Deafen/Undeafen button
└── Disconnect button

VoiceChannelView (in ContentArea when viewing a voice channel)
├── Participant tiles × N
│   ├── Avatar + speaking indicator (animated ring)
│   └── Username + muted indicator
└── "Join Voice" button (if not yet connected)
```

**Deliverable:** Voice calls work. Audio in/out. Mute/deafen. Speaking indicators animated.

---

### Stage 13 — Video Meeting + Screen Share (Weeks 37–42)

**Routes:** `/meet`, `/meeting/:code`

**Technical challenge:** LiveKit delivers raw YUV/RGB video frames. These must be uploaded as `wgpu::Texture` each frame and rendered via a custom GPUI element.

**`mezon-client` work:**

-   Camera capture: platform APIs via `objc2` (macOS) / `windows-rs` (Windows)
-   Screen capture: `scap` crate → raw frames → encode with `openh264` → publish as LiveKit track
-   Video subscribe: receive remote video tracks → YUV frames → `wgpu::Texture` → GPUI `VideoElement`

**GPUI views:**

```
MeetingView
├── VideoGrid (responsive — 1, 2×2, 3×3 based on participant count)
│   └── VideoTile × N
│       ├── VideoElement (custom GPUI element wrapping wgpu texture)
│       ├── Participant name overlay
│       └── Speaking indicator border
│
├── Spotlight mode (pin a participant to full-screen)
│
└── ControlBar (bottom)
    ├── Mute/Unmute
    ├── Camera on/off
    ├── Share Screen button → scap source picker
    ├── Participants button → side panel
    └── End Call / Leave button
```

**Screen share source picker:**

```
ScreenPickerModal
├── "Entire Screen" section (batched — 12 initial, load 8 more)
└── "Application Window" section
    └── SourceCard × N (thumbnail + name)
```

---

### Stage 14 — AI Generation + Remaining Pages (Weeks 43–44)

**Routes:** `/aigeneration`, `/integrations`, `/organize`, `/customize`

-   **AI Generation:** Streaming text output display (SSE or WebSocket chunks → append to GPUI text view)
-   **Integrations:** Webhook management forms, API key display
-   **Organize:** Clan management forms
-   **Customize:** Theme/branding upload forms
-   **Public pages** (`/about`, `/privacy-policy`, `/terms-of-service`, `/brand-center`): Static text + images — low effort

---

### Stage 15 — Remove Electron (Week 45)

-   [ ] Delete `apps/desktop/` directory
-   [ ] Remove Electron dependencies from root `package.json`
-   [ ] Update Nx workspace config (`nx.json`, `workspace.json`) to remove desktop target
-   [ ] Update CI/CD GitHub Actions workflows to build only `apps/desktop-rs/`
-   [ ] Update App Store connect listing: new binary, same App ID `E9Y2J54ZH3.app.mezon.ai`
-   [ ] Update Windows Store listing: `MEZON.Mezon_vdgv9gtrfadw6!MEZON.Mezon`
-   [ ] Update auto-update manifest on `cdn.mezon.ai/release/` to point to new binary

---

## Packaging & Distribution

| Platform | Format                      | Tool                                           |
| -------- | --------------------------- | ---------------------------------------------- |
| macOS    | `.app` bundle               | `cargo-bundle`                                 |
| macOS    | DMG (x64 + arm64 universal) | `create-dmg`                                   |
| macOS    | Notarization                | `xcrun notarytool` (Apple team `E9Y2J54ZH3`)   |
| macOS    | App Store (`id6756601798`)  | Transporter                                    |
| Windows  | NSIS installer              | NSIS scripts                                   |
| Windows  | Portable EXE                | —                                              |
| Windows  | APPX (Microsoft Store)      | `makeappx` (Store ID: `MEZON.Mezon`)           |
| Linux    | `.deb`                      | `cargo-deb`                                    |
| Linux    | AppImage                    | `appimagetool`                                 |
| Linux    | MIME handler                | `x-scheme-handler/mezonapp` in `.desktop` file |

---

## Timeline Summary

| Stage | Description                                              | Duration | Cumulative |
| ----- | -------------------------------------------------------- | -------- | ---------- |
| 0     | Foundation — app shell, tray, deep links, auth flow      | 3 weeks  | Week 3     |
| 1     | Auth pages — login, OAuth callback                       | 2 weeks  | Week 5     |
| 2     | App shell + sidebars (clan list, channel list, user bar) | 3 weeks  | Week 8     |
| 3     | Settings modal                                           | 2 weeks  | Week 10    |
| 4     | Image viewer window                                      | 2 weeks  | Week 12    |
| 5     | Direct messages + core MessageList + MessageInputBar     | 4 weeks  | Week 16    |
| 6     | Text channel + rich text rendering                       | 6 weeks  | Week 22    |
| 7     | Rich text message editor (mentions, emoji, markdown)     | 4 weeks  | Week 26    |
| 8     | Threads                                                  | 2 weeks  | Week 28    |
| 9     | Members sidebar + user profile popover                   | 2 weeks  | Week 30    |
| 10    | Notifications panel                                      | 1 week   | Week 31    |
| 11    | App directory                                            | 1 week   | Week 32    |
| 12    | Voice channel (LiveKit audio)                            | 4 weeks  | Week 36    |
| 13    | Video meeting + screen share                             | 6 weeks  | Week 42    |
| 14    | AI generation + remaining pages                          | 2 weeks  | Week 44    |
| 15    | Remove Electron, update CI/CD                            | 1 week   | Week 45    |

**~11 months** for complete migration with a dedicated team.  
**~5 months** (Stages 0–7) for a fully shippable app covering all core use cases.

---

## IPC Surface Migration (Electron → Native Rust)

Every `ipcMain.handle` / `ipcRenderer.invoke` in the Electron app is replaced by direct Rust function calls.

| Electron IPC Channel                        | Rust equivalent                                                       |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `APP::GET_DEVICE_ID`                        | `mezon_native::device::get_device_id()`                               |
| `APP::SET_BADGE_COUNT`                      | `mezon_native::badge::set_badge_count(n)`                             |
| `APP::DOWNLOAD_FILE`                        | `rfd::AsyncFileDialog::save_file()` + `tokio::fs::write()`            |
| `APP::OPEN_NEW_WINDOW`                      | `gpui::App::open_window()` → `ImageViewerWindow`                      |
| `APP::TITLE_BAR_ACTION`                     | `gpui::WindowContext::minimize/maximize/close()`                      |
| `APP::MAC_WINDOWS_ACTION`                   | `gpui::WindowContext::set_bounds()`                                   |
| `APP::REQUEST_PERMISSION_SCREEN`            | `scap::get_sources()` batched                                         |
| `APP::ACTION_SHOW_IMAGE`                    | `arboard::Clipboard::set_image()` / `rfd::save()`                     |
| `APP::SHOW_NOTIFICATION`                    | `mezon_native::notifications::show()`                                 |
| `APP::LOCK_SCREEN` / `UNLOCK_SCREEN`        | `mezon_native::power::subscribe_lock_events()`                        |
| `APP::UPDATE_ACTIVITY_TRACKING`             | `mezon_native::activity::start_polling()`                             |
| `APP::AUTO_START_APP`                       | `auto_launch::AutoLaunch::enable/disable()`                           |
| `APP::TOGGLE_HARDWARE_ACCELERATION`         | Restart with `--disable-gpu` flag equivalent                          |
| `APP::SYNC_REDUX_STATE` / `GET_REDUX_STATE` | `mezon_store::Settings::save/load()`                                  |
| `APP::QUIT_APP`                             | `gpui::App::quit()`                                                   |
| `PUSH_RECEIVER:::*`                         | `mezon_native::fcm::start_receiver()` — HTTP v1 FCM API via `reqwest` |

---

## Risks & Mitigations

| Risk                                          | Impact | Mitigation                                                                                         |
| --------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| GPUI API breaks on Zed update                 | High   | Pin to specific commit in `Cargo.toml`; upgrade deliberately during low-activity periods           |
| Windows GPUI support not fully mature         | High   | Run Spike 1 on Windows in Stage 0 before committing; macOS is primary target                       |
| Rich text editor complexity                   | High   | Start with plain text (Stage 5); add features incrementally each stage; adapt Zed's `editor` crate |
| Video frame rendering (Stage 13)              | High   | Defer to last stage; voice-only (Stage 12) is independently shippable                              |
| LiveKit Rust SDK maturity                     | Medium | Evaluate SDK in Stage 12 spike; keep fallback plan of `wry` WebView for video-only                 |
| `mezon-proto` Protobuf types                  | Medium | Generate with `prost-build` from the same `.proto` files the server uses                           |
| `mezon-client` feature parity with `mezon-js` | Medium | Map API calls one-by-one from the Redux slice thunks in `libs/store/`                              |
| macOS notarization / code signing             | Low    | Set up early in Stage 0 CI; use same Apple Team ID `E9Y2J54ZH3`                                    |

---

## References

-   GPUI source: https://github.com/zed-industries/zed/tree/main/crates/gpui
-   GPUI examples: https://github.com/zed-industries/zed/tree/main/crates/gpui/examples
-   Existing Electron app: `apps/desktop/src/`
-   Existing React app pages: `apps/chat/src/app/pages/`
-   Existing Redux store: `libs/store/src/lib/`
-   Existing transport layer: `libs/transport/src/lib/`
-   LiveKit Rust SDK: https://github.com/livekit/rust-sdks
-   Halloy IRC client (Iced reference, similar domain): https://github.com/squidowl/halloy
