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

    async navigate() {
        const hash = window.location.hash || '#/';

        // Handle dynamic lookup route: #/lookup/TOKEN
        if (hash.startsWith('#/lookup/')) {
            const token = hash.replace('#/lookup/', '');
            $('#app').html(LookupPage.render());
            await LookupPage.init(token);
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

        if (typeof page.init === 'function') {
            await page.init();
        }

        Header.updateActiveLink();
        window.scrollTo(0, 0);
    }
};

$(document).ready(() => App.start());
