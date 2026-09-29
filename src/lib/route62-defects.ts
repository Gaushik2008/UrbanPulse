import { useSyncExternalStore } from "react";
import { toast } from "sonner";

export type RoadSign = "pothole" | "uneven" | "water" | "works";
export type Route62Defect = {
  id: string;
  issue: string;
  sign: RoadSign;
  signLabel: string;
  near: string;
  /** Position along the route 62 path, 0 = Poonamallee, 1 = Red Hills */
  along: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  passes: string;
  first: string;
  last: string;
  bus: string;
};

/** Illustrative demo detections placed along route 62 — not real survey data. */
export const route62Defects: Route62Defect[] = [
  { id: "R62-014", issue: "Pothole cluster", sign: "pothole", signLabel: "Pothole ahead", near: "Poonamallee High Rd · Karayanchavadi", along: 0.1, severity: "Critical", confidence: 96, passes: "6/6", first: "07:12", last: "10:48", bus: "Bus 62-104" },
  { id: "R62-021", issue: "Waterlogging", sign: "water", signLabel: "Waterlogged road", near: "Avadi High Rd · Thirumullaivoyal", along: 0.3, severity: "High", confidence: 89, passes: "4/5", first: "08:05", last: "10:31", bus: "Bus 62-221" },
  { id: "R62-027", issue: "Surface cracking", sign: "uneven", signLabel: "Uneven road", near: "CTH Rd · Avadi Market", along: 0.46, severity: "Medium", confidence: 84, passes: "3/4", first: "06:58", last: "09:40", bus: "Bus 62-187" },
  { id: "R62-033", issue: "Pothole", sign: "pothole", signLabel: "Pothole ahead", near: "Ambattur O.T. Junction", along: 0.62, severity: "High", confidence: 93, passes: "5/6", first: "09:14", last: "11:02", bus: "Bus 62-104" },
  { id: "R62-038", issue: "Damaged road edge", sign: "works", signLabel: "Repair required", near: "Surapet · GNT Link Rd", along: 0.82, severity: "Medium", confidence: 81, passes: "3/5", first: "07:46", last: "10:10", bus: "Bus 62-221" },
];

type AlertState = Record<string, string>; // defect id -> alert time
let alerts: AlertState = {};
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };

export function sendRepairAlert(defect: Route62Defect) {
  if (alerts[defect.id]) { toast.info(`Alert already sent for ${defect.id}`); return; }
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  alerts = { ...alerts, [defect.id]: time };
  listeners.forEach((fn) => fn());
  toast.success(`"${defect.signLabel}" alert sent to municipality`, { description: `${defect.issue} · ${defect.near}. Demo only — no real work order was created.` });
}

export function useRepairAlerts() {
  return useSyncExternalStore(subscribe, () => alerts, () => alerts);
}
