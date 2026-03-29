const Footer = {
    render() {
        return `
            <footer>
                <div class="footer-inner">
                    <div class="footer-top">
                        <div class="footer-brand">
                            <a href="#/" class="logo" style="color:var(--sand-100);">
                                <div class="logo-mark" aria-hidden="true" style="background-image:url('assets/images/icon.png');"></div>
                                <div class="hotel-name">Hotel Memis</div>
                            </a>
                            <p class="footer-tagline">Keeps your stress away</p>
                            <p class="footer-email">reservations@hotelmemis.com</p>
                        </div>

                        <div class="footer-sitemap">
                            <div class="footer-col">
                                <div class="footer-col-title">Sitemap</div>
                                <a href="#/">Home</a>
                                <a href="#/company">Company Profile</a>
                                <a href="#/reservation">Reservation</a>
                                <a href="#/contacts">Contacts</a>
                            </div>
                            <div class="footer-col">
                                <div class="footer-col-title">Account</div>
                                <a href="#/lookup">View Reservation</a>
                                <a href="#/login">Admin Login</a>
                                <a href="#/dashboard">Dashboard</a>
                            </div>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <div>&copy; ${new Date().getFullYear()} Hotel Memis. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        `;
    },

    init() {
        $('#footer-container').html(this.render());
    }
};
