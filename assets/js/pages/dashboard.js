const DashboardPage = {
    activeTab: 'reservations',

    render() {
        if (!Header.currentUser || Header.currentUser.role !== 'admin') {
            return `
                <div class="auth-container">
                    <div class="auth-panel" style="text-align:center;">
                        <h2>Admin Access Required</h2>
                        <p class="subtitle">This area is for hotel staff only</p>
                        <a href="#/login" class="btn">Admin Login</a>
                        <div class="auth-link" style="margin-top:16px;">
                            Guest? <a href="#/lookup">View your reservation here</a>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <section class="section">
                <div class="dashboard-header">
                    <div>
                        <div class="section-title">Admin Dashboard</div>
                        <p style="color:rgba(11,42,42,0.6);">Welcome, ${Header.currentUser.name}</p>
                    </div>
                    <a href="#/reservation" class="btn small">New Reservation</a>
                </div>
                <div class="dashboard-stats" id="dash-stats"></div>
                <div class="dash-tabs">
                    <button class="dash-tab active" data-tab="reservations">Reservations</button>
                    <button class="dash-tab" data-tab="rooms">Manage Rooms</button>
                </div>
                <div id="dash-content">
                    <div class="loading"><div class="spinner"></div>Loading...</div>
                </div>
            </section>
        `;
    },

    async init() {
        if (!Header.currentUser || Header.currentUser.role !== 'admin') return;

        this.activeTab = 'reservations';
        await this.loadStats();
        await this.loadReservations();

        $(document).off('click', '.dash-tab').on('click', '.dash-tab', (e) => {
            const tab = $(e.target).data('tab');
            this.activeTab = tab;
            $('.dash-tab').removeClass('active');
            $(e.target).addClass('active');
            if (tab === 'reservations') {
                this.loadReservations();
            } else {
                this.loadRooms();
            }
        });
    },

    async loadStats() {
        const res = await API.getReservations();
        if (!res.success) return;

        const reservations = res.data;
        const total = reservations.length;
        const confirmed = reservations.filter(r => r.status === 'confirmed').length;
        const checkedIn = reservations.filter(r => r.status === 'checked_in').length;
        const revenue = reservations.reduce((sum, r) => sum + Number(r.total), 0);

        $('#dash-stats').html(`
            <div class="stat-card">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total Reservations</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${confirmed}</div>
                <div class="stat-label">Confirmed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${checkedIn}</div>
                <div class="stat-label">Checked In</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">$${revenue.toFixed(2)}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
        `);
    },

    async loadReservations() {
        $('#dash-content').html('<div class="loading"><div class="spinner"></div>Loading reservations...</div>');

        const res = await API.getReservations();
        if (!res.success) {
            $('#dash-content').html(`<div class="empty-state"><h3>Error</h3><p>${res.message}</p></div>`);
            return;
        }

        const reservations = res.data;

        if (reservations.length === 0) {
            $('#dash-content').html(`
                <div class="empty-state">
                    <h3>No Reservations Yet</h3>
                    <p>Start by making your first reservation.</p>
                    <a href="#/reservation" class="btn" style="margin-top:16px;">Book Now</a>
                </div>
            `);
            return;
        }

        let tableHtml = `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Guest</th>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Days</th>
                            <th>Payment</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        reservations.forEach(r => {
            tableHtml += `
                <tr>
                    <td><code style="letter-spacing:0.08em; font-weight:600;">${r.token}</code></td>
                    <td>${this.escapeHtml(r.customer_name)}<br><small style="color:rgba(11,42,42,0.5)">${this.escapeHtml(r.contact_number)}</small></td>
                    <td>${r.capacity} ${r.room_type}</td>
                    <td>${r.check_in}</td>
                    <td>${r.check_out}</td>
                    <td>${r.num_days}</td>
                    <td>${r.payment_type}</td>
                    <td>$${Number(r.total).toFixed(2)}</td>
                    <td><span class="status ${r.status}">${r.status.replace('_', ' ')}</span></td>
                    <td>
                        <select class="select small status-select" data-id="${r.id}" style="font-size:0.78rem; padding:6px 8px; margin-bottom:6px;">
                            <option value="confirmed" ${r.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="checked_in" ${r.status === 'checked_in' ? 'selected' : ''}>Checked In</option>
                            <option value="checked_out" ${r.status === 'checked_out' ? 'selected' : ''}>Checked Out</option>
                            <option value="cancelled" ${r.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <button class="btn danger small delete-reservation" data-id="${r.id}" style="font-size:0.68rem; padding:4px 10px;">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHtml += '</tbody></table></div>';
        $('#dash-content').html(tableHtml);

        $('.status-select').on('change', async function () {
            const id = $(this).data('id');
            const status = $(this).val();
            const res = await API.updateReservation(id, status);
            if (res.success) {
                Toast.success('Status updated');
                DashboardPage.loadStats();
                DashboardPage.loadReservations();
            } else {
                Toast.error(res.message);
            }
        });

        $(document).off('click', '.delete-reservation').on('click', '.delete-reservation', function () {
            const id = $(this).data('id');
            Modal.confirm('Delete Reservation', 'Are you sure you want to delete this reservation? This cannot be undone.', async () => {
                const res = await API.deleteReservation(id);
                if (res.success) {
                    Toast.success('Reservation deleted');
                    DashboardPage.loadStats();
                    DashboardPage.loadReservations();
                } else {
                    Toast.error(res.message);
                }
            });
        });
    },

    async loadRooms() {
        $('#dash-content').html('<div class="loading"><div class="spinner"></div>Loading rooms...</div>');

        const res = await API.getRooms();
        if (!res.success) {
            $('#dash-content').html(`<div class="empty-state"><h3>Error</h3><p>${res.message}</p></div>`);
            return;
        }

        const rooms = res.data;
        let html = '<div class="cms-grid">';

        rooms.forEach(room => {
            html += `
                <div class="cms-card" data-id="${room.id}">
                    <div class="cms-image" style="background-image: url('${this.escapeHtml(room.image_url)}')"></div>
                    <div class="cms-body">
                        <div class="cms-room-title">${room.capacity} ${room.room_type}</div>
                        <div class="cms-form">
                            <div class="form-field">
                                <label>Rate per Day ($)</label>
                                <input type="number" class="input cms-rate" value="${room.rate_per_day}" min="1" step="0.01">
                            </div>
                            <div class="form-field">
                                <label>Description</label>
                                <textarea class="input cms-desc" rows="2">${this.escapeHtml(room.description)}</textarea>
                            </div>
                            <div class="form-field">
                                <label>Image URL</label>
                                <input type="text" class="input cms-img" value="${this.escapeHtml(room.image_url)}">
                            </div>
                            <button class="btn small cms-save" data-id="${room.id}">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        $('#dash-content').html(html);

        // Live image preview on URL change
        $(document).off('input', '.cms-img').on('input', '.cms-img', function () {
            const card = $(this).closest('.cms-card');
            card.find('.cms-image').css('background-image', `url('${$(this).val()}')`);
        });

        // Save handler
        $(document).off('click', '.cms-save').on('click', '.cms-save', async function () {
            const btn = $(this);
            const card = btn.closest('.cms-card');
            const id = btn.data('id');
            const rate_per_day = parseFloat(card.find('.cms-rate').val());
            const description = card.find('.cms-desc').val().trim();
            const image_url = card.find('.cms-img').val().trim();

            if (!rate_per_day || rate_per_day <= 0) {
                Toast.error('Rate must be greater than zero');
                return;
            }
            if (!description) {
                Toast.error('Description cannot be empty');
                return;
            }
            if (!image_url) {
                Toast.error('Image URL cannot be empty');
                return;
            }

            btn.prop('disabled', true).text('Saving...');
            const res = await API.updateRoom(id, { rate_per_day, description, image_url });
            btn.prop('disabled', false).text('Save Changes');

            if (res.success) {
                Toast.success('Room updated!');
                card.find('.cms-image').css('background-image', `url('${image_url}')`);
            } else {
                Toast.error(res.message || 'Failed to update room');
            }
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
