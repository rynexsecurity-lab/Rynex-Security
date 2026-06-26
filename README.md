# Rynex Security Website

Production-ready Express and EJS migration of the Rynex Security static website.

## Stack

- Node.js and Express
- EJS templates with reusable partials
- Helmet, compression, Morgan, cookie-parser
- express-rate-limit and express-validator
- Multer for multipart form parsing
- Web3Forms backend submission
- Nodemailer notification and confirmation emails

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

For production:

```bash
npm start
```

The default local URL is:

```text
http://localhost:3000
```

## Environment Variables

Create `.env` from `.env.example` and set:

- `BASE_URL`: canonical site URL
- `WEB3FORMS_ACCESS_KEY`: Web3Forms API key
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: SMTP credentials
- `MAIL_FROM`: sender shown on outgoing emails
- `MAIL_TO`: internal recipient for contact notifications

Secrets are never rendered into frontend HTML.

## Routes

Clean routes and legacy `.html` routes both work:

- `/` and `/index.html`
- `/about` and `/about.html`
- `/services` and `/services.html`
- `/blog` and `/blog.html`
- `/contact` and `/contact.html`
- `/internship` and `/internship.html`

Blog article `.html` URLs are also preserved.

## Contact Flow

The contact form submits to `/api/contact`.

1. Rate limiting protects the endpoint.
2. Multer parses browser `FormData`.
3. express-validator validates and sanitizes all input.
4. A honeypot field filters basic spam.
5. The backend submits to Web3Forms using the server-side access key.
6. Nodemailer sends the admin notification.
7. Nodemailer sends the visitor confirmation email.
8. JSON success or error responses are returned to the frontend.

If Web3Forms fails but SMTP is configured, the backend still sends the email notification as a fallback.

## SEO

The app serves:

- `robots.txt`
- `sitemap.xml`
- canonical tags
- Open Graph tags
- Twitter card tags
- organization JSON-LD
- favicon

## Project Structure

```text
config/
controllers/
middleware/
public/
routes/
services/
utils/
views/
app.js
```
