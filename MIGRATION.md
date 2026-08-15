# RevAstra Migration Roadmap: JSON File Storage → Supabase & PostgreSQL

## Purpose
This document specifies the step-by-step technical plan for migrating RevAstra AI Studio from development JSON storage (`data/db.json`) to production **Supabase Auth + PostgreSQL** in Phase v0.4.

---

## 1. Target PostgreSQL Schema Architecture

```sql
-- Core Tenants & Users
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'shunya',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    business_id UUID REFERENCES businesses(id),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company_name TEXT,
    city TEXT,
    state TEXT,
    industry TEXT,
    source TEXT DEFAULT 'Direct Lead',
    stage TEXT NOT NULL DEFAULT 'new',
    value NUMERIC(12, 2) DEFAULT 0,
    score INT DEFAULT 0,
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    last_contacted_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    due_time TIME,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    quotation_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    company_name TEXT,
    client_email TEXT,
    client_phone TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    taxable_amount NUMERIC(12, 2) NOT NULL,
    gst_rate NUMERIC(5, 2) DEFAULT 18,
    cgst_amount NUMERIC(12, 2) DEFAULT 0,
    sgst_amount NUMERIC(12, 2) DEFAULT 0,
    igst_amount NUMERIC(12, 2) DEFAULT 0,
    is_interstate BOOLEAN DEFAULT FALSE,
    grand_total NUMERIC(12, 2) NOT NULL,
    payment_terms TEXT,
    status TEXT DEFAULT 'draft',
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Activity Timeline
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Row Level Security (RLS) Rules

Every table will enforce multi-tenant separation based on `business_id`:

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for leads" ON leads
    FOR ALL USING (
        business_id IN (
            SELECT business_id FROM users WHERE id = auth.uid()
        )
    );
```

---

## 3. Data Migration Script Procedure (`data/db.json` → PostgreSQL)

When Phase v0.4 is deployed:
1. Parse `data/db.json`.
2. Seed default business tenant for existing local user.
3. Batch insert `leads`, mapping JSON string IDs to UUIDs.
4. Batch insert `tasks` and `quotations` preserving `lead_id` foreign keys.
