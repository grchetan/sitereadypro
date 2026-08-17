# SiteReadyPro

> **A quiet freelance studio for beautiful, editorial websites and ready-made templates.**  
> Crafted with care for students, indie creators, boutique founders, and small businesses.

---

## 🌟 Overview

SiteReadyPro is an independent web design and development studio that bridges the gap between expensive agencies and generic builders. It offers two streamlined ways to launch:

1. **Ready-made Templates**: Curated, editorial HTML/CSS and full-stack templates ready to download and deploy the same day.
2. **Custom Bespoke Websites**: End-to-end designed and built websites tailored to your brand, including free domain setup and ongoing maintenance.
3. **Admin Studio Panel**: A built-in management suite with Firebase Authentication, Firestore request tracking, and template catalog management.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) (Full-Stack SSR & Nitro)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing)
- **State & Data**: [TanStack Query](https://tanstack.com/query) + [Cloud Firestore](https://firebase.google.com/)
- **Authentication & Storage**: [Firebase Auth](https://firebase.google.com/products/auth) + [Firebase Storage](https://firebase.google.com/products/storage)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom HSL design tokens & Vanilla CSS utilities
- **UI Components**: [Radix UI](https://www.radix-ui.com/) / shadcn primitives + [Lucide Icons](https://lucide.dev/)
- **Email Delivery**: [EmailJS](https://www.emailjs.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/grchetan/sitereadypro.git
cd sitereadypro

# 2. Install dependencies
npm install

# 3. Setup environment variables (.env)
# Fill in your Firebase and EmailJS credentials
npm run dev
```

The development server will start at `http://localhost:8081`.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=sitereadypro.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sitereadypro
VITE_FIREBASE_STORAGE_BUCKET=sitereadypro.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Authentication
VITE_ADMIN_EMAILS=chetanprajapat340@gmail.com

# EmailJS Configuration (Contact Form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 📦 Project Structure

```text
sitereadypro/
├── public/                 # Static assets, SVG and favicon files
├── src/
│   ├── assets/             # Editorial imagery, mockups, and textures
│   ├── components/         # Reusable UI primitives, chrome, and navigation
│   │   ├── admin-ui.tsx    # Admin dashboard components
│   │   ├── site-chrome.tsx # Layout components, marquee, headers
│   │   └── ui/             # Radix UI / shadcn design system primitives
│   ├── data/               # Seed catalog and template definitions
│   ├── lib/                # Firebase, Firestore, store, and utility libraries
│   │   ├── admin-auth.ts   # Firebase auth hooks & admin guard
│   │   ├── admin-store.ts  # Admin state management
│   │   ├── firebase.ts     # Firebase client initialization
│   │   └── firestore.ts    # Firestore CRUD & Storage uploads
│   ├── routes/             # TanStack file-based routes
│   │   ├── __root.tsx      # App shell, typography, and providers
│   │   ├── index.tsx       # Studio homepage
│   │   ├── templates.tsx   # Template showcase library
│   │   ├── templates.$slug.tsx # Template detail, preview & download
│   │   ├── freelance.tsx   # Freelance services & comparison
│   │   ├── contact.tsx     # 4-step project brief builder
│   │   ├── admin.tsx       # Protected admin route & login guard
│   │   └── admin.*.tsx     # Admin sub-pages (templates, requests, settings)
│   └── styles.css          # Design system variables & custom utilities
└── vite.config.ts          # Vite build & SSR configuration
```

---

## 🏗️ Build & Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

© 2025–2026 SiteReadyPro. All rights reserved.
