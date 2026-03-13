# Utility Account UI — Angular Frontend

## Overview
Admin portal for the Utility Account API. Built with Angular 19 and Angular Material, featuring a clean indigo design system with role-based UI and JWT session management.

**Author:** Oualid Gharach  
**Target role:** Engineering Lead / Tech Lead  
**Live demo:** https://utility.oualidg.dev  
**Status:** Phase 7 complete

---

## Tech Stack
- Angular 19 (standalone components)
- Angular Material 19 (indigo theme)
- Angular CDK (BreakpointObserver for responsive layout)
- Angular CLI 19
- TypeScript 5.x
- RxJS 7.x
- FormsModule (template-driven forms)
- Docker + Nginx (static file serving + API proxy)
- GitHub Actions (CI/CD, self-hosted runner)

---

## Project Structure
```
src/app/
├── layout/shell/          # App shell — responsive sidebar nav + router outlet
├── home/                  # Home page (nav cards + health status)
├── dashboard/             # Payment summary with month/year filter
├── customers/
│   ├── customer-list/     # Paginated customer list with search
│   ├── customer-detail/   # Customer detail + accounts table
│   ├── onboard-customer-dialog/
│   ├── edit-customer-dialog/
│   └── delete-customer-dialog/
├── account-payments/      # Paginated account payment history
├── providers/
│   ├── providers.ts       # Providers list
│   ├── provider-detail/   # Provider detail + paginated search + CSV download
│   ├── onboard-provider-dialog/
│   └── edit-provider-dialog/
├── users/
│   ├── users.ts           # User management (admin only)
│   ├── create-user-dialog/
│   └── change-password-dialog/
├── auth/
│   └── login/             # Login page (outside shell, no auth guard)
└── services/
    ├── auth.ts            # AuthService — login, logout, session restore, role checks
    ├── customer.ts        # CustomerService
    ├── provider.ts        # ProviderService
    ├── report.ts          # ReportService
    ├── health.ts          # HealthService
    └── info.ts            # InfoService
```

---

## Routing
```
/login
/home
/dashboard
/customers
/customers/:id
/customers/:id/accounts/:accountNumber
/providers
/providers/:id
/users
```

All routes except `/login` are protected by an auth guard.

---

## Services

### AuthService (`/api/auth`)
- `login(username, password)` — cookie-based login
- `logout()` — clears session and cookies
- `restoreSession()` — calls `/api/auth/me` on app init to restore session
- `currentUser()` — signal holding the logged-in user
- `isAdmin()` — role check for template guards

### CustomerService (`/api/v1/customers`)
- `getAll(page, size)` — paginated customer list
- `getById(id)` — get customer by ID
- `searchByMobile(mobile, page, size)` — paginated mobile search
- `searchBySurname(surname, page, size)` — paginated surname search
- `getAccounts(id)` — get customer accounts
- `onboard(request)` — onboard customer
- `update(id, request)` — update customer
- `delete(id)` — delete customer

### ProviderService (`/api/v1/providers`)
- `getAll()` — list all providers
- `getById(id)` — get provider by ID
- `create(request)` — onboard provider (returns API key once)
- `update(id, request)` — update provider name
- `deactivate(id)` — soft delete
- `reactivate(id)` — reactivate
- `regenerateKey(id)` — regenerate API key

### ReportService (`/api/v1/reports`)
- `getSummary(from?, to?)` — global summary + provider breakdown
- `getAccountPayments(accountNumber, from?, to?, page, size)` — paginated payment history
- `searchProviderPayments(providerCode, accountNumber?, receipt?, from?, to?, page, size)` — paginated provider search
- `getProviderSummary(providerCode, from?, to?)` — lightweight provider totals
- `getReconciliation(providerCode, from?, to?)` — full reconciliation (unbounded, CSV export)

---

## Design System
- **Primary colour:** `#1a237e` (indigo-900)
- **Sidebar:** dark indigo with white text, sticky footer with user info
- **Cards:** Material outlined cards
- **Badges:** Active (green), Inactive (red), Main (indigo), Secondary (grey)
- **Buttons:** Indigo background for primary actions
- **Tables:** Compact rows with custom paginator (consistent across all pages)
- **Filters:** Native `<select>` elements styled to match indigo theme
- **Paginator:** Custom row with items-per-page selector and prev/next — no `mat-paginator` dependency

---

## Key Patterns
- **Standalone components** — no NgModules
- **ChangeDetectorRef** — explicit change detection after subscribe callbacks
- **Route state** — account data passed via `router.navigate({ state: { account } })` and read via `history.state`
- **UTC dates** — `Date.UTC()` for month/year filter to avoid timezone offset issues
- **Pagination** — `pageIndex` / `pageSize` / `totalElements` state on every list component, consistent paginator row
- **CSRF** — token read from `XSRF-TOKEN` cookie and sent as `X-XSRF-TOKEN` header automatically by Angular's `HttpClient`
- **Session restore** — `APP_INITIALIZER` calls `/api/auth/me` on startup so page refresh doesn't log the user out
- **Role-based UI** — admin-only nav items and actions hidden via `authService.isAdmin()`

---

## Running Locally

### Prerequisites
- Node.js 22+
- Spring Boot backend running on `http://localhost:8080`

### Install and Run
```bash
npm install
ng serve
```

UI: `http://localhost:4200`

---

## Completed Pages
| Page | Features |
|------|----------|
| Login | JWT cookie auth, health polling, error handling |
| Home | Nav cards (role-filtered), live health status, app info footer |
| Dashboard | Month/year filter, summary cards, provider breakdown table |
| Customer List | Paginated, search by ID / Mobile / Surname, onboard dialog |
| Customer Detail | Info card, accounts table, edit/delete dialogs |
| Account Payments | Account info card, month/year filter, paginated payments table |
| Providers List | All providers, status badges, onboard dialog |
| Provider Detail | Info card, period filter, summary cards, paginated payment search, CSV export |
| Users | Paginated user list, create user, reset password (admin), change own password |

---

## Completed Phases
- **Phase 6A–6B** — Shell layout, customer pages, account payments
- **Phase 6C** — Dashboard, providers UI, dialogs, CORS fixes
- **Phase 6D** — Login page, JWT cookie auth, session restore, RBAC, CSRF, user management
- **Phase 6E** — Pagination on all list/search endpoints, responsive shell (landscape)
- **Phase 7** — Docker multi-stage build, Nginx config, GitHub Actions pipeline, live at https://utility.oualidg.dev

## Infrastructure
- **Build:** `ng build --configuration production` inside Docker multi-stage build
- **Serving:** Nginx serves the Angular dist as static files, proxies `/api/*` to the Spring Boot container
- **CI/CD:** GitHub Actions self-hosted runner builds, pushes to GHCR, and deploys via Docker Compose on every push to `main`
- **HTTPS:** Cloudflare Tunnel — no port forwarding or static IP required

