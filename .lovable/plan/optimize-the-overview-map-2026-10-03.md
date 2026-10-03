# Optimize the Overview map

## Changes
- Remove the blue intermediate-stop dots while keeping useful start/end context.
- Add simulated buses for routes 154, 25, and M88 alongside route 62, with clearly differentiated labels and restrained movement.
- Replace approximate defect placement with explicit route-linked map coordinates so road-sign markers sit at their named Route 62 locations.
- Make Critical, Aging, Healthy, Overdue, and Coverage filters functional: each selection will update route styling, visible defects, bus visibility, and a concise map status summary.
- Improve search so it can locate route stops, bus routes, and named defect locations.
- Keep all vehicle locations and road-condition layers explicitly labeled as illustrative demo data.

## Technical details
- Refactor the map overlay registry so route lines, defect signs, and buses can be shown, hidden, or restyled without rebuilding Google Maps.
- Use semantic design tokens for filter states and route conditions; remove unused marker styling.
- Preserve the current Google Maps connection, Route 62 geometry, alert actions, map controls, and mobile layout.
- Add focused tests for filter-to-overlay behavior, then verify the Overview interactions at desktop and mobile sizes.
