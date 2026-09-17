# Essendaar Suppliers & Facility Care — cPanel & GitHub Deployment Guide

**Target Repository:** [github.com/infinityriseinnovations-cmd/Right-Choice](https://github.com/infinityriseinnovations-cmd/Right-Choice)  
**Live Application:** ISO 9001:2015 B2B Procurement Portal & WooCommerce Storefront

---

## 🚀 Option 1: Direct cPanel Live Upload (Fastest — 2 Minutes)

All production-ready files are packaged in `/cpanel-live-ready/`.

1. **Log in to your cPanel account**.
2. Open **File Manager** and navigate to your document root (usually `public_html` or your domain's subdomain folder).
3. Upload the contents of the `cpanel-live-ready/` directory:
   - `index.html`
   - `assets/` folder (JavaScript bundle, Tailwind stylesheet, optimized assets)
   - `.htaccess` (Configured for HTTPS redirection, GZIP compression, and SPA routing)
4. Visit your domain in the browser (e.g. `https://yourdomain.com`). The website is immediately **live** with full shopping cart, UPI checkout, facility management RFPs, and product catalogs!

---

## 🎨 Option 2: WordPress / WooCommerce Theme Upload

If you are running a standard WordPress + WooCommerce installation on cPanel:

1. Locate the `/wordpress-theme/` folder in this project:
   - `style.css` (Theme header with WooCommerce support)
   - `functions.php` (Custom B2B GSTIN checkout fields, Indian Rupee currency filters, enqueue scripts)
   - `header.php` (Header with Tamilnadu Test House & ISO 9001:2015 compliance bar)
   - `footer.php` (Factory contacts & quick links)
   - `index.php` (Standard fallback template)
2. Compress `wordpress-theme/` into a `.zip` file: `essendaar-theme.zip`.
3. In your WordPress Admin: Go to **Appearance > Themes > Add New > Upload Theme** and select `essendaar-theme.zip`.
4. Click **Activate**.

---

## 🌿 Option 3: GitHub Branching & Git Push Instructions

To sync this codebase with `github.com/infinityriseinnovations-cmd/Right-Choice` on a new branch (e.g., `cpanel-live` or `wordpress-release`):

### Using Git CLI:
```bash
# 1. Initialize git and link to the repository
git init
git remote add origin https://github.com/infinityriseinnovations-cmd/Right-Choice.git

# 2. Create and switch to a dedicated release branch
git checkout -b cpanel-live

# 3. Add all files (including WordPress templates and cpanel-live-ready bundle)
git add .

# 4. Commit changes
git commit -m "feat: add production WordPress theme and cPanel live deployment bundle"

# 5. Push to the new GitHub branch
git push -u origin cpanel-live
```

### Using Google AI Studio Export:
1. Click the **Settings** / **Export** menu in the top right corner of Google AI Studio.
2. Select **Export to GitHub** or **Download ZIP**.
3. Target the repository `infinityriseinnovations-cmd/Right-Choice` and specify your new branch name.

---

## 📞 Support & Plant Verification
- **Manufacturing Plant:** Mangadu, Chennai, Tamil Nadu - 600122
- **Direct Phone / WhatsApp:** +91 97879 79757
- **Official Inquiries:** essendaargroup@gmail.com
