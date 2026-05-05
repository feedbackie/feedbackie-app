import {basicTemplate} from "./templates";
import {extendedYesTemplate} from "./templates";
import {extendedNoTemplate} from "./templates";
import {statisticsTemplate} from "./templates";
import {localize} from "../localize"
import {translate} from "../localize"
import {locales} from "./locales"
import {addShadowStyles} from "../utils.js";
import feedbackCss from './feedback.css?inline'

export class Feedback {
    #app = null

    #selector = ""
    #insertType = "afterend"
    #container = null
    #questionContainer = null
    #extendedContainer = null
    #basicPopupCode = ""
    #codeForYesAnswer = ""
    #codeForNoAnswer = ""

    #baseUrl = null

    #feedbackRecordId = null

    #stickyRatio = 0.25
    #isSticky = false

    #displayPoweredBy = false

    constructor(app, selector, insertType, stickyRatio, displayPoweredBy) {
        this.#app = app
        this.#baseUrl = app.getBaseUrl()
        this.#selector = selector
        this.#insertType = insertType
        this.#basicPopupCode = localize(basicTemplate, locales)
        this.#codeForYesAnswer = localize(extendedYesTemplate, locales)
        this.#codeForNoAnswer = localize(extendedNoTemplate, locales)
        this.#stickyRatio = stickyRatio
        this.#isSticky = false
        this.#displayPoweredBy = displayPoweredBy
    }

    init() {
        const _this = this
        this.#container = document.getElementById(this.#selector);

        if (this.#container == null) {
            return;
        }

        const shadow = this.#container.attachShadow({ mode: "open" })
        addShadowStyles(shadow, feedbackCss)

        const shadowContainer = document.createElement("div");
        shadowContainer.innerHTML = this.#basicPopupCode

        shadow.append(shadowContainer)

        this.#extendedContainer = this.#container.shadowRoot.getElementById("sm-extended-feedback-container");
        this.#questionContainer = this.#container.shadowRoot.getElementById("sm-question-popup")

        if (this.#_shouldPopupBeSticky()) {
            this.#_addStickyWatcher()
        }

        this.#_addYesButtonHandler()
        this.#_addNoButtonHandler()

        let questionCloseBtn = this.#container.shadowRoot.getElementById("sm-question-close-button")

        questionCloseBtn.addEventListener("click", function () {
            questionCloseBtn.style.visibility = "hidden";
            //make not sticky
            _this.#questionContainer.style.display = "block";
            _this.#container.style.position = "relative";
        })

        document.addEventListener('keyup', function (event) {
            if (event.key === 'Escape') {
                _this.#_hideExtendedPopup()
            }
        });
    }

