let reportModalTemplate = `
<dialog id="feedbackie-mistakes-report-modal" class="feedbackie-modal">
   <div class="report-modal-header">
        <h1>{{suggest_corrections_for_the_text}}</h1>
        <button commandfor="feedbackie-mistakes-report-modal" command="close"  class="feedbackie-modal-close close-by-js" aria-label="{{close}}"></button>
   </div>
   <div class="report-modal-body">
       <p style="margin-bottom: 15px; margin-top: 20px;">
            <label id="report-changes-label" class="report-form-label" for="report-selected-text">{{here_you_can_make_your_changes}}</label>
        </p>
        <div id="report-selected-text" contentEditable="true" autofocus></div>
        <p style="margin-top: 20px; margin-bottom: 10px;">
            <label id="report-comment-label" class="report-form-label" for="report-comment">{{comment}}</label>
        </p>
        <p style="margin-bottom: 20px;">
            <textarea id="report-comment"></textarea>
        </p>
        <input type="hidden" name="full_text" id="report-full-text" />
        <input type="hidden" name="selected_text" id="report-orig-selected-text" />
        <input type="hidden" name="offset" id="report-offset" />
   </div>
   <div class="report-modal-footer">
      <div class="report-buttons">
        <button id="report-submit" class="report-modal-btn report-modal-btn-submit">{{send}}</button>
        <button commandfor="feedbackie-mistakes-report-modal" command="close" class="report-modal-btn report-modal-btn-close close-by-js">{{close}}</button>
      </div>
      <div class="report-powered-by">
      </div>
   </div>
</dialog>

<dialog id="report-result-modal" class="feedbackie-modal">
   <div class="report-modal-header">
        <h1 id="report-result-title"></h1>
        <button commandfor="report-result-modal" command="close" class="feedbackie-modal-close close-by-js" aria-label="{{close}}"></button>
   </div>
   <div class="report-modal-body">
        <p id="report-result-message"></p>
   </div>
</dialog>
`

export {reportModalTemplate}
