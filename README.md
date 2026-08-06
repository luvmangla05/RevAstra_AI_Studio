# RevAstra AI Studio

**AI-Powered Revenue Operations, CRM and Business Automation Platform for Indian SMEs**

RevAstra AI Studio is an AI-powered Revenue Operations platform designed for small and medium businesses, particularly businesses operating in India.

The platform combines lead management, follow-up tracking, business diagnostics, quotation generation, customer-conversation analysis and AI-powered sales assistance into one connected system.

RevAstra is built around a simple business reality:

> Most businesses do not lose revenue because they lack leads. They lose revenue because leads are not recorded properly, follow-ups are delayed and sales processes are inconsistent.

RevAstra helps identify and reduce these revenue leaks.

---

## Live Application

**Production Preview:**

https://www.revastra.pro/

> The deployed application is currently an active product preview. Some modules are fully functional, while others remain in demo, preview or development mode.

---

## Current Project Status

RevAstra is an active work-in-progress that originally started as a Google AI Studio prototype and is now being developed using Cursor, Antigravity, GitHub and a TypeScript-based application stack.

The project currently contains a mix of production-like, functional and preview-only modules.

### Functional

* Public marketing website
* RevAstra user application shell
* Lead creation and persistent CRM storage
* CRM lead-stage updates
* Lead deletion
* Task creation and persistent task storage
* Task completion and deletion
* Basic task-overdue indicators
* GST-aware quotation generation
* Quotation creation, editing and deletion APIs
* Growth System Builder
* Business diagnostic scoring
* Assessment-generated CRM leads
* Chanakya AI text assistant
* Gemini-powered business analysis
* Optional Google Search and Google Maps grounding
* Profile and billing-selection persistence
* JSON-backed local data storage

### Experimental

* Chanakya Live voice mode
* Gemini Live API WebSocket communication
* Customer-conversation analysis
* AI-generated reports
* Admin dashboard
* Lead scoring
* Usage and plan limits
* Automated package recommendations

### Preview or Incomplete

* Secure production authentication
* Password hashing and verification
* Administrator role-based access control
* Multi-company data isolation
* Subscription payments
* Razorpay or Stripe integration
* Team invitations and permissions
* WhatsApp Business API integrations
* Gmail and Outlook integrations
* Automated notification delivery
* Real Excel or CSV lead importing
* Production database infrastructure

---

## Recent Development Update

### Phase 2 — CRM Data Integrity Improvements

The latest development phase focused on improving data consistency, CRM persistence and dashboard reliability.

#### Unified CRM Data Fields

CRM-related screens now use a more consistent lead structure, including:

```ts
companyName
stage
value
score
notes
assignedTo
lastContactedAt
nextFollowUpAt
```

The application continues to support some legacy lead fields for backward compatibility with older stored data.

#### CRM API Improvements

The backend now supports:

```text
GET    /api/db/leads
POST   /api/db/leads
PUT    /api/db/leads/:id
DELETE /api/db/leads/:id
```

Lead records created through assessments, consultations, quotes and audits are normalized before being stored.

#### Task API Improvements

Task records now support persistent creation, updating and deletion:

```text
GET    /api/crm/tasks
POST   /api/crm/tasks
PUT    /api/crm/tasks/:id
DELETE /api/crm/tasks/:id
```

The Tasks interface includes overdue indicators for pending tasks whose due date has passed.

> Time-aware overdue calculations using both due date and due time remain part of the next improvement phase.

#### Quotation API Improvements

Quotation records now support creation, editing and deletion:

```text
GET    /api/crm/quotations
POST   /api/crm/quotations
PUT    /api/crm/quotations/:id
DELETE /api/crm/quotations/:id
```

#### Dashboard Improvements

The main application dashboard now reads CRM fields such as:

```text
companyName
stage
value
score
notes
```

Artificial fallback values such as fake deal values, companies and lead notes have been removed from the active dashboard mapping.

Pipeline metrics are calculated from stored CRM data.

#### Admin Dashboard Improvements

The admin lead table now uses the newer CRM lead fields:

```text
companyName
stage
```

The admin route is currently placed behind the standard authenticated route layer.

