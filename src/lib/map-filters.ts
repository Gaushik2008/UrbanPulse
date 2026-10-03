import type { Route62Defect } from "./route62-defects";

export const mapFilters = ["All", "Critical", "Aging", "Healthy", "Overdue", "Coverage"] as const;
export type MapFilter = (typeof mapFilters)[number];

export type MapFilterView = {
  defectIds: string[];
  showBuses: boolean;
  routeTone: "default" | "critical" | "aging" | "healthy" | "overdue" | "coverage";
  summary: string;
};

export function getMapFilterView(filter: MapFilter, defects: Route62Defect[]): MapFilterView {
  const defectIds = defects
    .filter((defect) => {
      if (filter === "Critical") return defect.severity === "Critical" || defect.severity === "High";
      if (filter === "Aging") return defect.severity === "Medium" || defect.severity === "Low";
      if (filter === "Healthy" || filter === "Overdue" || filter === "Coverage") return false;
      return true;
    })
    .map((defect) => defect.id);

  const summaries: Record<MapFilter, string> = {
    All: `${defects.length} illustrative defects · 4 simulated buses`,
    Critical: `${defectIds.length} high-priority defects shown`,
    Aging: `${defectIds.length} aging road observations shown`,
    Healthy: "Healthy observed corridor highlighted",
    Overdue: "Overdue observation areas highlighted",
    Coverage: "Recent route observation coverage highlighted",
  };

  return {
    defectIds,
    showBuses: filter === "All" || filter === "Coverage",
    routeTone: filter === "All" ? "default" : filter.toLowerCase() as MapFilterView["routeTone"],
    summary: summaries[filter],
  };
}