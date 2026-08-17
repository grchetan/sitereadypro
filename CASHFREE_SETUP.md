# Cashfree Payment Gateway Setup Guide — SiteReadyPro

This guide helps you integrate Cashfree for paid template purchases.

> **Note**: Cashfree integration code is already planned in the codebase.
> Follow this guide to get your credentials ready.

---

## Step 1 — Create a Cashfree merchant account

1. Go to https://merchant.cashfree.com/
2. Click **Sign Up**
3. Fill in your details:
   - Business Type: **Individual / Freelancer**
   - Business Name: SiteReadyPro
   - Mobile: your mobile number
   - Email: `chetanprajapat340@gmail.com`
4. Complete KYC (PAN + bank details required for production)

---

## Step 2 — Get API credentials (Sandbox first)

### For Testing (Sandbox):
1. Login to Cashfree dashboard
2. Switch to **Test Mode** (toggle in top right)
3. Go to **Developers** → **API Keys**
4. Copy:
   - **App ID** (e.g., `TEST123456789`)
   - **Secret Key** (e.g., `cfsk_ma_test_abcdef123456`)

### For Production (after KYC approval):
1. Switch to **Production Mode**
2. Go to **Developers** → **API Keys**
3. Copy the production App ID and Secret Key

---

## Step 3 — Add to .env file

For testing (sandbox):
```env
CASHFREE_APP_ID=TEST123456789
CASHFREE_SECRET_KEY=cfsk_ma_test_abcdef123456
CASHFREE_ENV=sandbox
```

For production (after testing works):
```env
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
CASHFREE_ENV=production
```

> **Important**: `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` do NOT have the `VITE_` prefix.
> They are server-side only and must NEVER be exposed to the browser.

---

## Step 4 — Webhook Setup

Webhooks allow Cashfree to notify your server when a payment completes.

1. In Cashfree dashboard → **Developers** → **Webhooks**
2. Click **Add Webhook**
3. Set URL to: `https://yourdomain.com/api/cashfree-webhook`
   - For local testing: use [ngrok](https://ngrok.com) to expose localhost
4. Select events: **Payment Success**, **Payment Failed**
5. Copy the **Webhook Secret** and add to `.env`:
```env
CASHFREE_WEBHOOK_SECRET=your_webhook_secret
```

---

## Step 5 — Test payment flow

Use these test card details in sandbox mode:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., `12/26`) |
| CVV | Any 3 digits (e.g., `123`) |
| OTP | `111111` |

### UPI Test:
- Use UPI ID: `success@upi` (simulates success)
- Use UPI ID: `failure@upi` (simulates failure)

---

## Step 6 — Go Live checklist

Before switching to production:
- [ ] KYC documents submitted and approved
- [ ] Bank account connected and verified
- [ ] At least 1 successful sandbox transaction
- [ ] Webhook tested in sandbox
- [ ] Privacy Policy and T&C pages live on your site
- [ ] Change `CASHFREE_ENV=production` in `.env`

---

## Pricing / Fees

| Payment method | Fee |
|----------------|-----|
| UPI | 0% (free!) |
| Debit/Credit card | ~2% |
| Net banking | ~1.5% |

No monthly fee. Pay only when you earn.

---

## Support

- Cashfree docs: https://docs.cashfree.com
- Cashfree support: https://merchant.cashfree.com/help
- For integration help: WhatsApp Chetan after setup
