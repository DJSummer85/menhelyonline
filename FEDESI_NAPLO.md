# MenhelyOnline - Fejlesztesi Naplo

## Utolso frissites: 2026-08-27

## Amit befejeztunk

### 1. Bejelentkezesi hiba diagnostikazasa
- A backend API (Express + SQLite) mukodik helyben
- A hiba: a frontend Vercel-en fut, de a backend nincs elerheto

### 2. Email visszaigazolo rendszer (backend - helyi)
- `/api/auth/verify` - GET végpont a link aktiválásához
- `/api/auth/resend-verification` - POST új email küldése
- Login endpoint ellenőrzi a `verified` státuszt
- Regisztráció email-t küld, NEM ad tokent (nem lehet belépni)
- Backend: `backend/server.js` (Express + SQLite + Nodemailer)

### 3. Frontend oldalak
- `/verify` oldal: sikeres/hibás/lejárt/újraküldés állapotokkal
- Login oldal: "Ellenőrizd az emailed" üzenet + újraküldés gomb

### 4. Vercel kompatibilitas
- Next.js API route-ok letrehozva:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/verify`
  - `/api/auth/resend-verification`
  - `/api/auth/me`
- `lib/db.ts`: Neon PostgreSQL driver (serverless)
- `lib/auth-helpers.ts`: JWT (jose konyvtarral)
- `vercel.json`: `npm install --legacy-peer-deps` (react-leaflet kompatibilitas)

## Amit meg kell csinalni

### 1. NEON ADATBAZIS BEALLITASA (KOVEKEZO LEPES!)
1. neon.tech - regisztralni (ingyenes)
2. Uj projekt letrehozasa
3. Connection string masolasa
4. Vercel Dashboard -> Settings -> Environment Variables -> `DATABASE_URL` hozzaadasa
5. Redeploy inditasa

### 2. Email kuldés (opcionalis)
- Gmail SMTP beallitasa a `.env`-ben:
  ```
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=ciked@gmail.com
  EMAIL_PASS=alkalmazasjelszo
  FRONTEND_URL=https://menhelyonline.vercel.app
  ```
- vagy Nodemailer konfiguralasa

### 3. Tesztelés a Vercel-en
- Regisztracio
- Email visszaigazolás
- Bejelentkezes

## Hasznalt technologiak
- **Frontend**: Next.js 16, React 19, Tailwind CSS, Lucide icons
- **Backend (helyi)**: Express 5, SQLite (better-sqlite3), Nodemailer
- **Backend (Vercel)**: Next.js API Routes, Neon PostgreSQL, jose (JWT)
- **Deploy**: Vercel (auto-deploy GitHub-rol)

## Fontos fajlok
| Fajl | Cel |
|------|-----|
| `lib/db.ts` | Neon PostgreSQL adatbazis muveletek |
| `lib/auth-helpers.ts` | JWT sign/verify |
| `app/api/auth/*/route.ts` | API endpoint-ok |
| `app/verify/page.tsx` | Email visszaigazolo oldal |
| `app/login/page.tsx` | Bejelentkezes (email visszaigazolassal) |
| `lib/api.ts` | Frontend API hivasok |
| `backend/server.js` | Helyi backend (Express) |
| `vercel.json` | Vercel build konfiguracio |

## Git allapot
- Utolso commit: `57a4c7d` - Neon PostgreSQL adatbazis
- Branch: `master`
- Remote: `https://github.com/DJSummer85/menhelyonline.git`
