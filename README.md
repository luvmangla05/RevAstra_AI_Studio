# RevAstra AI Studios
Complete CRM Automation for Businesses 

**RevAstra** is an AI-powered Revenue Operations (RevOps) platform built for small and medium businesses (SMEs), with a strong focus on the Indian SME/MSME market. It combines lead capture and CRM, sales task and follow-up tracking, customer conversation analysis, GST-compliant quotation generation, sales-process diagnostics, and an AI business assistant — **Chanakya** — into a single connected system.

The product is designed around a simple idea: most SMEs lose revenue not because of a lack of leads, but because of slow follow-ups, disorganized pipelines, and manual, inconsistent sales processes. RevAstra's tools are built to surface and fix those specific leaks.
<br>


## Deployed Link
https://www.revastra.pro/

---

## Project Status

This repository is an **active work-in-progress**, evolving from an initial prototype built in **Google AI Studio** into a full product being developed with **Cursor** and version-controlled on **GitHub**.

The codebase currently contains a mix of maturity levels:

- ✅ **Functional** — Marketing/public site, Gemini-powered Chanakya chat (text + optional Google Search/Maps grounding), the Growth System Builder / Business Diagnostic engine (deterministic scoring + AI-generated narrative), quotation generation with GST math, and a JSON-file-backed CRM (leads, tasks, quotations).
- 🧪 **Experimental** — Chanakya Live voice mode over WebSockets (Gemini Live API), conversation analysis tooling, and report generation.
- 🧱 **Mock / local-only / incomplete** — Authentication (no password hashing or real session verification yet), billing/plan upgrades, team management, integrations, and some admin dashboard screens. These currently simulate behavior on the client and/or persist to a local JSON file rather than a production database.

---

## Table of Contents

- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Data Persistence](#data-persistence)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Core Features

### 🧭 Chanakya — AI RevOps Assistant
A Gemini-powered assistant, branded and scoped as a "senior AI RevOps Consultant" for Indian businesses. It:
- Runs on Google's Gemini models (configurable text model, with an optional "thinking" mode using a higher-capability model).
- Is prompt-restricted to RevOps/sales/CRM/marketing topics via a strict system prompt, and redirects off-topic questions.
- Supports optional grounding via **Google Search** or **Google Maps** tools.
- Has an experimental **Live voice mode** (Gemini Live API over WebSockets) with configurable voice, session time limits, and a soft cost-tracking mechanism based on estimated audio duration.
- Falls back to a deterministic, keyword-based response tree when no Gemini API key is configured or the API call fails — so the product still "works" without live AI.
- Is exposed both as a floating widget on the public marketing site and as a full dedicated app screen for logged-in users.

### 📊 Growth System Builder / Business Diagnostic
A multi-step assessment tool that:
- Scores a business across dimensions such as creative readiness, marketing maturity, lead capture, sales process maturity, automation readiness, and "lead-leak risk," using **deterministic, rule-based scoring** (not AI-generated numbers).
- Recommends one of RevAstra's four paid tiers (Saarthi, Arjuna, Astra, Brahmastra) based on the computed scores and stated needs.
- Uses Gemini to generate a **written strategic narrative** on top of the computed scores (with a Zod-validated JSON response schema and a static text fallback if the AI call fails).
- Automatically creates a CRM lead record from every assessment submission.

### 🧾 Quotation Assistant
- Generates structured, GST-aware business quotations (CGST/SGST/IGST handling, interstate detection, subtotal/discount/tax/grand-total calculation).
- Auto-generates sequential quotation numbers (`REV-<year>-<number>`).
- Stores quotations against leads/clients for later reference.

### 📇 Free CRM
- Lead capture, storage, and status tracking (`new`, `qualified`, etc.), with lead source tagging (e.g. "Chanakya Chatbot," "Growth System Builder").
- Task management for follow-ups (WhatsApp follow-ups, site visits, calls) with due dates, priority, and status.
- Designed around common Indian SME sales workflows: WhatsApp-based lead handling, Meta Lead Ads, property portal enquiries, channel-partner networks, and manual Excel/Sheets-to-CRM migration.

### 🕵️ Sales & Lead Auditors
- Standalone diagnostic tools (`Lead Auditor`, `Sales Process Auditor`) that assess response speed, follow-up consistency, and pipeline hygiene to identify where revenue is "leaking" out of the sales process.

### 💬 Conversation Analyser
- A module intended to analyze customer conversations (e.g. WhatsApp threads) for sales insight — currently one of the less mature parts of the codebase.

### 🖥️ Full Product Shell
A complete authenticated app shell (`/app/*`) including onboarding, dashboard, CRM, auditors, quotation assistant, Chanakya, reports, tasks, notifications, integrations, team management, billing, and settings — along with a public marketing site (home, products, pricing, industries, how-it-works, about) and an admin dashboard.

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Router v7](https://reactrouter.com/) for client-side routing
- [Vite 6](https://vitejs.dev/) as the build tool / dev server
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`) for styling
- [Framer Motion (`motion`)](https://motion.dev/) for animation
- [Recharts](https://recharts.org/) for charts/dashboards
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) + [Three.js](https://threejs.org/) for 3D/visual elements in marketing sections
- [React Hook Form](https://react-hook-form.com/) for forms
- [Lucide React](https://lucide.dev/) for icons

**Backend**
- [Express 4](https://expressjs.com/) running on Node.js, written in TypeScript and executed directly via [`tsx`](https://github.com/privatenumber/tsx) in development
- [Vite's middleware mode](https://vitejs.dev/guide/ssr.html) is used to serve the frontend during development from the same Express process
- [`ws`](https://github.com/websockets/ws) for WebSocket support (Chanakya Live voice)
- [Zod](https://zod.dev/) for runtime validation of AI-generated JSON output
- [`dotenv`](https://github.com/motdotla/dotenv) for environment configuration

**AI**
- [`@google/genai`](https://www.npmjs.com/package/@google/genai) — Google's official Gemini SDK, used server-side only (API key never exposed to the client)
- Google Gemini text models for chat, diagnostics, and report generation
- Gemini Live API (audio) for the experimental voice assistant mode
- Optional Google Search / Google Maps grounding tools

**Build/Tooling**
- `esbuild` for bundling the production server
- `bun.lock` and `package-lock.json` are both present (the project can be installed with either npm or Bun)

---

## Architecture Overview

RevAstra runs as a **single Node.js process** that does double duty:

1. In **development**, Express creates a Vite dev server in **middleware mode** and mounts it, so the same process serves the API routes *and* the Vite-powered React frontend with hot module reloading.
2. In **production**, Vite pre-builds static frontend assets to `dist/`, the Express server itself is bundled with `esbuild` into `dist/server.cjs`, and Express serves the static build directly while falling back to `index.html` for client-side routing (SPA pattern).
