# RevAstra Security Architecture & Guidelines

## Overview
This document outlines the security stance, current preview limitations, and future production architecture for **RevAstra AI Studio**.

---

## 1. Current Preview Authentication Limitations

> [!WARNING]
> The current authentication endpoints (`/api/auth/register`, `/api/auth/login`) in `server.ts` are **development preview infrastructure only**.
> - Passwords are NOT hashed in the current JSON file backend.
> - Authentication tokens generated (`tok_*`) are non-cryptographic session strings.
> - `ProtectedRoute` component in React is a **client-side UX filter**, not server-side access authorization.

---

## 2. Production Security Blueprint (Phase v0.4)

In the upcoming **RevAstra v0.4** release, authentication will be migrated to **Supabase Auth**:
* Passwords managed with bcrypt via Supabase Auth service.
* Cryptographically signed JWT tokens passed via `Authorization: Bearer <token>` header.
* Server endpoints will verify JWT signatures against Supabase public keys.
* PostgreSQL Row Level Security (RLS) policies enforcing multi-tenant isolation.

---

## 3. Gemini API Key Handling

> [!IMPORTANT]
> - `GEMINI_API_KEY` is **STRICTLY SERVER-SIDE ONLY**.
> - The API key is NEVER rendered in responses, logs, client JavaScript bundles, or health check endpoints.
> - Server endpoints (`/api/chanakya/chat`, `/api/chanakya/audit`, `/api/chanakya/report`, `/api/chanakya/live`) execute Gemini API requests on the Express server side and return sanitized JSON responses to the browser client.

---

## 4. Multi-Tenancy Data Isolation Roadmap

Domain models (`CRMLead`, `Task`, `Quotation`, `LeadActivity`) have been prepared to accept:
* `businessId?: string` (tenant isolation partition key)
* `userId?: string` (record ownership)
* `role?: 'owner' | 'admin' | 'member' | 'viewer'`

When migrating to PostgreSQL in v0.4:
```sql
-- RLS Policy Example for Leads Table
CREATE POLICY "Leads tenant isolation" ON leads
    FOR ALL
    USING (business_id = auth.jwt() ->> 'business_id');
```
