# UrbanPulse product demo upgrade

## Outcome
Transform the existing concept into a cohesive, interactive municipal operations demonstration while preserving its brand, semantic colors, demo dataset, routes, and coverage-first product story.

## Product experience
1. **Product-first public experience**
   - Replace the current marketing-heavy hero with a concise product statement and a large live operations map in the first viewport.
   - Add sticky desktop navigation and a mobile drawer for Overview, Live Map, Coverage, Priority Actions, and How It Works.
   - Keep all simulated information visibly marked as Demo Mode or Illustrative Data.

2. **Shared demo scenario state**
   - Add a single shared demo state for scenario, timeframe, map filter, selected issue, priority actions, and simulated workflow outcomes.
   - Scenario choices—new pothole, critical confirmation, repair completed, repair verified, and coverage gap—will consistently update map emphasis, KPI values, priorities, evidence, and verification state.

3. **Live map centerpiece**
   - Expand the semantic map with moving buses, detection markers, selected-road highlighting, restrained pulse and coverage-update motion, search, timeframe controls, and condition/observation filters.
   - Separate road condition (Healthy, Aging, Critical) from observation status (Recent, Overdue, Unknown), with clear legends and explanations.
   - Make map detections and priority items open the same issue-detail experience.

4. **Operational dashboard hierarchy**
   - Add a clickable six-metric KPI strip, including contextual observed-network distance, comparison period, and coverage definition.
   - Add an interactive Priority Actions section with critical road issues and overdue coverage segments.
   - Connect KPI and action selections to relevant filters, pages, or detail states rather than leaving dead controls.

5. **Evidence and action drawer**
   - Build a polished desktop side drawer and mobile bottom sheet containing road status, detection times, confidence, repeated passes, severity, observation history, and clearly labeled synthetic evidence.
   - Make View Evidence, Create Work Order, and Mark for Review produce realistic demo state changes and confirmations.

6. **Closed-loop verification**
   - Strengthen the verification view into Detection → Work Order → Repair → Re-observation → AI Verification → Verified.
   - Show before/after evidence, confidence, and subsequent observations, all labeled as illustrative data.

7. **Interactive workflow and trust**
   - Turn Capture, Detect, Validate, Locate, Prioritize, and Verify into an interactive visual sequence with concise stage-specific content.
   - Add a compact Data & AI transparency area explaining observations, confidence, repeated evidence, coverage, and limitations without unsupported claims.

8. **Responsive polish and validation**
   - Preserve map usability on phones, use horizontal or two-column KPI layouts, stack priority cards, convert details to a bottom sheet, and keep touch targets comfortable.
   - Validate scenario changes, map filters/search, issue details, work-order/review actions, workflow steps, navigation, and desktop/mobile layouts in the running preview.

## Technical approach
- Extend the existing typed demo data rather than introducing a backend.
- Use a small React context/provider for consistent scenario and selection state across existing TanStack routes.
- Refactor the current map and portal-page components into focused reusable controls, action lists, workflow, evidence drawer, and verification pieces.
- Reuse existing semantic design tokens and shadcn controls; add only restrained motion with reduced-motion fallbacks.
- Keep every existing route and useful interaction unless replaced by the connected equivalent.

## Scope boundary
This remains an honest interactive demo. It will not claim real municipal deployment, run computer vision, create external work orders, or persist operational changes beyond the browser session.
