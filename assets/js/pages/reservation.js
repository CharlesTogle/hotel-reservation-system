const ReservationPage = {
    rooms: [],
    selectedRoom: null,

    render() {
        return `
            <section class="section">
                <div class="section-title">Reservation</div>
                <div class="notice">
                    Enjoy our <strong>10% discount</strong> for 3-5 days of reservation (Cash only)<br>
                    Enjoy our <strong>15% discount</strong> for 6 days or above of reservation (Cash only)
                </div>

                <div class="panel" style="margin-bottom:24px;">
                    <h3>Guest Information</h3>
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="res-name">Customer Name</label>
                            <input class="input" type="text" id="res-name" placeholder="John Doe" required>
                        </div>
                        <div class="form-field">
                            <label for="res-phone">Contact Number</label>
                            <input class="input" type="tel" id="res-phone" placeholder="(+63) 912 345 6789" required>
                        </div>
                    </div>
                </div>

                <div class="panel" style="margin-bottom:24px;">
                    <h3>Date of Reservation</h3>
                    <div class="two-col">
                        <div class="form-field">
                            <label for="res-checkin">Check-in</label>
                            <input class="input" type="date" id="res-checkin" required>
                        </div>
                        <div class="form-field">
                            <label for="res-checkout">Check-out</label>
                            <input class="input" type="date" id="res-checkout" required>
                        </div>
                    </div>
                    <div id="date-info" style="margin-top:12px; font-size:0.9rem; color:rgba(11,42,42,0.6);"></div>
                </div>

                <div class="panel" style="margin-bottom:24px;">
                    <h3>Room Selection</h3>
                    <div class="form-grid" style="margin-bottom:16px;">
                        <div class="form-field">
                            <label for="res-capacity">Room Capacity</label>
                            <select class="select" id="res-capacity">
                                <option value="">Select capacity</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Family">Family</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="res-payment">Payment Type</label>
                            <select class="select" id="res-payment">
                                <option value="Cash">Cash</option>
                                <option value="Check">Check (+5%)</option>
                                <option value="Credit Card">Credit Card (+10%)</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-grid" id="room-cards"></div>
                </div>

                <div id="pricing-section" style="display:none;">
                    <div class="pricing-panel">
                        <h3 style="font-family:'Playfair Display',serif; margin-bottom:16px;">Billing Summary</h3>
                        <div id="pricing-details"></div>
                        <div style="margin-top:24px; text-align:right;">
                            <button class="btn" id="submit-reservation">Confirm Reservation</button>
                        </div>
                    </div>
                </div>

                <div id="reservation-error" class="form-error" style="text-align:center; margin-top:16px;"></div>
            </section>

            <!-- QR Code Success Modal -->
            <div id="qr-modal" style="display:none;">
                <div class="modal-overlay" style="align-items:flex-start; padding-top:40px; overflow-y:auto;">
                    <div class="modal-box" style="max-width:520px; text-align:center;">
                        <h3 style="color:var(--success); margin-bottom:4px;">Reservation Confirmed!</h3>
                        <p style="margin-bottom:8px;">Your reservation code:</p>
                        <div id="qr-token" style="font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:var(--deep-900); letter-spacing:0.1em; margin-bottom:20px;"></div>
                        <div id="qr-code" style="display:inline-block; padding:16px; background:white; border-radius:var(--radius-md); box-shadow:var(--shadow-soft); margin-bottom:20px;"></div>
                        <p style="font-size:0.88rem; color:rgba(11,42,42,0.6); margin-bottom:20px;">
                            Save this QR code or remember your reservation code.<br>
                            Use it to view your reservation details anytime.
                        </p>
                        <div id="qr-summary" style="text-align:left; margin-bottom:24px;"></div>
                        <div class="modal-actions" style="justify-content:center;">
                            <a href="#/lookup" class="btn" id="qr-view-btn">View Reservation</a>
                            <a href="#/" class="btn secondary">Back to Home</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        const today = new Date().toISOString().split('T')[0];
        $('#res-checkin').attr('min', today);
        $('#res-checkout').attr('min', today);

        const res = await API.getRooms();
        if (res.success) {
            this.rooms = res.data;
        }

        $('#res-capacity').on('change', () => this.filterRooms());
        $('#res-checkin, #res-checkout, #res-payment').on('change', () => this.updatePricing());

        $('#res-checkin').on('change', function () {
            const val = $(this).val();
            if (val) {
                const next = new Date(val);
                next.setDate(next.getDate() + 1);
                $('#res-checkout').attr('min', next.toISOString().split('T')[0]);
            }
        });

        $(document).off('click', '.room-card').on('click', '.room-card', (e) => {
            const id = $(e.currentTarget).data('id');
            this.selectRoom(id);
        });

        $('#submit-reservation').on('click', () => this.submitReservation());
    },

    filterRooms() {
        const capacity = $('#res-capacity').val();
        if (!capacity) {
            $('#room-cards').html('');
            this.selectedRoom = null;
            $('#pricing-section').hide();
            return;
        }

        const filtered = this.rooms.filter(r => r.capacity === capacity);
        const html = filtered.map(room => `
            <div class="room-card ${this.selectedRoom && this.selectedRoom.id === room.id ? 'selected' : ''}" data-id="${room.id}">
                <div class="room-image" style="background-image: url('${room.image_url}')"></div>
                <div class="room-body">
                    <h5>${room.capacity} ${room.room_type}</h5>
                    <p>${room.description}</p>
                    <div class="room-footer">
                        <span class="price">$${Number(room.rate_per_day).toFixed(2)}/day</span>
                        <span class="room-tag">${room.room_type}</span>
                    </div>
                </div>
            </div>
        `).join('');
        $('#room-cards').html(html);
    },

    selectRoom(id) {
        this.selectedRoom = this.rooms.find(r => r.id === id);
        $('.room-card').removeClass('selected');
        $(`.room-card[data-id="${id}"]`).addClass('selected');
        this.updatePricing();
    },

    async updatePricing() {
        const checkIn = $('#res-checkin').val();
        const checkOut = $('#res-checkout').val();
        const paymentType = $('#res-payment').val();

        if (!this.selectedRoom || !checkIn || !checkOut) {
            $('#pricing-section').hide();
            return;
        }

        const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        if (days <= 0) {
            $('#date-info').html('<span style="color:var(--danger)">Check-out must be after check-in</span>');
            $('#pricing-section').hide();
            return;
        }
        $('#date-info').text(`Duration: ${days} day${days > 1 ? 's' : ''}`);

        const res = await API.calculatePrice({
            room_id: this.selectedRoom.id,
            check_in: checkIn,
            check_out: checkOut,
            payment_type: paymentType,
        });

        if (!res.success) {
            $('#date-info').html(`<span style="color:var(--danger)">${res.message}</span>`);
            $('#pricing-section').hide();
            return;
        }

        const p = res.data;
        let html = `
            <div class="pricing-row">
                <span class="label">Room: ${p.room.capacity} ${p.room.room_type}</span>
                <span class="amount">$${Number(p.rate_per_day).toFixed(2)}/day</span>
            </div>
            <div class="pricing-row">
                <span class="label">Duration</span>
                <span class="amount">${p.num_days} day${p.num_days > 1 ? 's' : ''}</span>
            </div>
            <div class="pricing-row">
                <span class="label">Subtotal</span>
                <span class="amount">$${Number(p.subtotal).toFixed(2)}</span>
            </div>
        `;

        if (p.discount_amount > 0) {
            html += `
                <div class="pricing-row discount">
                    <span class="label">Cash Discount (${p.discount_percent}%)</span>
                    <span class="amount">-$${Number(p.discount_amount).toFixed(2)}</span>
                </div>
            `;
        }

        if (p.surcharge_amount > 0) {
            html += `
                <div class="pricing-row surcharge">
                    <span class="label">${paymentType} Surcharge (${p.surcharge_percent}%)</span>
                    <span class="amount">+$${Number(p.surcharge_amount).toFixed(2)}</span>
                </div>
            `;
        }

        html += `
            <div class="pricing-row total">
                <span class="label">Total</span>
                <span class="amount">$${Number(p.total).toFixed(2)}</span>
            </div>
        `;

        $('#pricing-details').html(html);
        $('#pricing-section').show();
    },

    async submitReservation() {
        const data = {
            room_id: this.selectedRoom ? this.selectedRoom.id : null,
            customer_name: $('#res-name').val().trim(),
            contact_number: $('#res-phone').val().trim(),
            check_in: $('#res-checkin').val(),
            check_out: $('#res-checkout').val(),
            payment_type: $('#res-payment').val(),
        };

        if (!data.customer_name || !data.contact_number || !data.check_in || !data.check_out || !data.room_id) {
            Toast.error('Please fill in all fields and select a room');
            return;
        }

        const $btn = $('#submit-reservation');
        $btn.prop('disabled', true).text('Processing...');
        $('#reservation-error').text('');

        const res = await API.createReservation(data);

        if (res.success) {
            this.showQRModal(res.data);
        } else {
            $('#reservation-error').text(res.message);
            Toast.error(res.message);
            $btn.prop('disabled', false).text('Confirm Reservation');
        }
    },

    showQRModal(reservation) {
        const token = reservation.token;
        $('#qr-token').text(token);
        $('#qr-view-btn').attr('href', '#/lookup/' + token);

        // Generate QR code
        $('#qr-code').empty();
        new QRCode(document.getElementById('qr-code'), {
            text: token,
            width: 200,
            height: 200,
            colorDark: '#0b2a2a',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H,
        });

        // Summary
        $('#qr-summary').html(`
            <div class="pricing-panel" style="margin:0;">
                <div class="pricing-row">
                    <span class="label">Guest</span>
                    <span class="amount">${reservation.customer_name}</span>
                </div>
                <div class="pricing-row">
                    <span class="label">Room</span>
                    <span class="amount">${reservation.capacity} ${reservation.room_type}</span>
                </div>
                <div class="pricing-row">
                    <span class="label">Check-in</span>
                    <span class="amount">${reservation.check_in}</span>
                </div>
                <div class="pricing-row">
                    <span class="label">Check-out</span>
                    <span class="amount">${reservation.check_out}</span>
                </div>
                <div class="pricing-row total">
                    <span class="label">Total</span>
                    <span class="amount">$${Number(reservation.total).toFixed(2)}</span>
                </div>
            </div>
        `);

        $('#qr-modal').show();
    }
};
