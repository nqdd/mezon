/// Set the app badge count on the dock icon (macOS) or taskbar overlay (Windows).
///
/// macOS: uses `NSDockTile.setBadgeLabel` via the `cocoa` crate.
/// Windows: `ITaskbarList3` overlay (stub — full impl in Stage 2).

pub fn set_badge_count(count: u32) {
    tracing::debug!("set_badge_count({})", count);

    #[cfg(target_os = "macos")]
    set_badge_macos(count);

    #[cfg(target_os = "windows")]
    set_badge_windows(count);
}

#[cfg(target_os = "macos")]
fn set_badge_macos(count: u32) {
    use objc::runtime::Object;
    use objc::{class, msg_send, sel, sel_impl};

    // Safety: must be called from main thread (guaranteed — GPUI runs UI on main).
    unsafe {
        // [NSApplication sharedApplication]
        let cls = class!(NSApplication);
        let app: *mut Object = msg_send![cls, sharedApplication];

        // [app dockTile]
        let dock_tile: *mut Object = msg_send![app, dockTile];

        // Build NSString badge label (or nil to clear)
        let label: *mut Object = if count == 0 {
            std::ptr::null_mut()
        } else {
            let label_str = count.to_string();
            let cls = class!(NSString);
            let s: *mut Object = msg_send![cls, alloc];
            let s: *mut Object = msg_send![s,
                initWithBytes: label_str.as_ptr()
                length: label_str.len()
                encoding: 4u64 // NSUTF8StringEncoding
            ];
            s
        };

        // [dockTile setBadgeLabel: label]
        let _: () = msg_send![dock_tile, setBadgeLabel: label];
    }
}

#[cfg(target_os = "windows")]
fn set_badge_windows(_count: u32) {
    // TODO Stage 2: implement via ITaskbarList3::SetOverlayIcon
    tracing::debug!("Windows badge not yet implemented");
}
