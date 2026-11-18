# Qless — Intelligent Queue Management Platform
> **Tagline:** *Never Wait Without Knowing.*

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-6.2-6D4AFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 1. Product Overview

**Qless** is a full-stack, multi-tenant SaaS queue management platform designed for high-density public facilities including **hospitals, banks, universities, government municipal offices, and customer service centers**.

It transforms waiting from a blind, stressful bottleneck into a transparent, predictable digital experience. Customers can join queues remotely, monitor their live position, understand predictive wait-time ranges, and arrive at service counters right on time.

---

## 2. Key Architecture & Features

### Four Connected Interfaces
1. **Customer Portal (`/customer`)**:
   - Join queues digitally across organizations, branches, and services.
   - Dynamic token screen: Live queue position, people ahead, estimated wait-time range with confidence indicator.
   - Intelligent Queue Recovery: Missed-turn re-entry into fair standing.
   - Delay requests (+10 mins buffer), "I Am Nearby" lobby notifications, and QR token generation.
2. **Staff Counter Desk (`/staff`)**:
   - High-efficiency counter controls: *Call Next, Start Serving, Mark Completed, Mark Missed, Skip, Pause/Resume Counter*.
   - Staff availability status toggling (*Available, Busy, On Break, Offline*).
   - Receptionist-assisted registration for walk-in visitors without smartphone accounts.
3. **Organisation Administrator Console (`/admin`)**:
   - Live database-driven metrics (Total today, waiting count, active desks, average wait duration, turn-miss rate).
   - Queue and capacity operations.
   - Visual analytics powered by **Recharts**: Hourly arrival density, token status distributions, wait-time progression curves.
   - **Intelligent Recommendations Engine**: Automatic detection of counter bottlenecks, imbalanced break times, and duration drift.
4. **Public Queue TV Display (`/display`)**:
   - Large-screen 55"–75" TV display for waiting lounges.
   - *Now Serving* active counters with audio chime announcements.
   - *Next In Line* upcoming tokens with strictly zero PII exposure.
5. **Self-Service Physical Kiosk (`/kiosk`)**:
   - High-contrast, large-button touch terminal for walk-in ticket printing.

---

## 3. Brand Identity & Accessibility

- **Primary Brand Purple:** `#6D4AFF` (Balanced across branding, highlights, and active indicators).
- **Color-Blind Accessible Queue Statuses:**
  - 🔵 **Waiting:** Blue (`#3B82F6`)
  - 🟠 **Turn Approaching:** Orange (`#F97316`)
  - 🟢 **Currently Serving:** Green (`#10B981`)
  - 🔴 **Missed Turn:** Red (`#EF4444`)
  - ⚪ **Completed:** Grey (`#6B7280`)
- **Theme Support:** Fully functional **Light Mode** and **Dark Mode** with persistent `localStorage` preference.

---

## 4. AI Service Assistant (Gemini API)

- Built with `@google/generative-ai`.
- **Grounded Directory Assistance:** Answers procedural inquiries based strictly on organization-configured services and requirements without hallucinations.
- **Document Checklist Generator:** Creates actionable checklists for required identity proofs, referral notes, and paperwork.
- **Multilingual Support:** Supports **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)**.
- **Voice Integration:** Integrated Web Speech API for voice STT queries and spoken TTS responses with text fallback.

---

## 5. Statistical Waiting-Time Prediction Engine

- Implements an **M/M/c Queueing Theory approximation model**:
  $$\text{Expected Wait} = \frac{\text{People Ahead} + 1}{c \cdot \mu_{\text{eff}}}$$
- Factors in number of active counters ($c$), historical completed service durations ($\mu$), and real-time staff availability.
- Outputs realistic variance intervals (e.g. `12–18 minutes`) with **High / Medium / Low Confidence** indicators based on sample size.

---

## 6. Multi-Tenant Security & Database

- **Supabase PostgreSQL Schema:** Located at `supabase/migrations/20250101_init.sql`.
- **Row Level Security (RLS):** Strict multi-tenant isolation ensures one organization can never read another organization's private queues or customers.
- **Atomic Concurrency Control:** Pl/pgSQL sequence locking prevents duplicate tokens or race conditions.
- **Zero-Dependency Local Fallback (Demo Engine):** Runs immediately out-of-the-box without requiring initial Supabase cloud provisioning.

---

## 7. Quick Start & Setup

### Prerequisites
- Node.js (v18+ recommended, v24 supported)
- npm (v9+)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/qless.git
cd qless

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application will be live at: **`http://localhost:5173/`**

### Production Build
```bash
npm run build
npm run preview
```

---

## 8. Guided 12-Step Competition Evaluation Tour

Visit **`/demo`** to run the automated 12-step guided interactive walkthrough:
1. Customer joins queue.
2. Atomic token sequence is assigned.
3. Queue position and people ahead update.
4. Statistical wait-time prediction is generated.
5. Staff calls next customer (with audible chime).
6. Customer portal transitions to "Serving".
7. Staff completes service & logs duration.
8. Remaining queue wait times recalculate.
9. Missed turn simulation occurs.
10. Transparent Queue Recovery reinstates token.
11. Admin console metrics update with live records.
12. Public display broadcasts new counter state.

---

## 9. Deployment Preparation

- **Frontend:** Ready for 1-click deployment on **Vercel** or **Netlify** (`dist/` directory, `npm run build`).
- **Database:** Copy `supabase/migrations/20250101_init.sql` into the Supabase SQL Editor.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in deployment environment variables.

---

## 10. License
Developed under the MIT License.
