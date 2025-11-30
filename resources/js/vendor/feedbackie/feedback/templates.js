let basicTemplate = `
<div class="sm-helpful-popup">
    <div class="sm-question-popup" id="sm-question-popup">
        <span class="close" id="sm-question-close-button">&times;</span>
        <span class="sm-question-label">{{was_this_article_helpful}}</span>
        <span class="sm-question-answers">
            <button class="sm-question-answer" id="sm-question-yes-answer" data-answer="yes">{{yes}}</button>
            <button class="sm-question-answer" id="sm-question-no-answer" data-answer="no">{{no}}</button>
        </span>
    </div>
    <div id="sm-extended-feedback-container"></div>
</div>
`

let extendedYesTemplate = `
<div class="sm-helpful-extended-popup" id="sm-helpful-extended-popup">
    <div class="sm-extended-feedback-header">
        <label class="sm-extended-feedback-title" for="sm-feedback-comment">
            <b>{{thank_you_any_more_feedback}}</b> {{it_will_help_to_improve_the_article_in_the_future}}
        </label>
        <span class="close" id="sm-extended-close-button">&times;</span>
    </div>
    <form>
    <div class="sm-extended-feedback-body">
        <fieldset id="sm-extended-language-star-rating" data-star-rating-question="How satisfied are you with the translation quality?">
                <legend class="sm-helpful-extended-label">{{how_satisfied_are_you_with_the_translation_quality}}</legend>
                <div id="sm-helpful-language-stars">
                    <span id="rating_-1" tabindex="0" data-startindex="0" data-stardescription="{{very_not_satisfied}}" aria-label="{{very_not_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_0" tabindex="0" data-startindex="1" data-stardescription="{{not_satisfied}}" aria-label="{{not_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_1" tabindex="0" data-startindex="2" data-stardescription="{{neutral}}" aria-label="{{neutral}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_2" tabindex="0" data-startindex="3" data-stardescription="{{satisfied}}" aria-label="{{satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_3" tabindex="0" data-startindex="4" data-stardescription="{{very_satisfied}}" aria-label="{{very_not_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <label id="sm-helpful-star-description"></label>
                </div>
            </fieldset>

            <fieldset>
            <legend class="sm-helpful-extended-label">{{what_affected_your_experience}}</legend>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_0" name="helpful_0" value="resolved_my_issue">
                    <span>{{resolved_my_issue}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_1" name="helpful_1" value="clear_instructions">
                    <span>{{clear_instructions}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_2" name="helpful_2" value="easy_to_follow">
                    <span>{{easy_to_follow}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_3" name="helpful_3" value="no_jargon">
                    <span>{{no_jargon}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_4" name="helpful_4" value="no_mistakes">
                    <span>{{no_mistakes}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_5" name="helpful_5" value="pictures_helped">
                    <span>{{pictures_helped}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-2" id="helpful_6" name="helpful_6" value="other">
                    <span>{{other}}</span>
                </label>
            </fieldset>
            <div id="sm-helpful-comment-container" class="sm-helpful-comment">
                <label class="sm-helpful-comment-label" for="sm-helpful-comment">{{any_additional_feedback_optional}}</label>
                <textarea id="sm-helpful-comment" name="feedback-comment" rows="5" cols="40" maxlength="250" placeholder="{{any_helpful_information}}"></textarea>
            </div>
            <div id="sm-email-container" class="sm-helpful-email">
                <label class="sm-helpful-comment-label" for="sm-helpful-email">{{allow_follow_back_by_email_optional}}</label>
                <input id="sm-helpful-email" name="feedback-email"/>
            </div>
    </div>
    <div class="sm-extended-feedback-footer">
        <button id="sm-submit-helpful-button" class="sm-submit-buttons" type="submit" disabled="">{{submit_feedback}}</button>
        <div class="sm-powered-by">
            <a href="https://feedbackie.app" target="_blank" rel="noopener noreferrer">Powered by Feedbackie</a>
        </div>
    </div>
    </form>
</div>
`

