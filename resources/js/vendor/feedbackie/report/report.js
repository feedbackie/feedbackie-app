import {reportModalTemplate} from "./templates";
import {localize, translate} from "../localize"
import {locales} from "./locales"
import {htmlspecialchars, htmlspecialchars_decode} from "./utils";
import {addShadowStyles} from "../utils.js";
import reportCss from './report.css?inline'

export class Report {
    #app = null

    #modalContainer = null
    #displayMessage = true
    #displayButton = true
    #selector = null
    #insertType = null
    #reportModalCode = ""

    #baseUrl = null

    #reportModal = null;
    #messageModal = null;

    #fixButton = null;
    #fixButtonHandler = null;

    #modalIsOpened = false

    constructor(app, displayMessage, displayButton, selector, insertType) {
        this.#app = app
        this.#baseUrl = app.getBaseUrl()

        this.#displayMessage = displayMessage
        this.#displayButton = displayButton

        this.#selector = selector
        this.#insertType = insertType
        this.#reportModalCode = localize(reportModalTemplate, locales)
    }

    setBaseUrl(url) {
        this.#baseUrl = url
    }

    init() {
        this.#modalContainer = document.createElement('div');
        document.body.appendChild(this.#modalContainer);

        const shadow = this.#modalContainer.attachShadow({ mode: "open" })
        addShadowStyles(shadow, reportCss)
        shadow.innerHTML = this.#reportModalCode

        this.#reportModal = this.#modalContainer.shadowRoot.getElementById("feedbackie-mistakes-report-modal");
        const _this = this
        this.#reportModal.addEventListener('close', function() {
           _this.#modalIsOpened = false
        });
        this.#messageModal = this.#modalContainer.shadowRoot.getElementById("report-result-modal");

