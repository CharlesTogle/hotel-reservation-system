const Modal = {
    confirm(title, message, onConfirm) {
        const html = `
            <div class="modal-overlay" id="modal-active">
                <div class="modal-box">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="modal-actions">
                        <button class="btn secondary small" id="modal-cancel">Cancel</button>
                        <button class="btn danger small" id="modal-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        $('#modal-container').html(html);

        $('#modal-cancel, .modal-overlay').on('click', function (e) {
            if (e.target === this) Modal.close();
        });

        $('#modal-confirm').on('click', function () {
            Modal.close();
            if (onConfirm) onConfirm();
        });
    },

    close() {
        $('#modal-container').html('');
    }
};
