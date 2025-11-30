// SimpleModal based on HystModal
class SimpleModal {
    constructor() {
        this.closeCallback = null;
        this.activeModal = null;
        this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
    }

    onClose(callback) {
        this.closeCallback = callback;
    }

    open(selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        this.closeAll();
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('simplemodal--active');
        this.activeModal = modal;
        // Close on [data-simpleclose] click
        modal.querySelectorAll('[data-simpleclose]').forEach(btn => {
            btn.addEventListener('click', () => this.close(selector));
        });
        // Close on overlay click
        modal.addEventListener('mousedown', this.handleOverlayClick);
        // Close on ESC
        document.addEventListener('keydown', this.handleDocumentKeydown);
    }

    close(selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('simplemodal--active');
        this.activeModal = null;
        modal.removeEventListener('mousedown', this.handleOverlayClick);
        document.removeEventListener('keydown', this.handleDocumentKeydown);

        if (this.closeCallback !== null) {
            this.closeCallback();
        }
    }

    closeAll() {
        document.querySelectorAll('.simplemodal.simplemodal--active').forEach(modal => {
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('simplemodal--active');
        });
        this.activeModal = null;

        if (this.closeCallback !== null) {
            this.closeCallback();
        }
    }

    handleOverlayClick = (e) => {
        if (e.target.classList.contains('simplemodal') || e.target.classList.contains('simplemodal__wrap')) {
            if (this.activeModal) {
                this.close('#' + this.activeModal.id);
            }
        }
    }

    handleDocumentKeydown(e) {
        if (e.key === 'Escape' && this.activeModal) {
            this.close('#' + this.activeModal.id);
        }
    }
}

export { SimpleModal }