        this.#insertNotificationAboutReporting()
        this.#registerReportingBindings()
        this.#addFixButtonOnSelection()
    }

    #insertNotificationAboutReporting() {
        if(this.#displayMessage === false) {
            return
        }

        if (this.#selector === null) {
            return
        }
        let anchorElement = document.getElementById(this.#selector)

        if (anchorElement !== null) {
            let messageContainer = document.createElement('p')

            messageContainer.style.color = 'gray'
            messageContainer.style.marginTop = "20px"
            messageContainer.style.marginBottom = "20px"
            messageContainer.innerHTML = translate("found_a_mistake_in_the_text_let_us_know_about_that_highlight_the_text_with_the_mistake_and_press_ctrl_enter_or_button", locales)

            anchorElement.insertAdjacentElement(this.#insertType, messageContainer)
        }
    }

    #registerReportingBindings() {
        const _this = this

        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                if (this.#modalIsOpened) {
                    return;
                }

                const selectionInfo = this.#getSelectedText();

                let textForCheckLength = selectionInfo.selectedText.replace(/(<([^>]+)>)/gi, "");

                if (textForCheckLength.length === 0) {
                    this.#openMessageModalWithText("error", "cant_get_selected_text")

                    return;
                }

                if (textForCheckLength.length > 512) {
                    this.#openMessageModalWithText("error", "you_have_selected_too_many_text")

                    return;
                }

                this.#openReportModal(selectionInfo)
            }

            //do nothing
        });


        let submit = this.#modalContainer.shadowRoot.getElementById("report-submit");
        let commentElement = this.#modalContainer.shadowRoot.getElementById("report-comment")
        let textElement = this.#modalContainer.shadowRoot.getElementById('report-selected-text')
        let fullTextElement = this.#modalContainer.shadowRoot.getElementById('report-full-text')
        let selectedTextElement = this.#modalContainer.shadowRoot.getElementById('report-orig-selected-text')
        let offsetElement = this.#modalContainer.shadowRoot.getElementById('report-offset')

        submit.addEventListener("click", function () {
            let comment = commentElement.value
            let fixedText = textElement.innerText
            let fullText = fullTextElement.value
            let selectedText = selectedTextElement.value
            let offset = offsetElement.value

            let text = _this.#sanitizeSelectedText(fullText)

            _this.#reportModal.close()

            _this.#sendReportAboutMistake(selectedText, text, fixedText, comment, offset)
        }, false)
    }

    #openReportModal(selectionInfo) {
        const selectedText = selectionInfo.selectedText;
        const fullText = selectionInfo.extendedText;

        let submit = this.#modalContainer.shadowRoot.getElementById("report-submit");
        let commentElement = this.#modalContainer.shadowRoot.getElementById("report-comment")
        commentElement.value = ""

        let textElement = this.#modalContainer.shadowRoot.getElementById('report-selected-text')
        textElement.innerHTML = fullText;

        let fullTextElement = this.#modalContainer.shadowRoot.getElementById('report-full-text')
        fullTextElement.value = fullText;

        let originalSelectedElement = this.#modalContainer.shadowRoot.getElementById('report-orig-selected-text')
        originalSelectedElement.value = selectedText;

        let offsetElement = this.#modalContainer.shadowRoot.getElementById('report-offset')
        offsetElement.value = selectionInfo.offset;

        this.#reportModal.showModal();
        this.#modalIsOpened = true
    }

    #openMessageModalWithText(title, text) {
        this.#modalContainer.shadowRoot.getElementById("report-result-title").innerText = translate(title, locales)
        this.#modalContainer.shadowRoot.getElementById("report-result-message").innerText = translate(text, locales)
        this.#messageModal.showModal()
    }

    async #sendReportAboutMistake(selectedText, fullText, fixedText, comment, offset) {
        let data = {
            selected_text: htmlspecialchars_decode(selectedText),
            full_text: fullText,
            fixed_text: fixedText,
            comment: htmlspecialchars_decode(comment),
            offset: offset,
            url: window.location.href,
            ss: this.#app.getSessionId(),
            ls: this.#app.getLoadedTime(),
            ts: this.#app.getCurrentTime(),
            version: this.#app.getVersion(),
        }

        try {
            let response = await fetch(this.#baseUrl + 'api/site/' + this.#app.getSiteId() + '/report', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(data)
            })

            let messageKey
            let titleKey
            if (response.ok) {
                titleKey = "thank_you"
                messageKey = "your_message_has_been_sent_successfully_thank_you"
            } else {
                titleKey = "error"
                messageKey = "sorry_but_something_went_wrong_you_can_try_send_the_feedback_later"
            }

            this.#openMessageModalWithText(titleKey, messageKey)

        } catch (e) {
            this.#openMessageModalWithText("error", "sorry_but_something_went_wrong_you_can_try_send_the_feedback_later")
            throw e
        }
    }

    #extendRange(extendedRange) {
        for (let i = 0; i < 30; i++) {
            if (extendedRange.startOffset > 0) {
                extendedRange.setStart(extendedRange.startContainer, extendedRange.startOffset - 1);
            } else {
                let startNode = extendedRange.startContainer.previousSibling || extendedRange.startContainer.parentNode;
                if (startNode !== undefined && startNode.nodeType === Node.TEXT_NODE) {
                    extendedRange.setStart(startNode, startNode.textContent.length);
                }
            }
            if (extendedRange.endOffset < extendedRange.endContainer.length) {
                extendedRange.setEnd(extendedRange.endContainer, extendedRange.endOffset + 1);
            } else {
                let endNode = extendedRange.endContainer.nextSibling || extendedRange.endContainer.parentNode;
                if (endNode !== undefined && endNode.nodeType === Node.TEXT_NODE) {
                    extendedRange.setEnd(endNode, 0);
                }
            }
        }
    }

    #findContainerElementOffset(range) {
        let element = range.commonAncestorContainer;
        let prevElement = element;
        while (element.classList === undefined || false === element.classList.contains('entry-content')) {
            if (element.parentElement !== null) {
                prevElement = element
                element = element.parentElement;
            } else {
                break;
            }
        }

        if (element.classList.contains('entry-content')) {
            let siblingCount = 0;

            while (prevElement.previousSibling != null) {
                // If the sibling is an element node, increment the counter
                if (prevElement.previousSibling.nodeType === 1
                    && prevElement.previousSibling.nodeName !== 'DIV'
                ) {
                    siblingCount++;
                }

                // Move to the previous sibling
                prevElement = prevElement.previousSibling;
            }

            return siblingCount
        } else {
            return 0
        }

    }

    #getSelectedText() {
        const selection = window.getSelection();
        const selectedText = htmlspecialchars(selection.toString());

        if(selectedText.length === 0) {
            return {
                offset: 0,
                selectedText: selectedText,
                extendedText: ""
            };
        }

        const range = selection.getRangeAt(0);
        const extendedRange = range.cloneRange();
        this.#extendRange(extendedRange)

        let extendedText = extendedRange.toString()
        extendedText = htmlspecialchars(extendedText)
        extendedText = extendedText.replace(/\n/g, " ")
        extendedText = extendedText.replace(/[\s]+/g, " ")

        let needle = selectedText
        needle = needle.replace(/\n/g, " ")
        needle = needle.replace(/[\s]+/g, " ")

        extendedText = extendedText.replace(needle, "<span style=\"color:red\">" + selectedText + "</span>")

        window.extendedText = extendedText
        window.needle = needle

        return {
            offset: this.#findContainerElementOffset(range),
            selectedText: selectedText,
            extendedText: extendedText
        };
    }

    #sanitizeSelectedText(text) {
        text = text.replace("<span style=\"color:red\">", "[sel]")
        text = text.replace("</span>", "[/sel]")
        return htmlspecialchars_decode(text)
    }

    #addFixButtonOnSelection() {
        if(this.#displayButton === false) {
            return
        }

        const _this = this
        if (this.#fixButton) return; // Already added
        this.#fixButton = document.createElement('button');
        this.#fixButton.innerText = '✏️';
        this.#fixButton.style.position = 'fixed';
        this.#fixButton.style.top = '120px';
        this.#fixButton.style.left = '20px';
        this.#fixButton.style.zIndex = '9999';
        this.#fixButton.style.display = 'none';
        this.#fixButton.style.background = '#393939';
        this.#fixButton.style.color = '#fff';
        this.#fixButton.style.border = 'none';
        this.#fixButton.style.borderRadius = '4px';
        this.#fixButton.style.padding = '8px 16px';
        this.#fixButton.style.fontWeight = 'bold';
        this.#fixButton.style.cursor = 'pointer';
        document.body.appendChild(this.#fixButton);

        this.#fixButtonHandler = function() {
            const selectionInfo = _this.#getSelectedText();

            if (selectionInfo.selectedText.length === 0) {
                _this.#openMessageModalWithText("error", "cant_get_selected_text")

                return;
            }

            if (_this.#modalIsOpened) {
                return;
            }

            _this.#openReportModal(selectionInfo);

            _this.#fixButton.style.display = 'none';
        };
        this.#fixButton.addEventListener('click', this.#fixButtonHandler);

        document.addEventListener('selectionchange', function() {
            if (_this.#modalIsOpened) {
                return;
            }

            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                _this.#fixButton.style.display = 'block';
                _this.#fixButton.style.top = _this.#calculateFixButtonCursorVerticalPosition(selection) + "px"
            } else {
                _this.#fixButton.style.display = 'none';
            }
        });
    }

    #calculateFixButtonCursorVerticalPosition(selection){
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            return 120;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const mouseY = rect.top;

        if(mouseY < 170){
            return 120
        }

        if(mouseY > window.innerHeight - 120){
            return window.innerHeight - 120
        }

        return mouseY - 50
    }
}
