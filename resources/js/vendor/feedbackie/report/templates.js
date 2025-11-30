let reportModalTemplate = `
<div class="simplemodal" id="report-mistake-modal" aria-hidden="true">
    <div class="simplemodal__wrap">
        <div class="simplemodal__window" role="dialog" aria-modal="true">
            <button data-simpleclose class="simplemodal__close">{{close}}</button>
            <h1>{{suggest_corrections_for_the_text}}</h1>
                <p style="margin-bottom: 10px; margin-top: 20px;">
                     <label id="report-changes-label" class="report-form-label" for="report-selected-text">{{here_you_can_make_your_changes}}</label>
                </p>
                <div id="report-selected-text" contentEditable="true"></div>
                <p style="margin-top: 20px; margin-bottom: 10px;">
                     <label id="report-comment-label" class="report-form-label" for="report-comment">{{comment}}</label>
                </p>
                <p style="margin-bottom: 20px;">
                    <textarea id="report-comment"></textarea>
                </p>
                <input type="hidden" name="full_text" id="report-full-text" />
                <input type="hidden" name="selected_text" id="report-orig-selected-text" />
                <input type="hidden" name="offset" id="report-offset" />
            <div class="report-modal-footer">
                <button id="report-submit" class="report-modal-btn simplemodal__btn-primary">{{send}}</button>
                <button id="report-close" data-simpleclose class="report-modal-btn simplemodal__btn-close"  aria-label="{{close}}">{{close}}</button>
            </div>
        </div>
    </div>
</div>


<div class="simplemodal" id="report-result-modal" aria-hidden="true">
    <div class="simplemodal__wrap">
        <div class="simplemodal__window" role="dialog" aria-modal="true">
            <button data-simpleclose class="simplemodal__close">{{close}}</button>
            <p id="report-result-message"></p>
        </div>
    </div>
</div>
`

export {reportModalTemplate}
