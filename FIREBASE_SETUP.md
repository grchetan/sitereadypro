# Firebase Setup Guide — Firestore + Storage

Enable Firestore and Storage in your Firebase project to power the template marketplace and admin panel.

---

## Step 1 — Enable Cloud Firestore

1. Go to https://console.firebase.google.com/project/sitereadypro
2. Left sidebar → **Build** → **Firestore Database**
3. Click **Create database**
4. Choose **Start in test mode** (we'll add rules later)
5. Select region: **asia-south1 (Mumbai)** (recommended for India)
6. Click **Enable**

### Firestore Security Rules (paste after creation):

Go to Firestore → **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Templates — anyone can read published, only admins can write
    match /templates/{templateId} {
      allow read: if resource.data.status == "published";
      allow write: if request.auth != null
        && request.auth.token.email in ["chetanprajapat340@gmail.com"];
    }

    // Contact requests — anyone can create, only admins can read/update
    match /requests/{requestId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
        && request.auth.token.email in ["chetanprajapat340@gmail.com"];
    }

    // Purchases — only admins can read
    match /purchases/{purchaseId} {
      allow read: if request.auth != null
        && request.auth.token.email in ["chetanprajapat340@gmail.com"];
      allow write: if false; // only server-side
    }
  }
}
```

---

## Step 2 — Enable Firebase Storage

1. Left sidebar → **Build** → **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select region: **asia-south1** (same as Firestore)
5. Click **Done**

### Storage Security Rules (paste after creation):

Go to Storage → **Rules** tab and paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Template images — anyone can read
    match /templates/{slug}/preview-{filename} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email in ["chetanprajapat340@gmail.com"]
        && request.resource.size < 5 * 1024 * 1024; // 5MB max
    }

    // Template ZIPs — only authenticated users can read (via signed URLs)
    match /templates/{slug}/source-{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.token.email in ["chetanprajapat340@gmail.com"]
        && request.resource.size < 50 * 1024 * 1024; // 50MB max
    }
  }
}
```

---

## Step 3 — Verify setup

After enabling both services, your admin panel will be able to:
- Upload template preview images → Firebase Storage
- Upload template ZIP files → Firebase Storage
- Save template metadata → Firestore
- Read client contact requests → Firestore
- See purchase records → Firestore

---

## Firestore Collections Created Automatically

When you use the admin panel or contact form, these collections are created:

| Collection | Created when |
|------------|-------------|
| `templates` | Admin uploads a template |
| `requests` | Visitor submits contact form |
| `purchases` | Cashfree payment verified (future) |

---

## Free Tier Limits

Firebase Spark (free) plan:
- Firestore: 1GB storage, 50K reads/day, 20K writes/day
- Storage: 5GB storage, 1GB/day download

More than enough for a startup. Upgrade to Blaze only when needed.