    #_getScrollPercent() {
        let h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    #_shouldPopupBeSticky() {
        return Math.random() < this.#stickyRatio;
    }

    #_addStickyWatcher() {
        const _this = this
        let popupAlreadyWasSticky = false

        document.addEventListener('scroll', function (e) {
            if (popupAlreadyWasSticky) {
                return;
            }

            if (_this.#_getScrollPercent() > 50) {
                popupAlreadyWasSticky = true
                _this.#container.style.position = "sticky"
                _this.#container.style.bottom = 0
                _this.#isSticky = true

                let questionCloseBtn = _this.#container.shadowRoot.getElementById("sm-question-close-button")
                questionCloseBtn.style.visibility = "visible"
            }
        });
    }

    #_addYesButtonHandler() {
        const _this = this
        let noBtn = _this.#container.shadowRoot.getElementById("sm-question-no-answer")
        let yesBtn = _this.#container.shadowRoot.getElementById("sm-question-yes-answer")
        let questionLabel = _this.#container.shadowRoot.getElementById("sm-question-label")
        yesBtn.addEventListener("click", async function (evt) {
            yesBtn.disabled = true
            noBtn.disabled = true
            questionLabel.innerText = translate("loading", locales)

            const stats = await _this.#_sendFeedbackAnswer("yes")

            if(null !== stats) {
                _this.#_hideBasicPopup()
                _this.#_showExtendedFeedbackPopupForYes(stats)
            }else{
                _this.#_hideBasicPopupWithError()
            }
        })
    }

    #_addNoButtonHandler() {
        const _this = this
        let noBtn = _this.#container.shadowRoot.getElementById("sm-question-no-answer")
        let yesBtn = _this.#container.shadowRoot.getElementById("sm-question-yes-answer")
        let questionLabel = _this.#container.shadowRoot.getElementById("sm-question-label")
        noBtn.addEventListener("click", async function (evt) {
            noBtn.disabled = true
            yesBtn.disabled = true
            questionLabel.innerText = translate("loading", locales)

            const stats = await _this.#_sendFeedbackAnswer("no")
            if(null !== stats) {
                _this.#_hideBasicPopup()
                _this.#_showExtendedFeedbackPopupForNo(stats)
            }else{
                _this.#_hideBasicPopupWithError()
            }
        })
    }

    #_showExtendedFeedbackPopupForYes(stats) {
        this.#extendedContainer.innerHTML = this.#codeForYesAnswer
        this.#container.style.position = "sticky"
        this.#_updateStatisticsData(stats)

        if (this.#displayPoweredBy === true){
            this.#_insertPoweredByLink()
        }

        this.#_handleExtendedPopup()
    }

    #_showExtendedFeedbackPopupForNo(stats) {
        this.#extendedContainer.innerHTML = this.#codeForNoAnswer
        this.#container.style.position = "sticky"
        this.#_updateStatisticsData(stats)

        if (this.#displayPoweredBy === true){
            this.#_insertPoweredByLink()
        }

        this.#_handleExtendedPopup()
    }

    #_updateStatisticsData(stats){
        let statsMessage = localize(statisticsTemplate, locales)
        statsMessage = statsMessage.replaceAll("%useful_count%", stats.usefulCount ?? 0)
        statsMessage = statsMessage.replaceAll("%not_useful_count%", stats.notUsefulCount ?? 0)

        const statsContainers = this.#container.shadowRoot.querySelectorAll('.sm-helpful-statistics')
        statsContainers.forEach(function(container){
            container.innerHTML = statsMessage
        });
    }

    #_handleExtendedPopup() {
        const _this = this
        const extendedCloseBtn = this.#container.shadowRoot.getElementById("sm-extended-close-button")

        if (_this.#isSticky) {
            const bodyElements = _this.#container.shadowRoot.querySelectorAll('.sm-extended-feedback-body')
            bodyElements.forEach(function(bodyElement) {
                bodyElement.style.maxHeight = "50vh"
            })
        }

        extendedCloseBtn.addEventListener("click", function () {
            _this.#_hideExtendedPopup()
        })

        const helpfulSubmitBtn = this.#container.shadowRoot.getElementById("sm-submit-helpful-button")

        helpfulSubmitBtn.addEventListener("click", async function (evt) {
            evt.preventDefault();

            if (_this.#feedbackRecordId === undefined) {
                _this.#_hideExtendedPopup()

                return;
            }

            const result = _this.#_sendExtendedFeedback()
            _this.#_hideExtendedPopup()

            if(result === false){
                _this.#questionContainer.innerHTML = translate("something_went_wrong", locales)
            }
        })
    }

    #_hideBasicPopup() {
        this.#questionContainer.style.display = "none";
        this.#questionContainer.innerHTML = translate("thank_you_for_your_feedback", locales)
    }

    #_hideBasicPopupWithError() {
        this.#questionContainer.style.display = "none";
        this.#questionContainer.innerHTML = translate("something_went_wrong", locales)
    }


    #_hideExtendedPopup() {
        this.#container.style.position = 'relative';
        this.#extendedContainer.innerHTML = "";
        this.#questionContainer.style.display = "block"
    }

    #_insertPoweredByLink() {
        const poweredByContainers = this.#container.shadowRoot.querySelectorAll(".sm-powered-by")
        poweredByContainers.forEach(function(element){
            const poweredByLink = document.createElement("a")
            poweredByLink.href = "https://feedbackie.app"
            poweredByLink.innerText = translate('powered_by_feedbackie', locales)
            poweredByLink.target = "_blank"

            element.append(poweredByLink)
        })
    }

    async #_sendFeedbackAnswer(answer) {
        const params = {
            answer: answer,
            url: window.location.href,
            ss: this.#app.getSessionId(),
            ls: this.#app.getLoadedTime(),
            ts: this.#app.getCurrentTime(),
        }

        try {
            const response = await fetch(this.#baseUrl + "api/site/" + this.#app.getSiteId() + '/feedback', {
                method: "POST",
                "headers": {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(params)
            })

            if (response.status !== 200) {
                return null
            }

            let data = await response.json();
            if (!data.success) {
                return null
            }

            this.#feedbackRecordId = data.id

            return {
               usefulCount: data.useful_count ?? 0,
               notUsefulCount: data.not_useful_count ?? 0,
            }
        } catch (e) {
            return null
        }
    }

    async #_sendExtendedFeedback() {
        const comment = this.#container.shadowRoot.getElementById("sm-helpful-comment").value

        let selected = []
        this.#container.shadowRoot.querySelectorAll(".sm-experience-checkbox:checked")
            .forEach(function (checkbox) {
                selected.push(checkbox.getAttribute("value"))
            })

        if (comment.length === 0 &&
            selected.length === 0) {
            this.#_hideExtendedPopup()

            return
        }

        let params = {
            "options": selected,
            "comment": comment,
            "ss": this.#app.getSessionId(),
            "ls": this.#app.getLoadedTime(),
            "ts": this.#app.getCurrentTime(),
        }

        try {
            let response = await fetch(this.#baseUrl + "api/site/" + this.#app.getSiteId() + "/feedback/" + this.#feedbackRecordId, {
                "headers": {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                "method": "PUT",
                "body": JSON.stringify(params)
            })

            return response.status === 200;
        } catch (e) {
            return false
        }
    }
}
