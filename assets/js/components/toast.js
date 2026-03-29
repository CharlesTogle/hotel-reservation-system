const Toast = {
    show(message, type = 'info') {
        const $container = $('#toast-container');
        const $toast = $(`<div class="toast ${type}">${this.escapeHtml(message)}</div>`);
        $container.append($toast);
        setTimeout(() => $toast.remove(), 3000);
    },

    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    info(message) { this.show(message, 'info'); },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
