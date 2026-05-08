window.feedbackie_settings = window.feedbackie_settings || [];

window.feedbackie_settings.base_url = window.feedbackie_settings.base_url || ""
window.feedbackie_settings.display_powered_by = window.feedbackie_settings.display_powered_by || false

window.feedbackie_settings.report_enabled = window.feedbackie_settings.report_enabled || false
window.feedbackie_settings.report_display_message = window.feedbackie_settings.report_display_message || true
window.feedbackie_settings.report_display_button = window.feedbackie_settings.report_display_button || true
window.feedbackie_settings.report_message_insert_type = window.feedbackie_settings.report_message_insert_type || 'beforebegin'
window.feedbackie_settings.report_message_anchor_selector = window.feedbackie_settings.report_message_anchor_selector || null
window.feedbackie_settings.report_locales = window.feedbackie_settings.report_locales || []

window.feedbackie_settings.feedback_enabled = window.feedbackie_settings.feedback_enabled || false
window.feedbackie_settings.feedback_widget_insert_type = window.feedbackie_settings.feedback_widget_insert_type || 'beforebegin'
window.feedbackie_settings.feedback_widget_anchor_selector = window.feedbackie_settings.feedback_widget_anchor_selector || null
window.feedbackie_settings.feedback_widget_theme = window.feedbackie_settings.feedback_widget_theme || "adaptive"
window.feedbackie_settings.feedback_sticky_ratio = window.feedbackie_settings.feedback_sticky_ratio || 0
window.feedbackie_settings.feedback_sticky_percent = window.feedbackie_settings.feedback_sticky_percent || 0.50
window.feedbackie_settings.feedback_locales = window.feedbackie_settings.feedback_locales || []

import {Feedback} from "./feedback/feedback"
import {Report} from "./report/report"
import {App} from "./app/app"

(async function () {
    let app = new App(window.feedbackie_settings, "1.0.4")

    if (window.feedbackie_settings.feedback_enabled !== false) {
        let feedback = new Feedback(
            app,
            window.feedbackie_settings.feedback_widget_anchor_selector,
            window.feedbackie_settings.feedback_widget_insert_type,
            window.feedbackie_settings.feedback_widget_theme,
            window.feedbackie_settings.feedback_sticky_ratio,
            window.feedbackie_settings.feedback_sticky_percent,
            window.feedbackie_settings.display_powered_by,
        )
        feedback.init()
    }

    if (window.feedbackie_settings.report_enabled !== false) {
        let report = new Report(
            app,
            window.feedbackie_settings.report_display_message,
            window.feedbackie_settings.report_display_button,
            window.feedbackie_settings.report_message_anchor_selector,
            window.feedbackie_settings.report_message_insert_type,
            window.feedbackie_settings.display_powered_by,
        )
        report.init()
    }
})();