> This is not production-grade administrator security. Proper role-based access control is still required.

#### Profile and Billing Persistence

User onboarding/profile selections and selected billing plans are now written to the local JSON database.

Payment processing is not yet connected.

---

## Core Features

### Chanakya — AI RevOps Assistant

Chanakya is RevAstra’s AI-powered business and Revenue Operations assistant.

It is designed to help users with:

* Lead-management strategy
* Follow-up planning
* WhatsApp sales scripts
* Sales-process diagnostics
* Objection handling
* Lead-response improvement
* CRM workflows
* Quotation structures
* Marketing and growth systems

Chanakya uses Google Gemini models through the server.

The Gemini API key remains server-side and is not exposed directly to the browser.

When Gemini is unavailable, some modules use deterministic fallback responses.

---

### Free CRM

The CRM currently supports:

* Lead creation
* Lead storage
* Lead searching
* Stage filtering
* Pipeline-stage updates
* Estimated deal values
* Lead-source tagging
* WhatsApp contact links
* Lead deletion
* Follow-up dates
* Lead ownership fields
* Notes
* Dashboard pipeline reporting

Current pipeline stages include:

```text
new
contacted
site_visit_scheduled
site_visit_done
quotation_sent
negotiation
closed_won
closed_lost
```

Planned CRM improvements include:

* Lead detail drawer
* Complete lead editing
* Activity timeline
* Notes history
* Duplicate detection
* Lead-to-task relationships
* Lead-to-quotation relationships
* Real CSV import
* CSV export
* Pagination
* Business-level data isolation

---

### Tasks and Follow-Up Management

The Tasks module supports:

* WhatsApp follow-ups
* Calls
* Site visits
* Meetings
* Quotation reminders
* Due dates
* Due times
* Priorities
* Completion status
* Task deletion
* Overdue indicators

Planned improvements include:

* Direct task creation from a lead
* `leadId` relationship
* Time-aware overdue calculations
* Reminder notifications
* Calendar synchronization
* Automated WhatsApp and email follow-ups

---

### Growth System Builder

The Growth System Builder evaluates a business across areas such as:

* Creative readiness
* Marketing maturity
* Lead capture
* Sales-process maturity
* Follow-up consistency
* Automation readiness
* Operational complexity
* Lead-leak risk

The diagnostic scores are calculated through deterministic rules.

Gemini may then generate a written strategic explanation based on those calculated scores.

The AI does not generate the diagnostic score itself.

Assessment submissions can automatically create CRM leads.

---

### Quotation Assistant

The Quotation Assistant supports Indian business quotation requirements, including:

* Item descriptions
* Quantity and unit pricing
* Discounts
* Subtotal calculations
* Taxable value
* GST calculations
* CGST and SGST
* IGST
* Interstate detection
* Payment terms
* Quotation validity
* Quotation status
* Grand total

Quotation numbers follow a structure similar to:

```text
REV-2026-1234
```

Sequential and collision-safe quotation numbering remains a future improvement.

---

### Lead and Sales Auditors

RevAstra includes diagnostic tools for:

* Lead-response speed
* Follow-up consistency
* Pipeline hygiene
* Sales bottlenecks
* Lead leakage
* Sales-script effectiveness
* Closing velocity
* Recommended next actions

Some audit modules currently use deterministic business rules, while other sections use Gemini-generated explanations.

---

### Conversation Analyser

The Conversation Analyser is intended to evaluate customer conversations and identify:

* Buying intent
* Customer sentiment
* Key objections
* Missing information
* Recommended responses
* Suggested next actions

This module is currently experimental.

---

### Chanakya Live Voice

Chanakya Live Voice uses:

* WebSockets
* Gemini Live API
* Browser microphone access
* Audio playback
* Session limits
* Basic estimated cost controls
* Text-mode fallback

This feature remains experimental and may depend on available Gemini models, quotas and browser microphone permissions.

---

## Technology Stack

### Frontend

* React 19
* TypeScript
* React Router
* Vite
* Tailwind CSS
* Motion / Framer Motion
* Recharts
* React Hook Form
* Lucide React
* React Three Fiber
* Drei
* Three.js

