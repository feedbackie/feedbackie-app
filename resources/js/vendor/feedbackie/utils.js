function generateSessionId() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getCurrentTime() {
    return Math.floor(Date.now() / 1000)
}

function addShadowStyles(root, css) {
    if ('adoptedStyleSheets' in root && 'replaceSync' in CSSStyleSheet.prototype) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);

        root.adoptedStyleSheets = [
            ...root.adoptedStyleSheets,
            sheet,
        ];

        return;
    }

    const style = document.createElement('style');
    style.textContent = css;
    root.appendChild(style);
}

export {generateSessionId, getCurrentTime, addShadowStyles}
