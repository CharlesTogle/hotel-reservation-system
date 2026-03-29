const LookupPage = {
    scanner: null,
    scannerActive: false,

    render() {
        return `
            <div class="auth-container" style="max-width:560px;">
                <div class="auth-panel">
                    <h2>View Reservation</h2>
                    <p class="subtitle">Scan, upload, or paste your QR code — or enter the code manually</p>

                    <!-- QR Options -->
                    <div style="display:flex; gap:10px; margin-bottom:16px;">
                        <button class="btn secondary" id="toggle-scanner" style="flex:1;">
                            Scan QR
                        </button>
                        <label class="btn secondary" id="upload-qr-label" style="flex:1; text-align:center; cursor:pointer; margin:0;">
                            Upload QR
                            <input type="file" id="upload-qr" accept="image/*" style="display:none;">
                        </label>
                    </div>

                    <!-- Camera Scanner -->
                    <div id="qr-scanner" style="display:none; border-radius:var(--radius-md); overflow:hidden; margin-bottom:16px;"></div>

                    <!-- Paste / Drop Zone -->
                    <div id="paste-zone" tabindex="0" style="
                        border: 2px dashed rgba(17,56,54,0.2);
                        border-radius: var(--radius-md);
                        padding: 28px 16px;
                        text-align: center;
                        margin-bottom: 20px;
                        cursor: pointer;
                        transition: border-color 0.2s, background 0.2s;
                        outline: none;
                    ">
                        <div style="color:rgba(11,42,42,0.45); font-size:0.88rem;">
                            Paste an image here (Ctrl+V) or drag & drop a QR code image
                        </div>
                        <div id="paste-preview" style="margin-top:12px;"></div>
                    </div>

                    <!-- Manual Entry -->
                    <div style="text-align:center; margin-bottom:16px; color:rgba(11,42,42,0.4); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.1em;">
                        or enter code manually
                    </div>
                    <form id="lookup-form">
                        <div class="form-field">
                            <label for="lookup-token">Reservation Code</label>
                            <input class="input" type="text" id="lookup-token" placeholder="e.g. A1B2C3D4" style="text-transform:uppercase; letter-spacing:0.15em; text-align:center; font-size:1.2rem; font-weight:600;">
                        </div>
                        <div id="lookup-error" class="form-error" style="text-align:center; margin:8px 0;"></div>
                        <button type="submit" class="btn" id="lookup-btn" style="width:100%; margin-top:12px;">Look Up</button>
                    </form>

                    <div class="auth-link" style="margin-top:24px;">
                        <a href="#/login" style="font-size:0.82rem; color:rgba(11,42,42,0.5);">Admin Login</a>
                    </div>
                </div>
            </div>

            <!-- Result Section -->
            <div id="lookup-result" style="display:none;"></div>
        `;
    },

    async init(prefillToken) {
        this.scannerActive = false;
        this.scanner = null;
        this.bindEvents();

        if (prefillToken) {
            $('#lookup-token').val(prefillToken);
            this.doLookup(prefillToken);
        }
    },

    bindEvents() {
        const self = this;

        // --- Camera scan ---
        $('#toggle-scanner').on('click', async () => {
            if (self.scannerActive) {
                self.stopScanner();
                return;
            }
            $('#qr-scanner').show();
            $('#toggle-scanner').text('Stop Scanner');
            self.scannerActive = true;

            try {
                self.scanner = new Html5Qrcode('qr-scanner');
                await self.scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        self.stopScanner();
                        self.onCodeFound(decodedText);
                    },
                    () => {}
                );
            } catch (err) {
                Toast.error('Could not access camera. Try uploading or pasting an image instead.');
                self.stopScanner();
            }
        });

        // --- File upload ---
        $('#upload-qr').on('change', function () {
            const file = this.files[0];
            if (file) self.decodeImageFile(file);
            $(this).val('');
        });

        // --- Paste (Ctrl+V anywhere or on the paste zone) ---
        $(document).off('paste.lookup').on('paste.lookup', (e) => {
            const items = (e.originalEvent.clipboardData || e.clipboardData)?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) self.decodeImageFile(file);
                    return;
                }
            }
        });

        // --- Drag and drop ---
        const $zone = $('#paste-zone');
        $zone.on('dragover', (e) => {
            e.preventDefault();
            $zone.css({ borderColor: 'var(--accent-600)', background: 'rgba(180,138,73,0.06)' });
        });
        $zone.on('dragleave drop', (e) => {
            e.preventDefault();
            $zone.css({ borderColor: 'rgba(17,56,54,0.2)', background: 'transparent' });
        });
        $zone.on('drop', (e) => {
            const file = e.originalEvent.dataTransfer?.files[0];
            if (file && file.type.startsWith('image/')) {
                self.decodeImageFile(file);
            }
        });

        // --- Manual form ---
        $('#lookup-form').on('submit', (e) => {
            e.preventDefault();
            const token = $('#lookup-token').val().trim();
            if (!token) {
                $('#lookup-error').text('Please enter a reservation code');
                return;
            }
            self.doLookup(token);
        });
    },

    decodeImageFile(file) {
        const self = this;
        const $preview = $('#paste-preview');
        $preview.html(`<div class="spinner" style="margin:8px auto;"></div><div style="color:rgba(11,42,42,0.5); font-size:0.85rem;">Scanning QR code...</div>`);

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            // Draw to canvas so we can extract pixel data
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            // Use jsQR if available, otherwise fall back to Html5Qrcode.scanFile
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Try Html5Qrcode.scanFile with a proper hidden element
            const tempId = 'qr-tmp-' + Date.now();
            const $temp = $('<div id="' + tempId + '"></div>').css({
                position: 'fixed', left: '-9999px', top: '-9999px',
                width: '300px', height: '300px'
            }).appendTo('body');

            const tempScanner = new Html5Qrcode(tempId);
            tempScanner.scanFile(file, /* showImage */ false)
                .then((decodedText) => {
                    tempScanner.clear();
                    $temp.remove();
                    $preview.html(`<div style="color:var(--success); font-weight:600; font-size:0.9rem;">QR code detected!</div>`);
                    self.onCodeFound(decodedText);
                })
                .catch(() => {
                    tempScanner.clear();
                    $temp.remove();
                    $preview.html(`
                        <img src="${canvas.toDataURL()}" style="max-width:160px; max-height:160px; border-radius:8px; opacity:0.6;">
                        <div style="color:var(--danger); font-size:0.88rem; margin-top:8px;">Could not read QR code. Try a clearer image.</div>
                    `);
                });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            $preview.html(`<div style="color:var(--danger); font-size:0.88rem;">Invalid image file.</div>`);
        };
        img.src = url;
    },

    onCodeFound(code) {
        const token = code.trim();
        $('#lookup-token').val(token);
        Toast.success('QR code scanned: ' + token);
        this.doLookup(token);
    },

    stopScanner() {
        if (this.scanner) {
            this.scanner.stop().catch(() => {});
            this.scanner = null;
        }
        this.scannerActive = false;
        $('#toggle-scanner').text('Scan QR');
        $('#qr-scanner').hide();
    },

    async doLookup(token) {
        const $btn = $('#lookup-btn');
        $btn.prop('disabled', true).text('Looking up...');
        $('#lookup-error').text('');

        const res = await API.lookupReservation(token);

        if (!res.success) {
            $('#lookup-error').text(res.message);
            $('#lookup-result').hide();
            $btn.prop('disabled', false).text('Look Up');
            return;
        }

        $btn.prop('disabled', false).text('Look Up');
        this.showResult(res.data);
    },

    showResult(r) {
        const statusClass = r.status;
        const statusLabel = r.status.replace('_', ' ');

        let discountRow = '';
        if (Number(r.discount_amount) > 0) {
            discountRow = `
                <div class="pricing-row discount">
                    <span class="label">Cash Discount</span>
                    <span class="amount">-$${Number(r.discount_amount).toFixed(2)}</span>
                </div>
            `;
        }

        let surchargeRow = '';
        if (Number(r.surcharge_amount) > 0) {
            surchargeRow = `
                <div class="pricing-row surcharge">
                    <span class="label">${r.payment_type} Surcharge</span>
                    <span class="amount">+$${Number(r.surcharge_amount).toFixed(2)}</span>
                </div>
            `;
        }

        const html = `
            <section class="section" style="animation: floatIn 0.5s ease;">
                <div class="dashboard-header">
                    <div>
                        <div class="section-title">Reservation Details</div>
                        <p style="color:rgba(11,42,42,0.6);">Code: <strong style="letter-spacing:0.1em;">${r.token}</strong></p>
                    </div>
                    <span class="status ${statusClass}" style="font-size:0.88rem; padding:8px 20px;">${statusLabel}</span>
                </div>

                <div class="two-col" style="margin-top:24px;">
                    <div class="panel">
                        <h3>Guest Information</h3>
                        <div class="info-grid">
                            <div class="field">
                                <span>Name</span>
                                <div class="value">${this.escapeHtml(r.customer_name)}</div>
                            </div>
                            <div class="field">
                                <span>Contact</span>
                                <div class="value">${this.escapeHtml(r.contact_number)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <h3>Room Details</h3>
                        <div class="info-grid">
                            <div class="field">
                                <span>Room</span>
                                <div class="value">${r.capacity} ${r.room_type}</div>
                            </div>
                            <div class="field">
                                <span>Rate</span>
                                <div class="value">$${Number(r.rate_per_day).toFixed(2)}/day</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="two-col" style="margin-top:16px;">
                    <div class="panel">
                        <h3>Stay Dates</h3>
                        <div class="info-grid">
                            <div class="field">
                                <span>Check-in</span>
                                <div class="value">${r.check_in}</div>
                            </div>
                            <div class="field">
                                <span>Check-out</span>
                                <div class="value">${r.check_out}</div>
                            </div>
                            <div class="field">
                                <span>Duration</span>
                                <div class="value">${r.num_days} day${r.num_days > 1 ? 's' : ''}</div>
                            </div>
                        </div>
                    </div>
                    <div class="pricing-panel" style="margin-top:0;">
                        <h3 style="font-family:'Playfair Display',serif; margin-bottom:16px;">Billing</h3>
                        <div class="pricing-row">
                            <span class="label">Subtotal (${r.num_days} x $${Number(r.rate_per_day).toFixed(2)})</span>
                            <span class="amount">$${Number(r.subtotal).toFixed(2)}</span>
                        </div>
                        ${discountRow}
                        ${surchargeRow}
                        <div class="pricing-row total">
                            <span class="label">Total</span>
                            <span class="amount">$${Number(r.total).toFixed(2)}</span>
                        </div>
                        <div style="margin-top:8px; font-size:0.82rem; color:rgba(11,42,42,0.5);">
                            Payment: ${r.payment_type}
                        </div>
                    </div>
                </div>

                <div style="text-align:center; margin-top:32px;">
                    <a href="#/lookup" class="btn secondary small">Look Up Another</a>
                    <a href="#/reservation" class="btn small" style="margin-left:12px;">New Reservation</a>
                </div>
            </section>
        `;

        $('#lookup-result').html(html).show();
        $('#lookup-result')[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
