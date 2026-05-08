let locales = {
    "keys": [
        "suggest_corrections_for_the_text",
        "here_you_can_make_your_changes",
        "comment",
        "send",
        "close",
        "you_have_selected_too_many_text",
        "thank_you",
        "error",
        "your_message_has_been_sent_successfully_thank_you",
        "sorry_but_something_went_wrong_you_can_try_send_the_feedback_later",
        "found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button",
        "cant_get_selected_text",
        "powered_by_feedbackie",
    ],
    "en": {
        suggest_corrections_for_the_text: "Suggest corrections for the text",
        here_you_can_make_your_changes: "Here you can make your changes:",
        comment: "Comment:",
        send: "Send",
        close: "Close",
        you_have_selected_too_many_text: "You have selected too many text!",
        thank_you: "Thank you!",
        error: "Error",
        your_message_has_been_sent_successfully_thank_you: "Your message has been sent successfully.",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "Sorry, but something went wrong. You can try send the feedback later.",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Found a mistake in the text? Let us know about it. Highlight the text with the mistake and press Ctrl+Enter or ✏️ button.",
        cant_get_selected_text: "Unable to get selected text!",
        powered_by_feedbackie: "Powered by Feedbackie",
    },
    "uk": {
        suggest_corrections_for_the_text: "Запропонувати виправлення",
        here_you_can_make_your_changes: "Тут ви можете внести свої зміни:",
        comment: "Коментар:",
        send: "Відправити",
        close: "Закрити",
        you_have_selected_too_many_text: "Ви вибрали забагато тексту!",
        thank_you: "Дякуємо!",
        error: "Помилка",
        your_message_has_been_sent_successfully_thank_you: "Ваше повідомлення відправлено успішно.",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "Нажаль не вдалось відправити повідомлення, спробуйте пізніше",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Знайшли помилку в статті? Повідомте про неї. Виділіть текст мишкою та натисніть Ctrl+Enter або кнопку зі значком ✏️.",
        cant_get_selected_text: "Не вдалось отримати виділений текст, виділіть текст та спробуйте ще раз.",
        powered_by_feedbackie: "Зроблено з Feedbackie",
    },
    "ru": {
        suggest_corrections_for_the_text: "Предложить исправления",
        here_you_can_make_your_changes: "Здесь вы можете внести изменения:",
        comment: "Комментарий:",
        send: "Отправить",
        close: "Закрыть",
        thank_you: "Спасибо!",
        error: "Ошибка",
        you_have_selected_too_many_text: "Вы выделили слишком много текста!",
        your_message_has_been_sent_successfully_thank_you: "Ваше сообщение отправлено успешно.",
        sorry_but_something_went_wrong_you_can_try_send_the_feedback_later: "К сожалению не удалось отправить сообщение. Попробуйте позже.",
        found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button: "Обнаружили ошибку в тексте? Сообщите нам об этом. Выделите текст с ошибкой и нажмите Ctrl+Enter или кнопку со значком ✏️.",
        cant_get_selected_text: "Не удалось получить выделенный текст. Выделите текст и попробуйте ещё раз",
        powered_by_feedbackie: "Сделано с Feedbackie",
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
