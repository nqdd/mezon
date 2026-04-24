use crate::theme::Theme;
use crate::title_bar::TitleBar;
use gpui::{div, prelude::*, Context, Entity, FontWeight, Window};

/// RootView is the top-level GPUI view for the main window.
/// Owns the TitleBar and the content area.
pub struct RootView {
    title_bar: Entity<TitleBar>,
}

impl RootView {
    pub fn new(title_bar: Entity<TitleBar>) -> Self {
        Self { title_bar }
    }
}

impl Render for RootView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        let theme = Theme::dark();

        div()
            .flex()
            .flex_col()
            .size_full()
            .bg(theme.bg_primary)
            .text_color(theme.text_primary)
            .child(self.title_bar.clone())
            .child(
                // Content area placeholder — replaced screen by screen from Stage 1 onwards
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
                    ),
            )
    }
}
