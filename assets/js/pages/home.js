const HomePage = {
    render() {
        return `
            <section class="hero">
                <h1>Welcome to Hotel Memis!</h1>
                <p>
                    Welcome to our refined seaside retreat where classic hospitality meets modern
                    comfort. Enjoy curated suites, elegant dining, and a reservation experience
                    designed around your schedule.
                </p>
                <div class="buttonWrapper">
                    <a href="#/reservation" class="btn-link">
                        <span class="btn-fill">
                            <span class="btn-ripple v1"></span>
                            <span class="btn-ripple v2"></span>
                        </span>
                        <span class="btn-title">
                            <span class="btn-content">Reserve Now</span>
                        </span>
                    </a>
                </div>
                <div class="hero-badges">
                    <div class="badge">Five-Star Service</div>
                    <div class="badge">Beachfront View</div>
                    <div class="badge">24/7 Concierge</div>
                </div>
            </section>

            <section class="section">
                <div class="section-title">Why Choose Hotel Memis?</div>
                <div class="two-col">
                    <div class="panel">
                        <h3>Luxury Accommodations</h3>
                        <p>From cozy singles to grand family suites, every room is designed with premium furnishings, ocean views, and meticulous attention to detail.</p>
                    </div>
                    <div class="panel">
                        <h3>Seamless Booking</h3>
                        <p>Our online reservation system lets you browse rooms, see live pricing with applicable discounts, and book in seconds.</p>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="section-title">Our Rooms</div>
                <div class="card-grid" id="home-rooms"></div>
            </section>
        `;
    },

    async init() {
        const res = await API.getRooms();
        if (!res.success) return;

        const featured = res.data.filter(r => r.room_type === 'Suite');
        const html = featured.map(room => `
            <div class="room-card">
                <div class="room-image" style="background-image: url('${room.image_url}')"></div>
                <div class="room-body">
                    <h5>${room.capacity} ${room.room_type}</h5>
                    <p>${room.description}</p>
                    <div class="room-footer">
                        <span class="price">$${Number(room.rate_per_day).toFixed(2)}/day</span>
                        <span class="room-tag">${room.capacity}</span>
                    </div>
                </div>
            </div>
        `).join('');
        $('#home-rooms').html(html);
    }
};
