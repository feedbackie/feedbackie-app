import {basicTemplate} from "./templates";
import {extendedYesTemplate} from "./templates";
import {extendedNoTemplate} from "./templates";
import {localize} from "../localize"
import {translate} from "../localize"
import {locales} from "./locales"

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
    #languageScore = null
    #languageScoreDescription = ""

    #stickyRatio = 0.25
    #isSticky = false

    constructor(app, selector, insertType, stickyRatio) {
        this.#app = app
        this.#baseUrl = app.getBaseUrl()
        this.#selector = selector
        this.#insertType = insertType
        this.#basicPopupCode = localize(basicTemplate, locales)
        this.#codeForYesAnswer = localize(extendedYesTemplate, locales)
        this.#codeForNoAnswer = localize(extendedNoTemplate, locales)
        this.#stickyRatio = stickyRatio
        this.#isSticky = false
    }

    init() {
        const _this = this
        this.#container = document.getElementById(this.#selector);

        if (this.#container == null) {
            return;
        }

        this.#container.innerHTML = this.#basicPopupCode
        this.#extendedContainer = document.getElementById("sm-extended-feedback-container");
        this.#questionContainer = document.getElementById("sm-question-popup")

        if (this.#_shouldPopupBeSticky()) {
            this.#_addStickyWatcher()
        }

        this.#_addYesButtonHandler()
        this.#_addNoButtonHandler()

        let questionCloseBtn = document.getElementById("sm-question-close-button")

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
        let yesBtn = document.getElementById("sm-question-yes-answer")
        yesBtn.addEventListener("click", function (evt) {
            _this.#_sendFeedbackAnswer("yes")
            _this.#_hideBasicPopup()
            _this.#_showExtendedFeedbackPopupForYes()
        })
    }

    #_addNoButtonHandler() {
        const _this = this
        let noBtn = document.getElementById("sm-question-no-answer")
        noBtn.addEventListener("click", function (evt) {
            _this.#_sendFeedbackAnswer("no")
            _this.#_hideBasicPopup()
            _this.#_showExtendedFeedbackPopupForNo()
        })
    }

    #_showExtendedFeedbackPopupForYes() {
        this.#extendedContainer.innerHTML = this.#codeForYesAnswer
        this.#container.style.position = "sticky"

        this.#_handleExtendedPopup()
    }

    #_showExtendedFeedbackPopupForNo() {
        this.#extendedContainer.innerHTML = this.#codeForNoAnswer
        this.#container.style.position = "sticky"

        this.#_handleExtendedPopup()
    }

    #_addLanguageScoreWatcher() {
        const _this = this
        let temporaryScore = null
        //Remove not committed rate
        document.getElementById("sm-helpful-language-stars")
            .addEventListener("mouseleave", function (evt) {
                _this.#_updateLanguageScoreState(_this.#languageScore)

                //reset to default or selected
                let helpfulLabel = document.getElementById("sm-helpful-star-description");
                helpfulLabel.innerHTML = _this.#languageScoreDescription
            })

        document.querySelectorAll(".sm-helpful-star").forEach(function (star) {
            star.addEventListener("mouseover", function (evt) {
                let helpfulLabel = document.getElementById("sm-helpful-star-description");
                temporaryScore = evt.target.dataset.startindex;

                helpfulLabel.innerHTML = evt.target.dataset.stardescription;

                _this.#_updateLanguageScoreState(temporaryScore)
            })
            star.addEventListener("click", function (evt) {
                _this.#languageScore = evt.target.dataset.startindex;
                _this.#languageScoreDescription = evt.target.dataset.stardescription;
                _this.#_unlockExtendedSubmitButton()
            })
        })
    }

    #_updateLanguageScoreState(currentIndex) {
        document.querySelectorAll(".sm-helpful-star").forEach(function (star) {
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
        const extendedCloseBtn = document.getElementById("sm-extended-close-button")


        if (_this.#isSticky) {
            const bodyElements = _this.#container.querySelectorAll('.sm-extended-feedback-body')
            bodyElements.forEach(function(bodyElement) {
                bodyElement.style.maxHeight = "50vh"
            })
        }
        
        _this.#_addLanguageScoreWatcher()

        extendedCloseBtn.addEventListener("click", function () {
            _this.#_hideExtendedPopup()
        })

        const helpfulSubmitBtn = document.getElementById("sm-submit-helpful-button")

        document.querySelectorAll(".sm-experience-checkbox").forEach(function (checkbox) {
            checkbox.addEventListener("click", function () {
                _this.#_unlockExtendedSubmitButton()
            })
        })
        document.getElementById("sm-helpful-comment").addEventListener("keyup", function () {
            _this.#_unlockExtendedSubmitButton()
        }, false)
        document.getElementById("sm-helpful-email").addEventListener("keyup", function () {
            _this.#_unlockExtendedSubmitButton()
        }, false)

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

    #_hideExtendedPopup() {
        this.#container.style.position = 'relative';
        this.#extendedContainer.innerHTML = "";
        this.#questionContainer.style.display = "block"
    }

    #_unlockExtendedSubmitButton() {
        const comment = document.getElementById("sm-helpful-comment").value

        const email = document.getElementById("sm-helpful-email").value

        const optionsCount = document.querySelectorAll(".sm-experience-checkbox:checked").length;

        const helpfulSubmitBtn = document.getElementById("sm-submit-helpful-button")

        if (this.#languageScore != null || comment.length > 0 || email.length > 0 || optionsCount > 0) {
            helpfulSubmitBtn.removeAttribute("disabled")
        } else {
            helpfulSubmitBtn.setAttribute("disabled", true)
        }
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
                }
            }
        } catch (e) {

        }
    }

    async #_sendExtendedFeedback() {
        const comment = document.getElementById("sm-helpful-comment").value
        const email = document.getElementById("sm-helpful-email").value

        let selected = []
        document.querySelectorAll(".sm-experience-checkbox:checked")
            .forEach(function (checkbox) {
                selected.push(checkbox.getAttribute("value"))
            })

        if (comment.length === 0 &&
            selected.length === 0 &&
            email.length === 0 &&
            this.#languageScore === null) {
            this.#_hideExtendedPopup()

            return
        }

        let params = {
            "options": selected,
            "language_score": this.#languageScore,
            "comment": comment,
            "email": email,
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
