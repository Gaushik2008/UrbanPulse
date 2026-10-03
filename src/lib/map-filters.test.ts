import { describe, expect, test } from "bun:test";
import { getMapFilterView } from "./map-filters";
import { route62Defects } from "./route62-defects";

describe("Overview map filters", () => {
  test("Critical shows only critical and high-severity defects", () => {
    const view = getMapFilterView("Critical", route62Defects);
    expect(view.defectIds).toEqual(["R62-014", "R62-021", "R62-033"]);
    expect(view.showBuses).toBe(false);
    expect(view.routeTone).toBe("critical");
  });

  test("Aging shows only medium and low-severity defects", () => {
    const view = getMapFilterView("Aging", route62Defects);
    expect(view.defectIds).toEqual(["R62-027", "R62-038"]);
    expect(view.routeTone).toBe("aging");
  });

  test("Healthy, Overdue, and Coverage separate condition from defects", () => {
    expect(getMapFilterView("Healthy", route62Defects).defectIds).toEqual([]);
    expect(getMapFilterView("Overdue", route62Defects).defectIds).toEqual([]);
    expect(getMapFilterView("Coverage", route62Defects).showBuses).toBe(true);
  });
});