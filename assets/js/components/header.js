const Header = {
    currentUser: null,

    async render() {
        const res = await API.me();
        this.currentUser = res.success ? res.data : null;

        let rightLinks;
        if (this.currentUser && this.currentUser.role === 'admin') {
            rightLinks = `
                <a href="#/dashboard">Dashboard</a>
                <a href="#" id="logout-link">Log Out</a>
            `;
        } else {
            rightLinks = `<a href="#/lookup">View Reservation</a>`;
        }

        return `
            <header>
                <div class="top-row">
                    <a href="#/" class="logo">
                        <div class="logo-mark" aria-hidden="true"></div>
                        <div class="hotel-name">Hotel Memis</div>
                    </a>
                    <nav>
                        <a href="#/">Home</a>
                        <a href="#/company">Company Profile</a>
                        <a href="#/reservation">Reservation</a>
                        <a href="#/contacts">Contacts</a>
                        ${rightLinks}
                    </nav>
                </div>
            </header>
        `;
    },

    async init() {
        const html = await this.render();
        $('#header-container').html(html);
        this.bindEvents();
        this.updateActiveLink();
    },

    bindEvents() {
        $(document).off('click', '#logout-link').on('click', '#logout-link', async function (e) {
            e.preventDefault();
            await API.logout();
            Header.currentUser = null;
            Toast.success('Logged out successfully');
            await Header.init();
            window.location.hash = '#/';
        });
    },

    updateActiveLink() {
        const hash = window.location.hash || '#/';
        $('nav a').removeClass('active');
        $(`nav a[href="${hash}"]`).addClass('active');
    }
};
