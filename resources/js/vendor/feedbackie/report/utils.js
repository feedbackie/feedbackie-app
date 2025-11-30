function htmlspecialchars(str) {
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
    };

    return str.replace(/[&<>"']/g, (match) => escapeMap[match]);
}

function htmlspecialchars_decode(str) {
    const escapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
    };

    return str.replace(/\&[\w\d\#]{1,5}\;/g, (match) => escapeMap[match]);
}

export {htmlspecialchars_decode, htmlspecialchars}
