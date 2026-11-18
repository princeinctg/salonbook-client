# SalonBook Client

Frontend application for SalonBook – Luxury Salon Appointment Booking Platform. Built strictly according to Assignment 9 – Category 002 requirements with Next.js App Router, TypeScript, and Framer Motion.

---

## Important Features
- **Brand Identity**: Features the custom transparent Rose Gold and Ivory SalonBook logo in Navbar, Footer, Auth pages, and Dashboards.
- **Trimly-Inspired Aesthetics**: Warm Ivory (`#F8F1E8`), Rose Gold (`#C98573`), and Deep Charcoal (`#201C1B`) color palette with responsive card styling and empty states.
- **Dynamic Homepage**: Features hero with zoom reveal, 6+ active MongoDB services, 7 designated salon categories, and a "Why Choose Us" trust section.
- **Public Service Browsing**: Client-side name search, category tabs, and dual price sorting (low-to-high, high-to-low).
- **Service Details & Slot Reservation**: Interactive booking modal with date selection and 9 predefined time slots (`10:00 AM` to `06:00 PM`).
- **Role-Based Protected Dashboards**:
  - **Customer Dashboard**: Overview statistics, My Appointments with cancellation and Pay Now triggers, and Profile editor.
  - **Admin Dashboard**: Live business metrics, Service management (ImgBB direct image upload, status toggle, delete), Appointment confirmations/cancellations, User access control (block/unblock), and Stripe Transaction auditing.
- **Payment Verification**: Verified Stripe Checkout flow with success & cancel landing pages.

---

## Technology Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide React
- **Animations**: Framer Motion (Hero reveal, card hover, scroll fade-up, and parallax)
- **State & Data**: TanStack Query & React Context API
- **Feedback**: Sonner Toast notifications

---

## Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sample_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_client_api_key
```

---

## Local Development Instructions
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Build for Production**:
   ```bash
   npm run build
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## Repositories & Deployment Links
- **Client Repository**: https://github.com/princeinctg/salonbook-client
- **Server Repository**: https://github.com/princeinctg/salonbook-server
- **Live Deployment**: Vercel
