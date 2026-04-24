use crate::theme::Theme;
use crate::title_bar::TitleBar;
use gpui::{div, prelude::*, Context, Entity, FontWeight, Window};
use mezon_store::AuthState;

/// RootView is the top-level GPUI view for the main window.
/// Owns the TitleBar and switches content area based on `AuthState`.
pub struct RootView {
    title_bar: Entity<TitleBar>,
    auth_state: Entity<AuthState>,
}

impl RootView {
    pub fn new(title_bar: Entity<TitleBar>, auth_state: Entity<AuthState>) -> Self {
        Self {
            title_bar,
            auth_state,
        }
    }
}

impl Render for RootView {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let theme = Theme::dark();
        let state = self.auth_state.read(cx).clone();

        let content = match state {
            AuthState::NotAuthenticated => render_not_authenticated(&theme),
            AuthState::AwaitingCallback => render_awaiting_callback(&theme),
            AuthState::Authenticated(_) => render_authenticated_placeholder(&theme),
        };

        div()
            .flex()
            .flex_col()
            .size_full()
            .bg(theme.bg_primary)
            .text_color(theme.text_primary)
            .child(self.title_bar.clone())
            .child(content)
    }
}

fn render_not_authenticated(theme: &Theme) -> gpui::AnyElement {
    div()
        .flex()
        .flex_1()
        .items_center()
        .justify_center()
        .flex_col()
        .gap_4()
        // Logo mark
        .child(div().size_16().bg(theme.brand).rounded_lg())
        // App name
        .child(
            div()
                .text_xl()
                .font_weight(FontWeight::BOLD)
                .text_color(theme.text_primary)
                .child("Mezon"),
        )
        // Sign-in button
        .child(
            div()
                .px_6()
                .py_2()
                .bg(theme.brand)
                .rounded_md()
                .text_sm()
                .font_weight(FontWeight::MEDIUM)
                .text_color(gpui::white())
                .cursor_pointer()
                // Stage 1 will wire this to AuthService::begin_oauth
                .child("Sign in with Mezon"),
        )
        .into_any_element()
}

fn render_awaiting_callback(theme: &Theme) -> gpui::AnyElement {
    div()
        .flex()
        .flex_1()
        .items_center()
        .justify_center()
        .flex_col()
        .gap_4()
        .child(div().size_16().bg(theme.brand).rounded_lg())
        .child(
            div()
                .text_xl()
                .font_weight(FontWeight::BOLD)
                .text_color(theme.text_primary)
                .child("Mezon"),
        )
        .child(
            div()
                .text_sm()
                .text_color(theme.text_secondary)
                .child("Connecting — complete sign-in in your browser..."),
        )
        .into_any_element()
}

fn render_authenticated_placeholder(theme: &Theme) -> gpui::AnyElement {
    div()
        .flex()
        .flex_1()
        .items_center()
        .justify_center()
        .flex_col()
        .gap_3()
        .child(div().size_16().bg(theme.brand).rounded_lg())
        .child(
            div()
                .text_xl()
                .font_weight(FontWeight::BOLD)
                .text_color(theme.text_primary)
                .child("Mezon"),
        )
        .child(
            div()
                .text_sm()
                .text_color(theme.text_secondary)
                .child("Stage 0 — GPUI shell running"),
        )
        .into_any_element()
}
