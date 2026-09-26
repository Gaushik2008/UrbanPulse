# UrbanPulse implementation plan

## Product outcome
Build a polished, responsive civic road-intelligence demo that makes the closed loop immediately clear:

```text
Bus sensing → AI detection → GIS coverage → inspection → repair → re-observation → verification
```

Coverage Intelligence will be the visual and conceptual center of the product, with unknown roads clearly distinguished from healthy roads. All visible information will be marked as demo data.

## What will be built

1. **Public landing page**
   - Clear civic-technology story, live map visual, operating pipeline, coverage differentiator, impact, and demo entry.
   - Restrained neutral palette, blue action color, semantic green/amber/red/gray states.

2. **Responsive application shell**
   - Compact desktop sidebar, collapsible tablet navigation, and mobile bottom navigation.
   - Overview, City Map, Detections, Coverage, Inspection, Verification, Analytics, Fleet, Settings, and System Status destinations.
   - Consistent demo-data label, date/time, system state, and user profile.

3. **Overview operations dashboard**
   - Five focused KPIs, dominant interactive city map, selectable road segments, map timeframe/layer controls, and GIS detail panel.
   - Supporting pipeline and fleet status without turning the page into a generic metric grid.

4. **Coverage Intelligence**
   - Dedicated summary, coverage map, progressive observation timeline, and prominent Coverage Gap Engine.
   - Unknown, observed, aging, attention, and critical segments differentiated by labels, patterns, and color.
   - Route-generation interaction for selected gaps.

5. **Detection workflow**
   - Filterable detection table and a detailed detection view with camera evidence, bounding box, severity, confidence, and bus sources.
   - Multi-source validation timeline showing duplicate detection, temporal consistency, consensus, and confirmation.

6. **Inspection and route planning**
   - Prioritized field missions and an optimized inspection route with depot, ordered stops, distance, time, issue counts, and coverage gaps addressed.
   - Start/export interactions with clear confirmation states.

7. **Repair verification and road history**
   - Before/repair/after/verified flow, before-and-after evidence, event dates, and a compact road-health chart.

8. **City analytics and fleet contribution**
   - Minimal readable charts for road condition, coverage growth, detection mix, severity, and bus contribution.
   - Fleet list with route, GPS freshness, observations, detections, and coverage contribution.

9. **Quality and polish**
   - Shared semantic design tokens, accessible controls, visible focus states, responsive layouts, restrained motion, tooltips, loading/empty/error/confirmation states.
   - Unique metadata for every content page.
   - Validate core interactions and desktop/mobile rendering in the live preview.

## Technical approach

- Use the existing React/TanStack application structure and Tailwind CSS design tokens.
- Use a browser-safe map implementation with locally modeled city geometry and interactive semantic road overlays, avoiding external credentials so demo mode always works.
- Use Recharts for analytical and history charts.
- Keep a typed, realistic in-app demo dataset for buses, roads, observations, detections, gaps, missions, repairs, and verification records.
- Model user roles in the interface as Municipal Admin, Inspector, and Analyst; no persistent authentication or production backend will be added because this deliverable is a self-contained demo.
- Use reusable map, status, timeline, data-table, side-panel, and chart components across pages.

## Scope boundary

This phase delivers the complete interactive frontend demonstration with realistic demo data. FastAPI, PostgreSQL/PostGIS, YOLO/OpenCV processing, live vehicle feeds, production routing engines, and persistent authentication are represented through the product workflows and data model, but are not deployed or connected.
