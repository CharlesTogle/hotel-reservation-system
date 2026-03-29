const ContactsPage = {
    render() {
        return `
            <section class="section">
                <div class="section-title">Contact Us</div>
                <p style="margin-bottom: 24px; color: rgba(11,42,42,0.7); line-height:1.7;">
                    We'd love to hear from you. Whether you have a question about our rooms,
                    pricing, or anything else, our team is ready to help.
                </p>
                <div class="contact-grid">
                    <div class="contact-card">
                        <h4>Address</h4>
                        <p>123 Coastal Boulevard<br>Seaside District, 4000<br>Philippines</p>
                    </div>
                    <div class="contact-card">
                        <h4>Phone</h4>
                        <p>(+63) 912 345 6789<br>(+63) 2 8765 4321</p>
                    </div>
                    <div class="contact-card">
                        <h4>Email</h4>
                        <p>reservations@hotelmemis.com<br>info@hotelmemis.com</p>
                    </div>
                    <div class="contact-card">
                        <h4>Hours</h4>
                        <p>Front Desk: 24/7<br>Reservations: 8AM - 10PM</p>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="section-title">Find Us</div>
                <div class="panel">
                    <p style="text-align:center; padding:40px; color:rgba(11,42,42,0.5);">
                        Located along the pristine coastline, Hotel Memis is easily accessible
                        from the airport (30 min) and the city center (15 min).
                    </p>
                </div>
            </section>
        `;
    },

    init() {}
};
