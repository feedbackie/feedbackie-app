let locales = {
    "keys": [
        "suggest_corrections_for_the_text",
        "here_you_can_make_your_changes",
        "comment",
        "send",
        "close",
        "you_have_selected_too_many_text",
        "your_message_has_been_sent_successfully_thank_you",
        "sorry_but_something_went_wrong_you_can_try_send_the_feedback_later",
        "found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button",
    ],
    "en": {
        suggest_corrections_for_the_text: "Suggest corrections for the text",
        here_you_can_make_your_changes: "Here you can make your changes:",
        comment: "Comment:",
        send: "Send",
        close: "Close",
        you_have_selected_too_many_text: "You have selected too many text!",
        your_message_has_been_sent_successfully_thank_you: "Your message has been sent successfully. Thank you!",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "Sorry, but something went wrong. You can try send the feedback later.",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Found a mistake in the text? Let us know about that. Highlight the text with the mistake and press Ctrl+Enter or ✏️ button.",
    },
    "uk": {
        suggest_corrections_for_the_text: "Запропонувати виправлення",
        here_you_can_make_your_changes: "Тут ви можете внести свої зміни:",
        comment: "Коментар:",
        send: "Відправити",
        close: "Закрити",
        you_have_selected_too_many_text: "Ви вибрали забагато тексту!",
        your_message_has_been_sent_successfully_thank_you: "Ваше повідомлення відправлено успішно. Дякуємо!",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "Нажаль не вдалось відправити повідомлення, спробуйте пізніше",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Знайшли помилку в статті? Повідомте про неї. Виділіть текст мишкою та натисніть Ctrl+Enter або кнопку зі значком ✏️."
    },
    "ru": {
        suggest_corrections_for_the_text: "Предложить исправления",
        here_you_can_make_your_changes: "Здесь вы можете внести изменения:",
        comment: "Комментарий:",
        send: "Отправить",
        close: "Закрыть",
        you_have_selected_too_many_text: "Вы выделили слишком много текста!",
        your_message_has_been_sent_successfully_thank_you: "Ваше сообщение отправлено успешно. Спасибо!",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "К сожалению не удалось отправить сообщение. Попробуйте позже.",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Обнаружили ошибку в тексте? Сообщите нам об этом. Выделите текст с ошибкой и нажмите Ctrl+Enter или кнопку со значком ✏️."
    },
}

function loadLocales () {
    const localesFromConfig = window.feedbackie_settings.feedback_locales || []
    localesFromConfig.forEach(function (value, index) {
        if (typeof locales[index] !== undefined) {
            locales[index].forEach(function (localization, key) {
                locales[index][key] = localization
            })
        } else {
            locales[index] = value
        }
    })
}

loadLocales()

export {locales}
