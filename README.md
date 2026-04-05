# Wedding Photo Dump — James & Anna

A beautiful, mobile-friendly web app for wedding guests to upload photos directly to Google Drive. Single tap, fully anonymous.

## Setup

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Google Drive API** (APIs & Services > Enable APIs)
4. Create a **Service Account** (IAM & Admin > Service Accounts)
5. Create a JSON key for the service account and download it

### 2. Google Drive Setup

1. Create a folder in Google Drive (e.g., "James & Anna Wedding Photos")
2. Right-click the folder > Share > share it with the service account email (e.g., `your-sa@project.iam.gserviceaccount.com`) with **Editor** access
3. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/THIS_IS_THE_FOLDER_ID`

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
- `GOOGLE_SERVICE_ACCOUNT_KEY` — paste the entire JSON key content (single line)
- `GOOGLE_DRIVE_FOLDER_ID` — the folder ID from step 2

### 4. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — main upload page
Open [http://localhost:3000/qr](http://localhost:3000/qr) — printable QR code for table cards

## Deploy to Vercel

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add the two environment variables in Vercel's project settings
4. Deploy

Once deployed, update the QR code page URL to your production domain and print table cards.
