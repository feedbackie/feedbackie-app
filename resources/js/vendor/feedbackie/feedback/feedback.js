import {basicTemplate} from "./templates";
import {extendedYesTemplate} from "./templates";
import {extendedNoTemplate} from "./templates";
import {statisticsTemplate} from "./templates";
import {localize} from "../localize"
import {translate} from "../localize"
import {locales} from "./locales"
import feedbackCss from './feedback.css?inline'

export class Feedback {
    #app = null

    #selector = ""
    #insertType = "afterend"
    #container = null
    #shadowContainer = null
    #questionContainer = null
    #extendedContainer = null
    #basicPopupCode = ""
    #codeForYesAnswer = ""
    #codeForNoAnswer = ""

    #baseUrl = null

    #feedbackRecordId = null
    #languageScore = null
    #languageScoreDescription = ""

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
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(feedbackCss);
        shadow.adoptedStyleSheets = [sheet];

        this.#shadowContainer = document.createElement("div");
        this.#shadowContainer.innerHTML = this.#basicPopupCode

        shadow.append(this.#shadowContainer)

        this.#extendedContainer = this.#container.shadowRoot.getElementById("sm-extended-feedback-container");
        this.#questionContainer = this.#container.shadowRoot.getElementById("sm-question-popup")

        if (this.#_shouldPopupBeSticky()) {
            this.#_addStickyWatcher()
        }

        this.#_addYesButtonHandler()
        this.#_addNoButtonHandler()

        let questionCloseBtn = this.#container.shadowRoot.getElementById("sm-question-close-button")

        questionCloseBtn.addEventListener("click", function () {
            questionCloseBtn.style.display = "none";
            //make not sticky
            _this.#questionContainer.style.display = "block";
            _this.#container.style.position = "relative";
        })

        document.addEventListener('keyup', function (event) {
            if (event.key === 'Escape') {
                _this.#_hideExtendedPopup()
            }
        });

        if (this.#displayPoweredBy){
            this.#_insertPoweredByLink()
        }
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
            }
        });
    }

    #_addYesButtonHandler() {
        const _this = this
        let noBtn = this.#container.shadowRoot.getElementById("sm-question-no-answer")
        let yesBtn = _this.#container.shadowRoot.getElementById("sm-question-yes-answer")
        yesBtn.addEventListener("click", async function (evt) {
            yesBtn.disabled = true
            yesBtn.innerText = translate('loading', locales)
            noBtn.disabled = true
            noBtn.style.visibility = "hidden"

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
        let noBtn = this.#container.shadowRoot.getElementById("sm-question-no-answer")
        let yesBtn = this.#container.shadowRoot.getElementById("sm-question-yes-answer")
        noBtn.addEventListener("click", async function (evt) {
            noBtn.disabled = true
            noBtn.innerText = translate('loading', locales)
            yesBtn.disabled = true
            yesBtn.style.visibility = "hidden"
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

        this.#_handleExtendedPopup()
    }

    #_showExtendedFeedbackPopupForNo(stats) {
        this.#extendedContainer.innerHTML = this.#codeForNoAnswer
        this.#container.style.position = "sticky"
        this.#_updateStatisticsData(stats)

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

    #_addLanguageScoreWatcher() {
        const _this = this
        let temporaryScore = null
        //Remove not committed rate
        this.#container.shadowRoot.getElementById("sm-helpful-language-stars")
            .addEventListener("mouseleave", function (evt) {
                _this.#_updateLanguageScoreState(_this.#languageScore)

                //reset to default or selected
                let helpfulLabel = _this.#container.shadowRoot.getElementById("sm-helpful-star-description");
                helpfulLabel.innerHTML = _this.#languageScoreDescription
            })

        this.#container.shadowRoot.querySelectorAll(".sm-helpful-star").forEach(function (star) {
            star.addEventListener("mouseover", function (evt) {
                let helpfulLabel = _this.#container.shadowRoot.getElementById("sm-helpful-star-description");
                temporaryScore = evt.target.dataset.startindex;

                helpfulLabel.innerHTML = evt.target.dataset.stardescription;

                _this.#_updateLanguageScoreState(temporaryScore)
            })
            star.addEventListener("click", function (evt) {
                _this.#languageScore = evt.target.dataset.startindex;
                _this.#languageScoreDescription = evt.target.dataset.stardescription;
            })
        })
    }

    #_updateLanguageScoreState(currentIndex) {
        this.#container.shadowRoot.querySelectorAll(".sm-helpful-star").forEach(function (star) {
            if (currentIndex == null) {
                star.classList.remove("sm-helpful-star-selected")

                return
            }

            if (star.dataset.startindex <= currentIndex) {
                star.classList.add("sm-helpful-star-selected")
            } else {
                star.classList.remove("sm-helpful-star-selected")
            }
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

        _this.#_addLanguageScoreWatcher()

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

            _this.#_sendExtendedFeedback()
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
        const poweredByLink = document.createElement("a")
        poweredByLink.href = "https://feedbackie.app"
        poweredByLink.innerText = translate('powered_by_feedbackie', locales)
        poweredByLink.target = "_blank"

        const poweredByContainers = this.#container.shadowRoot.querySelectorAll(".sm-powered-by")
        poweredByContainers.forEach(function(element){
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

            if (response.status === 200) {
                let data = await response.json();
                if (data.success) {
                    this.#feedbackRecordId = data.id

                    return {
                        usefulCount: data.useful_count ?? 0,
                        notUsefulCount: data.not_useful_count ?? 0,
                    }
                }
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
            selected.length === 0 &&
            this.#languageScore === null) {
            this.#_hideExtendedPopup()

            return
        }

        let params = {
            "options": selected,
            "language_score": this.#languageScore,
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
        } catch (e) {

        }

        this.#_hideExtendedPopup()
    }
}
