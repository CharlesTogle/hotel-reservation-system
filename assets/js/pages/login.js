const LoginPage = {
    render() {
        return `
            <div class="auth-container">
                <div class="auth-panel">
                    <h2>Admin Login</h2>
                    <p class="subtitle">Staff access to the management dashboard</p>
                    <form id="login-form">
                        <div class="form-field">
                            <label for="login-email">Email</label>
                            <input class="input" type="email" id="login-email" placeholder="admin@hotelmemis.com" required>
                        </div>
                        <div class="form-field">
                            <label for="login-password">Password</label>
                            <input class="input" type="password" id="login-password" placeholder="Your password" required>
                        </div>
                        <div id="login-error" class="form-error" style="text-align:center; margin-bottom:8px;"></div>
                        <button type="submit" class="btn" id="login-btn">Sign In</button>
                    </form>
                    <div class="auth-link">
                        Guest? <a href="#/lookup">View your reservation here</a>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        $('#login-form').on('submit', async function (e) {
            e.preventDefault();
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val();
            const $btn = $('#login-btn');

            $btn.prop('disabled', true).text('Signing in...');
            $('#login-error').text('');

            const res = await API.login(email, password);

            if (res.success) {
                Toast.success('Welcome back, ' + res.data.name + '!');
                await Header.init();
                window.location.hash = '#/dashboard';
            } else {
                $('#login-error').text(res.message);
                $btn.prop('disabled', false).text('Sign In');
            }
        });
    }
};