let extendedNoTemplate = `
<div class="sm-helpful-extended-popup" id="sm-helpful-extended-popup">
    <div class="sm-extended-feedback-header">
        <label class="sm-extended-feedback-title" for="sm-helpful-comment">
            <b>{{can_you_help_us_improve}}</b>  {{it_will_help_to_improve_the_article_in_the_future}}
        </label>
        <span class="close" id="sm-extended-close-button">&times;</span>
    </div>
    <form>
    <div class="sm-extended-feedback-body">
        <fieldset id="sm-extended-language-star-rating" data-star-rating-question="How satisfied are you with the translation quality?">
                <legend class="sm-helpful-extended-label">{{how_satisfied_are_you_with_the_translation_quality}}</legend>
                <div id="sm-helpful-language-stars">
                    <span id="rating_0" tabindex="0" data-startindex="0" data-stardescription="{{very_not_satisfied}}" aria-label="{{very_not_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_1" tabindex="0" data-startindex="1" data-stardescription="{{not_satisfied}}" aria-label="{{not_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_2" tabindex="0" data-startindex="2" data-stardescription="{{neutral}}" aria-label="{{neutral}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_3" tabindex="0" data-startindex="3" data-stardescription="{{satisfied}}" aria-label="{{satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <span id="rating_4" tabindex="0" data-startindex="4" data-stardescription="{{very_satisfied}}" aria-label="{{very_satisfied}}" role="menuitem" class="sm-helpful-star">★</span>
                    <label id="sm-helpful-star-description"></label>
                </div>
            </fieldset>

            <fieldset>
            <legend class="sm-helpful-extended-label">{{what_affected_your_experience}}</legend>
                 <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_0" name="not_helpful_0" value="article_is_outdated">
                    <span>{{article_is_outdated}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_1" name="not_helpful_1" value="incorrect_instructions">
                    <span>{{incorrect_instructions}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_2" name="not_helpful_2" value="too_technical">
                    <span>{{too_technical}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_3" name="not_helpful_3" value="not_enough_information">
                    <span>{{not_enough_information}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_4" name="not_helpful_4" value="not_enough_pictures">
                    <span>{{not_enough_pictures}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_5" name="not_helpful_5" value="too_many_grammar_mistakes">
                    <span>{{too_many_grammar_mistakes}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_6" name="not_helpful_6" value="bad_color_scheme">
                    <span>{{bad_color_scheme}}</span>
                </label>
                <label class="sm-experience-labels">
                    <input class="sm-experience-checkbox" type="checkbox" tabindex="-1" id="helpful_7" name="not_helpful_7" value="other">
                    <span>{{other}}</span>
                </label>
            </fieldset>
            <div id="sm-helpful-comment-container" class="sm-helpful-comment">
                 <label class="sm-helpful-comment-label" for="sm-helpful-comment">{{any_additional_feedback_optional}}</label>
                 <textarea id="sm-helpful-comment" name="feedback-comment" rows="6" cols="40" maxlength="9999" placeholder="{{any_helpful_information}}"></textarea>
            </div>
            <div id="sm-email-container" class="sm-helpful-email">
                 <label class="sm-helpful-email-label" for="sm-helpful-email">{{allow_follow_back_by_email_optional}}</label>
                 <input id="sm-helpful-email" name="feedback-email"/>
            </div>
    </div>
    <div class="sm-extended-feedback-footer">
        <button id="sm-submit-helpful-button" class="sm-submit-buttons" type="submit" disabled="">{{submit_feedback}}</button>
        <div class="sm-powered-by">
            <a href="https://feedbackie.app" target="_blank" rel="noopener noreferrer">Powered by Feedbackie</a>
        </div>
    </div>
    </form>
</div>
`

export {basicTemplate, extendedNoTemplate, extendedYesTemplate}
