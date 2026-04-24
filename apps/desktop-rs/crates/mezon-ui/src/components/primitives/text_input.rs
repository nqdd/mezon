/// TextInput — single-line controlled text input as a stateful GPUI View.
///
/// Features: printable char input, Backspace, focus tracking, placeholder,
/// masked mode (password), optional label, optional error message.
use std::sync::Arc;

use gpui::{
    App, Context, FocusHandle, Focusable, MouseButton, SharedString, Window, div, prelude::*,
};

use crate::theme::Theme;

pub struct TextInput {
    pub(crate) focus_handle: FocusHandle,
    pub(crate) value: String,
    placeholder: SharedString,
    label: Option<SharedString>,
    error: Option<SharedString>,
    pub(crate) masked: bool,
    disabled: bool,
    pub(crate) on_change: Option<Arc<dyn Fn(&str, &mut Window, &mut App) + Send + Sync>>,
}

impl TextInput {
    pub fn new(cx: &mut Context<Self>, id: impl Into<SharedString>) -> Self {
        let _ = id; // used as identifier externally; FocusHandle is the internal key
        Self {
            focus_handle: cx.focus_handle(),
            value: String::new(),
            placeholder: SharedString::default(),
            label: None,
            error: None,
            masked: false,
            disabled: false,
            on_change: None,
        }
    }

    pub fn placeholder(mut self, text: impl Into<SharedString>) -> Self {
        self.placeholder = text.into();
        self
    }

    pub fn label(mut self, text: impl Into<SharedString>) -> Self {
        self.label = Some(text.into());
        self
    }

    pub fn with_error(mut self, err: Option<impl Into<SharedString>>) -> Self {
        self.error = err.map(Into::into);
        self
    }

    pub fn masked(mut self, m: bool) -> Self {
        self.masked = m;
        self
    }

    pub fn disabled(mut self, d: bool) -> Self {
        self.disabled = d;
        self
    }

    pub fn on_change(mut self, cb: Arc<dyn Fn(&str, &mut Window, &mut App) + Send + Sync>) -> Self {
        self.on_change = Some(cb);
        self
    }

    // ── Public getters/setters ───────────────────────────────────────────────

    pub fn value(&self) -> &str {
        &self.value
    }

    pub fn set_value(&mut self, value: String, cx: &mut Context<Self>) {
        self.value = value;
        cx.notify();
    }

    pub fn set_error(&mut self, err: Option<String>, cx: &mut Context<Self>) {
        self.error = err.map(SharedString::from);
        cx.notify();
    }

    // ── Key handling — called by parent via cx.update on Entity<TextInput> ───

    pub fn handle_char(&mut self, ch: char, window: &mut Window, cx: &mut Context<Self>) {
        if !self.disabled && !ch.is_control() {
            self.value.push(ch);
            self.fire_change(window, cx);
            cx.notify();
        }
    }

    pub fn handle_backspace(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        if !self.disabled && self.value.pop().is_some() {
            self.fire_change(window, cx);
            cx.notify();
        }
    }

    fn fire_change(&self, window: &mut Window, cx: &mut Context<Self>) {
        if let Some(cb) = &self.on_change {
            cb(&self.value, window, cx);
        }
    }
}

// ── GPUI View impl ────────────────────────────────────────────────────────────

impl Render for TextInput {
    fn render(&mut self, window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        let theme = Theme::dark();
        let is_focused = self.focus_handle.is_focused(window);
        let has_error = self.error.is_some();

        let border_color = if has_error {
            theme.status_dnd
        } else if is_focused {
            theme.brand
        } else {
            theme.border
        };

        let display_value: String = if self.masked {
            "●".repeat(self.value.len())
        } else {
            self.value.clone()
        };

        let show_placeholder = self.value.is_empty();
        let placeholder = self.placeholder.clone();
        let focus_handle = self.focus_handle.clone();

        // Capture key events on the focus-tracked div.
        // Actual char/backspace handling is done via handle_char/handle_backspace
        // so the parent entity (LoginView) can call cx.update on this entity.
        let input_box = div()
            .track_focus(&focus_handle)
            .flex()
            .flex_row()
            .items_center()
            .w_full()
            .h(gpui::px(40.0))
            .px_3()
            .bg(theme.bg_secondary)
            .rounded_md()
            .border_1()
            .border_color(border_color)
            .cursor_text()
            .on_mouse_down(MouseButton::Left, move |_event, window, cx| {
                window.focus(&focus_handle, cx);
            })
            .child(if show_placeholder {
                div()
                    .text_sm()
                    .text_color(theme.text_muted)
                    .child(placeholder)
            } else {
                div()
                    .text_sm()
                    .text_color(theme.text_primary)
                    .child(display_value)
            })
            .when(is_focused, |el| {
                el.child(
                    div()
                        .w(gpui::px(1.5))
                        .h(gpui::px(18.0))
                        .ml_1()
                        .bg(theme.brand),
                )
            });

        let mut container = div().flex().flex_col().gap_1().w_full();

        if let Some(label) = &self.label {
            container = container.child(
                div()
                    .text_xs()
                    .font_weight(gpui::FontWeight::MEDIUM)
                    .text_color(theme.text_secondary)
                    .child(label.clone()),
            );
        }

        container = container.child(input_box);

        if let Some(err) = &self.error {
            container = container.child(
                div()
                    .text_xs()
                    .text_color(theme.status_dnd)
                    .child(err.clone()),
            );
        }

        container
    }
}

impl Focusable for TextInput {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}