### Backend

* Node.js
* Express
* TypeScript
* `tsx`
* WebSockets through `ws`
* Zod
* dotenv

### AI

* Google Gemini
* `@google/genai`
* Gemini text models
* Gemini Live API
* Optional Google Search grounding
* Optional Google Maps grounding

### Data Storage

The application currently stores data inside:

```text
data/db.json
```

This is suitable only for development, demonstrations and controlled local testing.

A production database migration is planned.

---

## Architecture Overview

RevAstra currently operates as a single Node.js application.

### Development

In development mode:

1. Express starts the server.
2. Vite runs in middleware mode.
3. Express serves API routes.
4. Vite serves the React frontend with hot module replacement.
5. WebSocket routes support Chanakya Live Voice.

### Production

In production mode:

1. Vite builds the frontend.
2. esbuild bundles the Express server.
3. Static frontend files are served from the production build.
4. Express handles API requests.
5. Client-side routes fall back to `index.html`.

---

## Project Structure

```text
RevAstra_AI_Studio/
│
├── data/
│   ├── db.example.json
│   └── db.json
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   │   ├── app/
│   │   ├── auth/
│   │   └── public/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

The current `server.ts` contains authentication, CRM, tasks, quotations, AI, reports and WebSocket handling.

Splitting the server into routes, services, middleware and repositories is planned for a future refactoring phase.

---

## Getting Started

### Requirements

Install:

* Node.js 20 or newer
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/luvmangla05/RevAstra_AI_Studio.git
cd RevAstra_AI_Studio
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file using `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY="your_gemini_api_key"
```

### Start Development Server

```bash
npm run dev
```

The local application should be available at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

### Start Production Build

```bash
npm start
```

---

## Environment Variables

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"

GEMINI_TEXT_MODEL="gemini-3.5-flash"
GEMINI_LIVE_MODEL="gemini-2.0-flash-exp"

MAX_ANONYMOUS_MESSAGES=15
MAX_VOICE_MINUTES=5
MAX_RETRIES=3

VITE_AI_MOCK_MODE=false
```

Never commit a real `.env` file or API credentials.

---

## Available Scripts

```bash
npm run dev
```

Starts the Express and Vite development server.

```bash
npm run build
```

Builds the React frontend and bundles the Express backend.

```bash
npm start
```

Starts the production server bundle.

```bash
npm run lint
```

Runs the current TypeScript compile check using:

```bash
tsc --noEmit
```

```bash
npm run clean
```

Removes the production build and local JSON database.

> Warning: The clean command deletes `data/db.json`. Back up required local data before running it.

---

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

Current authentication remains suitable only for prototype and preview usage.

Passwords are not yet handled through production-grade authentication infrastructure.

---

### User Profile and Billing Selection

```text
POST /api/user/profile
POST /api/user/billing
```

These endpoints currently persist profile and selected-plan information.

They do not process payments.

---

### Leads

```text
GET    /api/db/leads
POST   /api/db/leads
PUT    /api/db/leads/:id
DELETE /api/db/leads/:id
```

---

### Tasks

```text
GET    /api/crm/tasks
POST   /api/crm/tasks
PUT    /api/crm/tasks/:id
DELETE /api/crm/tasks/:id
```

---

### Quotations

```text
GET    /api/crm/quotations
POST   /api/crm/quotations
PUT    /api/crm/quotations/:id
DELETE /api/crm/quotations/:id
```

---

### Assessments

```text
GET  /api/db/assessments
GET  /api/db/assessments/:id
POST /api/db/assessments
```

---

### Chanakya and Reports

The application contains endpoints for:

* Chanakya chat
* Business audits
* Strategic reports
* Consultation records
* Voice settings
* Gemini-powered explanations
* Live voice WebSocket sessions

These APIs remain under active development.

---

## Data Persistence

Current application data is stored in:

```text
data/db.json
```

The file may contain:

* Users
* Leads
* Tasks
* Quotations
* Assessments
* Conversations
* Projects
* Quotes
* Voice settings

The database file is excluded from Git tracking.

A sample development database is stored in:

```text
data/db.example.json
```

