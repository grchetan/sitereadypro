# EmailJS Setup Guide — SiteReadyPro Contact Form

This guide helps you connect the contact form to your email inbox using EmailJS (free).

---

## Step 1 — Create a free EmailJS account

1. Go to https://emailjs.com
2. Click **Sign Up** → use your Gmail (`chetanprajapat340@gmail.com`)
3. Verify your email

---

## Step 2 — Add an Email Service

1. In EmailJS dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Click **Connect Account** → sign in with your Gmail
4. Give it a name: `sitereadypro_service`
5. Click **Create Service**
6. **Copy the Service ID** (looks like: `service_abc123`)

---

## Step 3 — Create an Email Template

1. In EmailJS dashboard → **Email Templates** → **Create New Template**
2. Set **To Email**: `chetanprajapat340@gmail.com`
3. Set **From Name**: `{{from_name}}`
4. Set **Subject**: `New Project Brief from {{from_name}}`
5. Set **Reply To**: `{{from_email}}`
6. Set **Email Body** (plain text or HTML):

```
Hi {{to_name}},

You have a new project brief from your website!

---
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}

Project Type: {{project_type}}
Budget: {{budget}}
Timeline: {{timeline}}
Goals: {{goals}}
Features: {{features}}
Preferred Contact: {{preferred_contact}}

Scope / Description:
{{scope}}
---

Reply directly to this email to respond to the client.
```

6. Click **Save**
7. **Copy the Template ID** (looks like: `template_xyz789`)

---

## Step 4 — Get your Public Key

1. In EmailJS dashboard → top right → **Account** → **General**
2. Find **Public Key** (looks like: `AbCdEf1234567890`)
3. Copy it

---

## Step 5 — Add keys to .env file

Open your `.env` file in the project root and fill in:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=AbCdEf1234567890
```

---

## Step 6 — Test it

1. Run `npm run dev`
2. Go to `/contact` on your local site
3. Fill in the full brief form and submit
4. Check your Gmail inbox — you should receive the email within seconds!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not received | Check spam folder. Also check EmailJS dashboard → Email Logs |
| "Invalid Public Key" error | Double-check the Public Key in `.env` |
| Gmail not connected | In EmailJS → Email Services → reconnect Gmail |
| Quota exceeded | Free tier = 200 emails/month. Upgrade or use a different service |

---

## Free tier limits

- **200 emails / month** — enough for a startup
- No credit card required
- To increase: upgrade EmailJS plan (~$15/month for 1000 emails)

---

## Notes

- The form also saves every submission to **Firestore** (regardless of EmailJS status)
- So even if EmailJS fails, you can see all requests in the Admin Panel → Client Requests
- Admin panel reads from Firestore once you enable it
