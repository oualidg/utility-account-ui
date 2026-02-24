# Utility Account UI — Angular Frontend

## Overview
Admin UI for the Utility Account API. Built with Angular 21 and Angular Material, featuring a clean indigo design system. Connects to the Spring Boot backend at `http://localhost:8080`.

**Author:** Oualid Gharach  
**Target role:** Engineering Lead / Tech Lead  
**Status:** Phase 6C complete, Phase 6D (JWT auth) next

---

## Tech Stack
- Angular 21.1.5 (standalone components)
- Angular Material 21.1.5 (indigo theme)
- Angular CLI 21.1.4
- TypeScript 5.9.3
- RxJS 7.8.2
- Node.js 24.13.1
- npm 11.10.1
- FormsModule (template-driven forms)

---

## Project Structure
```
src/app/
├── layout/shell/          # App shell — sidebar nav + router outlet
├── home/                  # Home page (nav cards)
├── dashboard/             # Dashboard with month/year filter
├── customers/
│   ├── customer-list/     # Customer list with ID/Mobile search
│   ├── customer-detail/   # Customer detail + accounts table
│   ├── onboard-customer-dialog/
│   ├── edit-customer-dialog/
│   └── delete-customer-dialog/
├── account-payments/      # Account payment history with month filter
├── providers/
│   ├── providers.ts       # Providers list
│   ├── provider-detail/   # Provider detail + reconciliation + CSV download
│   ├── onboard-provider-dialog/
│   └── edit-provider-dialog/
└── services/
    ├── customer.ts        # CustomerService
    ├── provider.ts        # ProviderService
    └── report.ts          # ReportService
```

---

## Routing
```
/home
/dashboard
/customers
/customers/:id
/customers/:id/accounts/:accountNumber
/providers
/providers/:id
```

---

## Services

### CustomerService (`/api/v1/customers`)
- `getAll()` — list all customers
- `getById(id)` — get customer by ID
- `searchByMobile(mobile)` — search by mobile number
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
- `getPaymentsByAccount(accountNumber, from?, to?)` — payments for account
- `getReconciliation(providerCode, from?, to?)` — provider reconciliation report

---

## Design System
- **Primary color:** `#1a237e` (indigo-900)
- **Sidebar:** dark indigo (`#1a237e`) with white text
- **Cards:** Material outlined cards with subtle shadow
- **Badges:** Active (green), Inactive (red), Main (indigo), Secondary (grey)
- **Buttons:** Indigo background (`#1a237e`) for primary actions
- **Tables:** Compact rows (44px height)
- **Filters:** Native `<select>` elements styled to match design
- **Global styles:** `src/styles.css` — compact card padding, table rows, tooltips

---

## Key Patterns
- **Standalone components** — no NgModules
- **ChangeDetectorRef** — explicit change detection after subscribe callbacks
- **Route state** — account data passed via `router.navigate({ state: { account } })` and read via `history.state`
- **UTC dates** — `Date.UTC()` used for month/year filter to avoid timezone offset issues
- **Field-level validation errors** — read from `err.error?.validationErrors` map
- **Error label pattern** — validation errors replace field labels in red

---

## Month/Year Filter Pattern
Used on Dashboard, Account Payments, and Provider Detail:
```typescript
const from = new Date(Date.UTC(this.selectedYear, this.selectedMonth - 1, 1));
const to = new Date(Date.UTC(this.selectedYear, this.selectedMonth, 0, 23, 59, 59));
```
Defaults to current month on page load.

---

## Environment
Angular CLI automatically uses the correct environment file:
- `ng serve` → `src/environments/environment.ts` (dev, points to `http://localhost:8080`)
- `ng build --configuration production` → `src/environments/environment.prod.ts`

---

## Running the Project

### Prerequisites
- Node.js 24.x
- Angular CLI 21.x — install globally if not present:
```bash
npm install -g @angular/cli
```
- Spring Boot backend running on `http://localhost:8080`

### Install and Run
```bash
npm install
ng serve
```

UI runs on `http://localhost:4200`

---

## Completed Pages
| Page | Features |
|------|----------|
| Dashboard | Month/year filter, summary cards, provider breakdown table |
| Customer List | Search by ID (navigate) or Mobile (filter table), onboard dialog |
| Customer Detail | Info card, accounts table, edit/delete dialogs |
| Account Payments | Account info, month/year filter, payments table |
| Providers List | All providers, status badges, onboard dialog |
| Provider Detail | Info card, edit dialog, deactivate/reactivate, regenerate key, reconciliation report, CSV download |

---

## Upcoming Phases

### Phase 6D — JWT Auth (3-4 days)
- Login page (outside shell layout, no auth guard)
- `AuthService` — login, logout, token storage, refresh
- HTTP interceptor — attach `Authorization: Bearer <token>` to all requests
- Auth guard — protect all shell routes, redirect to `/login` on 401
- Role-based UI — hide admin actions from OPERATOR role
- Handle 401 responses — auto-refresh token or redirect to login

### Phase 6E — Pagination + Sorting (2-3 days)
- Spring Data Pageable + Page<T> responses
- Customer list, payment list, provider list pagination
- Sorting on all tables
- Angular Material paginator component
- Payment filtering by date range, provider, account