### Limitations of JSON Storage

The current storage layer:

* Is not designed for multiple simultaneous users
* Does not provide transaction safety
* Does not provide row-level security
* Can experience conflicting writes
* Does not isolate customer businesses
* May not survive some hosting redeployments
* Is unsuitable for sensitive production information

---

## Known Limitations

### Authentication

Current authentication is not production-ready.

Known limitations include:

* No secure password hashing
* No proper password verification
* No verified token sessions
* No refresh-token system
* No real Google OAuth
* No production email verification
* No secure password-reset flow
* No administrator role enforcement

### Multi-Tenancy

Leads, tasks and other records are not yet isolated by company or business account.

### Admin Dashboard

The admin dashboard is an internal preview and does not currently have production-grade administrator authorization.

### Billing

Plan selection may be persisted, but payments are not processed.

### CRM Import

The interface may display an import option, but real CSV and Excel importing is not yet complete.

### Overdue Tasks

Current overdue handling primarily checks task dates. Full due-date-and-time evaluation is planned.

### Database

Local JSON storage must be replaced before real production use.

### AI Output

AI-generated recommendations may be inaccurate and should be treated as business-support suggestions rather than guaranteed results.

---

## Roadmap

### Phase 1 — Core Stability

* Persistent lead creation
* Persistent stage updates
* Persistent task creation
* Persistent task completion
* Removal of major fake CRM defaults
* Demo-state labelling

### Phase 2 — CRM Data Integrity

* Consistent `companyName` and `stage` usage
* Improved CRM normalization
* Dashboard data corrections
* Lead deletion
* Task deletion
* Quotation update and deletion APIs
* Profile persistence
* Billing-selection persistence
* Initial overdue indicators

### Phase 3 — Complete CRM Workflows

Planned:

* Lead detail drawer
* Lead editing
* Notes history
* Lead ownership
* Lead-to-task relationships
* Lead-to-quotation relationships
* Correct date-and-time overdue calculations
* Real CSV import
* CSV export
* Duplicate detection
* API validation
* Automated tests

### Phase 4 — Production Authentication and Database

Planned:

* Supabase authentication
* PostgreSQL database
* Secure sessions
* Business accounts
* Multi-tenant data isolation
* Row Level Security
* Team memberships
* Administrator roles
* Audit logging

### Phase 5 — Integrations and Automation

Planned:

* WhatsApp Business API
* Gmail and Outlook
* Meta Lead Ads
* Google Sheets
* Calendar integration
* Automated reminders
* Webhooks
* n8n workflows
* CRM synchronization

### Phase 6 — Billing and Commercial Launch

Planned:

* Razorpay or Stripe
* Subscription activation
* Plan enforcement
* Usage metering
* Invoices
* Payment webhooks
* Customer onboarding
* Production monitoring

---

## Development Guidelines

When contributing:

1. Create a separate branch.
2. Do not commit directly to `main`.
3. Keep changes focused.
4. Run the TypeScript check.
5. Run the production build.
6. Test affected screens in the browser.
7. Do not commit API keys.
8. Do not fabricate successful API responses.
9. Clearly label incomplete features as preview.
10. Document known limitations honestly.

Example branch:

```bash
git checkout -b fix/phase-2-crm-integrity
```

Example checks:

```bash
npm run lint
npm run build
```

---

## Recommended Commit

For the current Phase 2 changes:

```bash
git add README.md
git commit -m "docs: update README for phase 2 CRM integrity"
git push -u origin HEAD
```

---

## Product Vision

RevAstra aims to become a connected AI-powered Revenue Operations platform for Indian SMEs.

The long-term system will connect:

* Lead generation
* Lead capture
* CRM
* WhatsApp
* Email
* Calls
* Follow-ups
* Quotations
* Sales reporting
* Team accountability
* Business diagnostics
* AI-powered recommendations

The objective is not to become another generic digital-marketing tool.

RevAstra is being built as a practical revenue operating system that helps businesses respond faster, follow up consistently and build more disciplined sales processes.

---

## License

This project currently includes files released under the Apache 2.0 license.

Review all third-party library, model and generated-code licence requirements before commercial distribution.
