const CompanyPage = {
    render() {
        return `
            <section class="section">
                <div class="section-title">Company Profile</div>
                <div class="two-col">
                    <div>
                        <p style="line-height:1.7; margin-bottom:16px;">
                            Hotel Memis is a refined coastal sanctuary defined by quiet luxury, bespoke
                            interiors, and discreet, anticipatory service. Each suite balances artisanal
                            craftsmanship with modern comfort, curated for guests who value elegance and calm.
                        </p>
                        <p style="line-height:1.7;">
                            Our culinary program highlights seasonal produce and coastal flavors, while our
                            wellness rituals draw from local traditions. Every detail is considered, from
                            private arrivals to tailored itinerary design.
                        </p>
                    </div>
                    <div class="panel">
                        <h3>Highlights</h3>
                        <div class="info-grid">
                            <div class="field">
                                <span>Location</span>
                                <div class="value">Coastal District</div>
                            </div>
                            <div class="field">
                                <span>Established</span>
                                <div class="value">2024</div>
                            </div>
                            <div class="field">
                                <span>Suites</span>
                                <div class="value">48 Premium Rooms</div>
                            </div>
                            <div class="field">
                                <span>Dining</span>
                                <div class="value">3 Signature Venues</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="section-title">Our Values</div>
                <div class="two-col">
                    <div class="panel">
                        <h3>Service Excellence</h3>
                        <p>Every interaction is an opportunity to exceed expectations. Our team is trained to anticipate needs before they arise.</p>
                    </div>
                    <div class="panel">
                        <h3>Sustainable Luxury</h3>
                        <p>We believe luxury and responsibility go hand in hand. From locally sourced materials to energy-efficient operations.</p>
                    </div>
                    <div class="panel">
                        <h3>Cultural Heritage</h3>
                        <p>Our design and culinary offerings celebrate the rich coastal traditions that define our location.</p>
                    </div>
                    <div class="panel">
                        <h3>Guest Privacy</h3>
                        <p>Discretion is at the heart of our hospitality. Your comfort and privacy are our highest priority.</p>
                    </div>
                </div>
            </section>
        `;
    },

    init() {}
};
