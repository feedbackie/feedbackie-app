window.feedbackie_settings = window.feedbackie_settings || [];

window.feedbackie_settings.base_url = window.feedbackie_settings.base_url || "https://feedbackie.app"
window.feedbackie_settings.report_enabled = window.feedbackie_settings.report_enabled || false
window.feedbackie_settings.feedback_enabled = window.feedbackie_settings.feedback_enabled || false
window.feedbackie_settings.report_insert_type = window.feedbackie_settings.report_insert_type || 'beforebegin'
window.feedbackie_settings.feedback_insert_type = window.feedbackie_settings.feedback_insert_type || 'beforebegin'

window.feedbackie_settings.report_anchor_selector = window.feedbackie_settings.report_anchor_selector || null
window.feedbackie_settings.feedback_anchor_selector = window.feedbackie_settings.feedback_anchor_selector || null

window.feedbackie_settings.feedback_sticky_ratio = window.feedbackie_settings.feedback_sticky_ratio || 0.25

window.feedbackie_settings.report_locales = window.feedbackie_settings.report_locales || []
window.feedbackie_settings.feedback_locales = window.feedbackie_settings.feedback_locales || []

import {Feedback} from "./feedback/feedback"
import {Report} from "./report/report"
import {App} from "./app/app"

(async function () {
    let app = new App(window.feedbackie_settings)

    if (window.feedbackie_settings.feedback_enabled !== null) {
        let feedback = new Feedback(
            app,
            window.feedbackie_settings.feedback_anchor_selector,
            window.feedbackie_settings.feedback_insert_type,
            window.feedbackie_settings.feedback_sticky_ratio,
        )
        feedback.init()
    }

    if (window.feedbackie_settings.report_enabled !== null) {
        let report = new Report(
            app,
            window.feedbackie_settings.report_anchor_selector,
            window.feedbackie_settings.report_insert_type,
        )
        report.init()
    }
})();
