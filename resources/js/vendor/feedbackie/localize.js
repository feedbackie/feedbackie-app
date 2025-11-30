let _currentLocale = null

function _getCurrentLanguage(locales) {
    if (window.feedbackie_settings.locale === 'en'
        || window.feedbackie_settings.locale === 'ru'
        || window.feedbackie_settings.locale === 'uk'
        || typeof locales[window.feedbackie_settings.locale] !== 'undefined'
    ) {
        return window.feedbackie_settings.locale;
    }

    if (_currentLocale !== null) {
        return _currentLocale
    }

    const userLocale =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0]
            : navigator.language;

    let codes = userLocale.split("-")

    if (codes.length > 0 && typeof locales[codes[0]] !== 'undefined') {
        _currentLocale = codes[0]
        return codes[0]
    } else {
        _currentLocale = "en"
        return "en";
    }
}


export function localize(html, locales) {
    const keys = locales.keys;

    keys.forEach(function (key) {
        html = html.replaceAll("{{" + key + "}}", translate(key, locales))
    })

    return html
}

export function translate(key, locales) {
    const currentLocale = _getCurrentLanguage(locales)

    if (locales === undefined) {
        return key
    }

    if (locales[currentLocale][key] === undefined) {
        return key
    }

    return locales[currentLocale][key];
}

