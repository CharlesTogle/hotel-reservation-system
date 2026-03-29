const API = {
    async request(url, options = {}) {
        const defaults = {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
        };
        const config = { ...defaults, ...options };
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    get(url) {
        return this.request(url, { method: 'GET' });
    },

    post(url, body) {
        return this.request(url, { method: 'POST', body });
    },

    put(url, body) {
        return this.request(url, { method: 'PUT', body });
    },

    delete(url, body) {
        return this.request(url, { method: 'DELETE', body });
    },

    // Auth
    login(email, password) {
        return this.post('/api/auth/login.php', { email, password });
    },

    logout() {
        return this.post('/api/auth/logout.php');
    },

    me() {
        return this.get('/api/auth/me.php');
    },

    // Rooms
    getRooms() {
        return this.get('/api/rooms/index.php');
    },

    updateRoom(id, data) {
        return this.put('/api/rooms/update.php', { id, ...data });
    },

    async uploadRoomImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch('/api/rooms/upload.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData,
            });
            return await response.json();
        } catch (error) {
            return { success: false, message: 'Upload failed. Please try again.' };
        }
    },

    // Pricing
    calculatePrice(data) {
        return this.post('/api/pricing/calculate.php', data);
    },

    // Reservations
    getReservations() {
        return this.get('/api/reservations/index.php');
    },

    createReservation(data) {
        return this.post('/api/reservations/create.php', data);
    },

    lookupReservation(token) {
        return this.get('/api/reservations/lookup.php?token=' + encodeURIComponent(token));
    },

    updateReservation(id, status) {
        return this.put('/api/reservations/update.php', { id, status });
    },

    deleteReservation(id) {
        return this.delete('/api/reservations/delete.php', { id });
    },
};
