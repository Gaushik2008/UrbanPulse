# UrbanPulse — Multi-fleet SIH 2026 upgrade

Upgrade the existing app (no rebuild, no removed pages) to the "Adaptive Multi-Fleet Road Intelligence" positioning from the brief.

## Phase 1 — Positioning and data
- Add 5 municipal vehicles (MC-01..05) next to Bus 01..05, with fleet type, telemetry age, segments observed, coverage contribution.
- Replace bus-only wording across landing, overview, fleet, coverage and detections with "public buses + municipal vehicles".
- Landing hero: "ADAPTIVE MULTI-FLEET ROAD INTELLIGENCE", new supporting text, Buses + Municipal Fleet → Sensing Network → AI → Action visual, "No observation ≠ no problem" card.
- Global "SIMULATION MODE" badge with tooltip in the header.

## Phase 2 — Fleet Intelligence and workflow
- Rename Bus Fleet to Fleet Intelligence: two groups, summary cards (30 / 18 / 12 / 1,842), coverage comparison bars (72% / 84% / 93%) and the 21-segment insight.
- 10-stage workflow (Observe → Verify) with icons and descriptions on landing and overview.

## Phase 3 — Detection intelligence (strongest page)
- Detection detail: AI evidence (image + box, classification, confidence, 6/6 temporal, 2/2 cross-fleet), priority score 92/100 with weighted breakdown bars, location chain GPS → Road → Ward → Zone → Authority → Department.
- Road contract and warranty card with automatic routing decision (active: city + contractor; expired: city only, no contractor notice) — reuses the existing warranty engine.
- Work order stepper (Detected → Verified) with the 7 action buttons wired to simulated state and toasts.

## Phase 4 — Verification, coverage, inspection, analytics, dashboard
- Verification: closed loop for R62-014 (WO-1842, Bus 04 + MC-02, 98%, 2/2 passes) with before/after.
- Coverage: 1,842 / 1,334 / 508 km, vehicles, observations, gap ranking, Generate Inspection Route.
- Inspection: "Why this route?" factor panel.
- Analytics: 6 decision KPIs, written insights, fleet contribution chart and bus-only / municipal-only / joint segments.
- Dashboard: new 6 KPIs plus fleet activity, critical detections, gaps, verification, recent activity.
- City map: extended legend (under inspection, verified) and fleet / issue / severity / status filters.

## Phase 5 — Run UrbanPulse Demo
- One-click guided demo: animated 14-step sequence ending in "Road repair verified", launchable from landing and dashboard.

## Technical notes
- Extend `demo-data.ts` and `warranty.ts`; no backend. All numbers stay labeled simulated / illustrative.
- New pieces: FleetIntelligence, PriorityScore, LocationChain, WarrantyRouting, WorkOrderStepper, DemoRunner components.
- Google Maps still only renders on the hosted preview/published site.
