# Hotel Memis - Reservation System

A hotel reservation system built with vanilla PHP, SQLite, and jQuery. Guests can browse rooms, make reservations, and receive QR-coded confirmation tokens. Admins manage reservations and room details through a built-in dashboard.

---

## 1. Setup Guide (Windows)

### Option A: XAMPP Setup

#### Step 1: Install XAMPP

1. Download XAMPP for Windows from [https://www.apachefriends.org](https://www.apachefriends.org)
2. Run the installer — select at minimum **Apache** and **PHP** (MySQL is not needed since we use SQLite)
3. Install to the default location: `C:\xampp`
4. When the installer finishes, open the **XAMPP Control Panel**

#### Step 2: Enable SQLite in PHP

1. Open `C:\xampp\php\php.ini` in a text editor (Notepad, VS Code, etc.)
2. Press `Ctrl+F` and search for `sqlite`
3. Find these lines and remove the `;` at the start (uncomment them):
   ```ini
   extension=pdo_sqlite
   extension=sqlite3
   ```
   They should look like this after editing (no semicolons):
   ```ini
   extension=pdo_sqlite
   extension=sqlite3
   ```
4. Save the file
5. In the XAMPP Control Panel, **Stop** and then **Start** Apache to apply the changes

#### Step 3: Deploy the Project

1. Download or clone this project
2. Copy the entire project folder into your XAMPP `htdocs` directory:
   ```
   C:\xampp\htdocs\ReservationSystemGabionTogle
   ```
   Your folder structure should look like:
   ```
   C:\xampp\htdocs\ReservationSystemGabionTogle\
   ├── api\
   ├── assets\
   ├── classes\
   ├── database\
   ├── setup\
   ├── index.php
   ├── router.php
   └── ...
   ```

#### Step 4: Run the Migration

1. Make sure Apache is running in the XAMPP Control Panel (green highlight)
2. Open your browser and go to:
   ```
   http://localhost/ReservationSystemGabionTogle/setup/migrate.php
   ```
3. You should see:
   ```
   Migration completed successfully!
   Admin account: admin@hotelmemis.com / admin123
   ```

#### Step 5: Access the App

Open your browser and go to:
```
http://localhost/ReservationSystemGabionTogle/
```

You should see the Hotel Memis home page. You're all set!

> **Note:** When using XAMPP, Apache serves the app directly from the `htdocs` folder. You don't need the `router.php` — Apache handles routing.

---

### Option B: PHP Built-in Server (CLI)

This approach doesn't require XAMPP — you only need PHP installed on your system.

#### Step 1: Download PHP

1. Go to [https://windows.php.net/download](https://windows.php.net/download)
2. Under the latest PHP version (e.g., PHP 8.3), download the **VS16 x64 Thread Safe** zip file
3. Create a folder: `C:\php`
4. Extract the zip contents into `C:\php` so that `php.exe` is at `C:\php\php.exe`

#### Step 2: Configure PHP

1. In `C:\php`, find the file `php.ini-development`
2. Copy it and rename the copy to `php.ini`
3. Open `php.ini` in a text editor
4. Press `Ctrl+F` and search for `extension_dir`. Find this line:
   ```ini
   ;extension_dir = "ext"
   ```
   Remove the `;` so it becomes:
   ```ini
   extension_dir = "ext"
   ```
5. Search for `pdo_sqlite` and `sqlite3`. Uncomment both lines:
   ```ini
   extension=pdo_sqlite
   extension=sqlite3
   ```
6. Save the file

#### Step 3: Add PHP to System PATH

1. Press `Win + S` and search for **"Environment Variables"**
2. Click **"Edit the system environment variables"**
3. Click the **"Environment Variables..."** button
4. Under **System Variables**, find and select **Path**, then click **Edit**
5. Click **New** and add:
   ```
   C:\php
   ```
6. Click **OK** on all dialogs to save

#### Step 4: Verify PHP Installation

1. Open a **new** Command Prompt or PowerShell window (must be new so PATH updates take effect)
2. Run:
   ```cmd
   php -v
   ```
   You should see something like:
   ```
   PHP 8.3.x (cli) (built: ...)
   ```
3. Verify SQLite is enabled:
   ```cmd
   php -m
   ```
   Scroll through the list — you should see `pdo_sqlite` and `sqlite3`.

#### Step 5: Run the Migration

1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```cmd
   cd C:\path\to\ReservationSystemGabionTogle
   ```
3. Run the migration:
   ```cmd
   php setup/migrate.php
   ```
4. You should see:
   ```
   Migration completed successfully!
   Admin account: admin@hotelmemis.com / admin123
   ```

#### Step 6: Start the Server

From the project folder, run:
```cmd
php -S localhost:8000 router.php
```

You should see:
```
PHP 8.3.x Development Server (http://localhost:8000) started
```

> **Keep this terminal window open** — closing it stops the server.

The `router.php` file handles:
- Serving static files (CSS, JS, images)
- Routing API requests to the correct PHP endpoint
- Serving the SPA shell (`index.php`) for all other routes

#### Step 7: Access the App

Open your browser and go to:
```
http://localhost:8000
```

You should see the Hotel Memis home page. You're all set!

---

### Troubleshooting (Windows)

| Problem | Solution |
|---------|----------|
| `'php' is not recognized as an internal or external command` | PHP is not in your PATH. Re-do Step 3 of Option B, and make sure to open a **new** terminal window after editing PATH. |
| `Migration completed` but the app shows a blank page | Make sure you're accessing the correct URL. For XAMPP: `http://localhost/ReservationSystemGabionTogle/`. For CLI: `http://localhost:8000`. |
| `could not find driver` error | SQLite extensions are not enabled. Open your `php.ini` and make sure `extension=pdo_sqlite` and `extension=sqlite3` are uncommented (no `;` at the start). |
| `extension_dir` errors or DLL not found | Make sure `extension_dir = "ext"` is uncommented in `php.ini` (Option B only). |
| Port 8000 already in use | Use a different port: `php -S localhost:9000 router.php` and then visit `http://localhost:9000`. |
| XAMPP Apache won't start | Another program (like Skype or IIS) may be using port 80. In XAMPP, click **Config** on Apache → change `Listen 80` to `Listen 8080` in `httpd.conf`, then access via `http://localhost:8080/ReservationSystemGabionTogle/`. |

### Database Location

The SQLite database file is stored at:
```
database\database.sqlite
```

It is created automatically when you run the migration. To reset the database, delete this file and re-run the migration.

---

## 2. Client Flows

### Browsing Rooms (Home Page)

1. Client lands on the home page (`#/`)
2. Featured suite rooms are displayed automatically
3. Each room card shows the image, type, description, and daily rate
4. Client clicks **"Reserve Now"** to start booking

### Making a Reservation

1. Navigate to `#/reservation`
2. Fill in **Guest Information**:
   - Customer Name
   - Contact Number (Philippine format: +63 or 09...)
3. Select **Dates**:
   - Check-in date (today or later)
   - Check-out date (auto-enforced to be after check-in)
   - Duration is calculated and displayed automatically
4. Select **Room Capacity** (Single / Double / Family):
   - Available rooms for that capacity appear as cards
5. Click a **Room Card** to select it
6. **Billing Summary** appears with:
   - Room rate per day
   - Duration
   - Subtotal
   - Cash discount (10% for 3-5 days, 15% for 6+ days — cash only)
   - Payment surcharge (5% for Check, 10% for Credit Card)
   - Total
7. Click **"Confirm Reservation"**
8. On success:
   - A **QR Code modal** appears with the reservation token
   - The token is an 8-character alphanumeric code (e.g., `A1B2C3D4`)
   - A booking summary is shown
   - Links to **View Reservation** or **Back to Home**
   - The form resets for a new booking
9. On failure (e.g., room already booked for those dates):
   - Error message is displayed
   - Form state is preserved so the client can adjust

### Looking Up a Reservation

1. Navigate to `#/lookup`
2. Look up via any of these methods:
   - **Scan QR** — opens device camera to scan the QR code
   - **Upload QR** — select a QR code image file
   - **Paste QR** — paste (Ctrl+V) or drag-and-drop a QR code image
   - **Manual Entry** — type the 8-character reservation code
3. The reservation detail page shows:
   - Guest name and contact
   - Room type and rate
   - Check-in / check-out dates and duration
   - Full billing breakdown (subtotal, discounts, surcharges, total)
   - Current status (confirmed, checked in, checked out, cancelled)

### Direct Lookup via URL

Reservation details can be accessed directly via:
```
#/lookup/A1B2C3D4
```
This auto-fills the token and performs the lookup immediately.

---

## 3. Admin Flows

### Logging In

1. Navigate to `#/login`
2. Enter admin credentials:
   - **Email:** `admin@hotelmemis.com`
   - **Password:** `admin123`
3. On success: redirected to the admin dashboard
4. The navigation bar updates to show **Dashboard** and **Log Out**

### Dashboard — Reservations Tab

1. Navigate to `#/dashboard`
2. **Stats cards** at the top show:
   - Total Reservations (real count from database)
   - Confirmed count
   - Checked In count
   - Total Revenue
3. **Reservations table** displays all bookings with:
   - Reservation code, guest name/contact, room, dates, days, payment, total, status
4. **Change status** via the dropdown on each row:
   - Options: Confirmed, Checked In, Checked Out, Cancelled
   - All dropdowns are disabled during an update to prevent race conditions
   - Stats refresh automatically after each change
5. **Delete a reservation**:
   - Click the Delete button
   - Confirm in the modal dialog
   - Table and stats refresh after deletion

### Dashboard — Manage Rooms Tab

1. Click the **"Manage Rooms"** tab
2. Each room is displayed as a CMS card with editable fields:
   - **Rate per Day** — must be greater than zero
   - **Description** — cannot be empty
   - **Image** — two options:
     - **Image URL** — paste a direct URL, with live preview
     - **Upload Image** — select a file (PNG, JPG, WebP, GIF, SVG, BMP, TIFF, max 10MB)
3. After uploading an image, the old image file is automatically cleaned up from disk
4. Click **"Save Changes"** to persist edits to the database
5. Changes are reflected immediately on the public-facing pages

### Logging Out

1. Click **"Log Out"** in the navigation
2. Session is cleared on both server and client
3. Redirected to the home page
4. Navigation reverts to the guest view

---

## 4. Feature List

### Guest Features

| Feature | Description |
|---------|-------------|
| Room Browsing | View featured rooms on the home page with images, descriptions, and rates |
| Smart Reservation Form | Multi-step form with capacity filtering, room selection, and live pricing |
| Dynamic Pricing | Real-time billing with cash discounts (10%/15%) and payment surcharges (5%/10%) |
| Double-Booking Prevention | Server-side overlap detection prevents booking a room on conflicting dates |
| QR Code Confirmation | Generates a QR code with the reservation token on successful booking |
| Multi-Method Lookup | Look up reservations via QR scan (camera), QR upload, QR paste/drag-drop, or manual code entry |
| Direct URL Lookup | Access reservation details directly via `#/lookup/TOKEN` |
| Responsive Design | Works on desktop and mobile devices |

### Admin Features

| Feature | Description |
|---------|-------------|
| Secure Login | Session-based authentication with password hashing |
| Dashboard Stats | Real-time overview of total reservations, confirmed, checked-in, and revenue |
| Reservation Management | View all reservations in a paginated table with status updates and deletion |
| Status Workflow | Update reservation status: Confirmed → Checked In → Checked Out (or Cancelled) |
| Room CMS | Edit room rates, descriptions, and images through a visual editor |
| Image Upload | Upload room images with automatic old-file cleanup |
| Image URL Support | Set room images via direct URL with live preview |

### Technical Features

| Feature | Description |
|---------|-------------|
| SQLite Database | Zero-config database — no MySQL/PostgreSQL setup needed |
| PHP Built-in Server | Run locally with `php -S localhost:8000 router.php` — no Apache needed |
| SPA Architecture | Hash-based routing with jQuery — single page, no full reloads |
| API Layer | RESTful JSON API with proper HTTP status codes and error messages |
| Input Validation | Server-side validation on all endpoints (dates, payment types, rates, status) |
| Pagination | Paginated reservation listing API with configurable page/limit |
| Token Collision Handling | Auto-retry (up to 3 attempts) on unique token generation |
| Race Condition Guards | Status selects disabled during updates; pricing requests use staleness checks |
| Page Cleanup | Camera scanner and event listeners properly cleaned up on navigation |
| Error Handling | Graceful error handling on all API calls with user-facing toast messages |

### Pricing Rules

| Rule | Condition | Effect |
|------|-----------|--------|
| Cash Discount (10%) | Cash payment, 3-5 day stay | 10% off subtotal |
| Cash Discount (15%) | Cash payment, 6+ day stay | 15% off subtotal |
| Check Surcharge | Check/Cheque payment | +5% on amount after discount |
| Credit Card Surcharge | Credit Card payment | +10% on amount after discount |

### Room Types

| Capacity | Types | Rate Range |
|----------|-------|------------|
| Single | Regular, De Luxe, Suite | $100 - $500/day |
| Double | Regular, De Luxe, Suite | $200 - $800/day |
| Family | Regular, De Luxe, Suite | $500 - $1,000/day |

---

## Project Structure

```
ReservationSystemGabionTogle/
├── api/
│   ├── auth/
│   │   ├── login.php          # POST - Admin login
│   │   ├── logout.php         # POST - Admin logout
│   │   └── me.php             # GET  - Current user info
│   ├── pricing/
│   │   └── calculate.php      # POST - Calculate reservation price
│   ├── reservations/
│   │   ├── create.php         # POST - Create reservation (public)
│   │   ├── delete.php         # DELETE - Delete reservation (admin)
│   │   ├── index.php          # GET  - List reservations (admin, paginated)
│   │   ├── lookup.php         # GET  - Lookup by token (public)
│   │   └── update.php         # PUT  - Update status (admin)
│   ├── rooms/
│   │   ├── index.php          # GET  - List all rooms (public)
│   │   ├── update.php         # PUT  - Update room details (admin)
│   │   └── upload.php         # POST - Upload room image (admin)
│   └── bootstrap.php          # Shared setup: autoloader, session, helpers
├── assets/
│   ├── css/style.css
│   ├── images/
│   └── js/
│       ├── api.js             # API client
│       ├── app.js             # SPA router
│       ├── components/        # Header, Footer, Toast, Modal
│       └── pages/             # Home, Reservation, Lookup, Dashboard, Login, etc.
├── classes/
│   ├── Auth.php               # Session management
│   ├── Database.php           # SQLite singleton
│   ├── PriceCalculator.php    # Pricing logic
│   ├── Reservation.php        # Reservation CRUD + availability
│   ├── Room.php               # Room CRUD
│   ├── User.php               # User auth + registration
│   └── Validator.php          # Input validation
├── database/
│   └── database.sqlite        # SQLite database (auto-created)
├── docs/
│   └── README.md              # This file
├── rooms/                     # Uploaded room images
├── setup/
│   └── migrate.php            # Database migration + seeding
├── index.php                  # SPA shell (HTML entry point)
└── router.php                 # PHP built-in server router
```
