const App = {
    routes: {
        '#/': HomePage,
        '#/company': CompanyPage,
        '#/reservation': ReservationPage,
        '#/contacts': ContactsPage,
        '#/dashboard': DashboardPage,
        '#/login': LoginPage,
        '#/lookup': LookupPage,
    },

    async start() {
        await Header.init();
        Footer.init();
        this.navigate();
        window.addEventListener('hashchange', () => this.navigate());
    },

    currentPage: null,

    async navigate() {
        const hash = window.location.hash || '#/';

        // Cleanup previous page if it has a cleanup/destroy method
        if (this.currentPage && typeof this.currentPage.cleanup === 'function') {
            this.currentPage.cleanup();
        }
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            this.currentPage.destroy();
        }
        this.currentPage = null;

        // Handle dynamic lookup route: #/lookup/TOKEN
        if (hash.startsWith('#/lookup/')) {
            const token = hash.replace('#/lookup/', '');
            $('#app').html(LookupPage.render());
            this.currentPage = LookupPage;
            try {
                await LookupPage.init(token);
            } catch (err) {
                console.error('Page init error:', err);
            }
            Header.updateActiveLink();
            window.scrollTo(0, 0);
            return;
        }

        const page = this.routes[hash];

        if (!page) {
            $('#app').html(`
                <div class="auth-container">
                    <div class="auth-panel" style="text-align:center;">
                        <h2>Page Not Found</h2>
                        <p class="subtitle">The page you're looking for doesn't exist.</p>
                        <a href="#/" class="btn" style="margin-top:16px;">Go Home</a>
                    </div>
                </div>
            `);
            return;
        }

        const html = typeof page.render === 'function' ? page.render() : '';
        $('#app').html(html);
        this.currentPage = page;

        if (typeof page.init === 'function') {
            try {
                await page.init();
            } catch (err) {
                console.error('Page init error:', err);
            }
        }

        Header.updateActiveLink();
        window.scrollTo(0, 0);
    }
};

$(document).ready(() => App.start());
