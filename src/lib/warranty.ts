import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { route62Defects } from "./route62-defects";

/* ------------------------------------------------------------------ */
/* ILLUSTRATIVE DEMO RECORDS — contractors, contracts and warranties   */
/* are fictional and not verified municipal or company information.    */
/* ------------------------------------------------------------------ */

export type Contractor = { id: string; name: string; contact: string; email: string; phone: string; address: string; registration: string };
export const contractors: Contractor[] = [
  { id: "CTR-101", name: "ABC Infrastructure Pvt. Ltd.", contact: "R. Srinivasan", email: "projects@abc-infra.example", phone: "+91 44 0000 1101", address: "Guindy, Chennai (demo)", registration: "Class I (Roads) · demo" },
  { id: "CTR-102", name: "XYZ Roads Ltd", contact: "M. Lakshmi", email: "ops@xyzroads.example", phone: "+91 44 0000 1102", address: "Ambattur, Chennai (demo)", registration: "Class I (Roads) · demo" },
  { id: "CTR-103", name: "Metro Infra", contact: "K. Arun", email: "desk@metroinfra.example", phone: "+91 44 0000 1103", address: "Avadi, Chennai (demo)", registration: "Class II (Roads) · demo" },
  { id: "CTR-104", name: "Coastal Civil Works", contact: "S. Priya", email: "info@coastalcivil.example", phone: "+91 44 0000 1104", address: "Poonamallee, Chennai (demo)", registration: "Class II (Roads) · demo" },
];

export type RoadContract = {
  segment: string; road: string; municipality: string; zone: string; authority: string;
  contractorId?: string; projectId?: string; projectName?: string; tender?: string;
  started?: string; completed?: string; opened?: string;
  warrantyStart?: string; warrantyEnd?: string; warrantyYears?: number;
  contractStatus: string; maintenance: string; documents: string[];
  coverage: number; lastObservation: string; previousObservations: number; previousRepairs: number;
};

export const roadContracts: RoadContract[] = [
  { segment: "18A", road: "Anna Salai", municipality: "Greater Chennai Corporation", zone: "Zone 9 · Teynampet", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-101", projectId: "PRJ-2025-018", projectName: "Chennai Road Improvement Project", tender: "GCC/BRR/2024/118", started: "2024-09-02", completed: "2025-03-15", opened: "2025-03-20", warrantyStart: "2025-03-15", warrantyEnd: "2030-03-15", warrantyYears: 5, contractStatus: "Defect liability period", maintenance: "Contractor (defects) · GCC (routine)", documents: ["Work order", "Completion certificate", "Defect liability clause"], coverage: 92, lastObservation: "10:12", previousObservations: 5, previousRepairs: 2 },
  { segment: "TN-04", road: "Venkatanarayana Road", municipality: "Greater Chennai Corporation", zone: "Zone 10 · Kodambakkam", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-102", projectId: "PRJ-2023-041", projectName: "T Nagar Storm-Water & Resurfacing", tender: "GCC/SWD/2023/041", started: "2022-12-10", completed: "2023-06-20", opened: "2023-06-25", warrantyStart: "2023-06-20", warrantyEnd: "2026-12-20", warrantyYears: 3.5, contractStatus: "Defect liability period", maintenance: "Contractor (defects) · GCC (routine)", documents: ["Work order", "Completion certificate"], coverage: 88, lastObservation: "09:48", previousObservations: 7, previousRepairs: 1 },
  { segment: "GP-09", road: "Greams Road", municipality: "Greater Chennai Corporation", zone: "Zone 9 · Teynampet", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-102", projectId: "PRJ-2021-077", projectName: "Central Chennai Resurfacing Phase II", tender: "GCC/BRR/2021/077", started: "2021-01-12", completed: "2021-06-20", opened: "2021-06-24", warrantyStart: "2021-06-20", warrantyEnd: "2026-06-20", warrantyYears: 5, contractStatus: "Closed", maintenance: "GCC", documents: ["Work order", "Completion certificate", "Closure note"], coverage: 64, lastObservation: "3 days ago", previousObservations: 4, previousRepairs: 3 },
  { segment: "AD-07", road: "L.B. Road", municipality: "Greater Chennai Corporation", zone: "Zone 13 · Adyar", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-103", projectId: "PRJ-2026-012", projectName: "Adyar Arterial Upgrade", tender: "GCC/BRR/2025/212", started: "2025-08-01", completed: "2026-01-10", opened: "2026-01-14", contractStatus: "Records incomplete", maintenance: "To be verified", documents: ["Work order"], coverage: 95, lastObservation: "11:03", previousObservations: 3, previousRepairs: 0 },
  { segment: "MY-02", road: "R.K. Mutt Road", municipality: "Greater Chennai Corporation", zone: "Zone 9 · Mylapore", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-104", projectId: "PRJ-2024-033", projectName: "Mylapore Heritage Streets", tender: "GCC/BRR/2024/033", started: "2024-02-01", completed: "2024-07-30", opened: "2024-08-02", warrantyStart: "2024-07-30", warrantyEnd: "2027-07-30", warrantyYears: 3, contractStatus: "Defect liability period", maintenance: "Contractor (defects) · GCC (routine)", documents: ["Work order", "Completion certificate"], coverage: 81, lastObservation: "09:18", previousObservations: 6, previousRepairs: 1 },
  { segment: "PR-03", road: "Perambur High Road", municipality: "Greater Chennai Corporation", zone: "Zone 6 · Thiru Vi Ka Nagar", authority: "GCC Bus Route Roads Dept.", contractStatus: "No contract on file", maintenance: "To be verified", documents: [], coverage: 0, lastObservation: "18 days ago", previousObservations: 1, previousRepairs: 0 },
  { segment: "R62-PH", road: "Poonamallee High Rd", municipality: "Tiruvallur District / Poonamallee Municipality", zone: "Karayanchavadi", authority: "State Highways (demo)", contractorId: "CTR-104", projectId: "PRJ-2024-062", projectName: "Route 62 Corridor Strengthening", tender: "SH/TVL/2024/062", started: "2024-01-15", completed: "2024-10-05", opened: "2024-10-10", warrantyStart: "2024-10-05", warrantyEnd: "2029-10-05", warrantyYears: 5, contractStatus: "Defect liability period", maintenance: "Contractor (defects)", documents: ["Work order", "Completion certificate"], coverage: 90, lastObservation: "10:48", previousObservations: 6, previousRepairs: 1 },
  { segment: "R62-AV", road: "Avadi High Rd", municipality: "Avadi City Municipal Corporation", zone: "Thirumullaivoyal", authority: "Avadi Corporation Roads (demo)", contractorId: "CTR-103", projectId: "PRJ-2020-019", projectName: "Avadi Link Roads Resurfacing", tender: "ACMC/2020/019", started: "2019-11-01", completed: "2020-04-18", opened: "2020-04-20", warrantyStart: "2020-04-18", warrantyEnd: "2023-04-18", warrantyYears: 3, contractStatus: "Closed", maintenance: "Avadi Corporation", documents: ["Work order", "Closure note"], coverage: 78, lastObservation: "10:31", previousObservations: 5, previousRepairs: 2 },
  { segment: "R62-CTH", road: "CTH Road", municipality: "Avadi City Municipal Corporation", zone: "Avadi Market", authority: "State Highways (demo)", contractorId: "CTR-101", projectId: "PRJ-2025-044", projectName: "CTH Road Widening", tender: "SH/TVL/2025/044", started: "2025-02-01", completed: "2025-11-30", opened: "2025-12-05", warrantyStart: "2025-11-30", warrantyEnd: "2026-11-30", warrantyYears: 1, contractStatus: "Defect liability period", maintenance: "Contractor (defects)", documents: ["Work order", "Completion certificate"], coverage: 84, lastObservation: "09:40", previousObservations: 4, previousRepairs: 0 },
  { segment: "R62-AMB", road: "Ambattur O.T. Junction", municipality: "Greater Chennai Corporation", zone: "Zone 7 · Ambattur", authority: "GCC Bus Route Roads Dept.", contractorId: "CTR-102", projectId: "PRJ-2025-071", projectName: "Ambattur Junction Improvement", tender: "GCC/BRR/2025/071", started: "2025-03-01", completed: "2025-08-22", opened: "2025-08-25", warrantyStart: "2025-08-22", warrantyEnd: "2028-08-22", warrantyYears: 3, contractStatus: "Defect liability period", maintenance: "Contractor (defects) · GCC (routine)", documents: ["Work order", "Completion certificate"], coverage: 86, lastObservation: "11:02", previousObservations: 5, previousRepairs: 1 },
  { segment: "R62-SUR", road: "Surapet · GNT Link Rd", municipality: "Greater Chennai Corporation", zone: "Zone 3 · Madhavaram", authority: "GCC Bus Route Roads Dept.", contractStatus: "No contract on file", maintenance: "To be verified", documents: [], coverage: 70, lastObservation: "10:10", previousObservations: 3, previousRepairs: 0 },
];

/* ------------------------------ Settings ------------------------------ */
export type Settings = { expiryWarningDays: number; contractorResponseHours: number; repairDeadlineDays: number; escalationHours: number; verificationPasses: number; notifyMunicipality: boolean; notifyContractor: boolean; municipalityContact: string };
const defaultSettings: Settings = { expiryWarningDays: 90, contractorResponseHours: 48, repairDeadlineDays: 7, escalationHours: 24, verificationPasses: 2, notifyMunicipality: true, notifyContractor: true, municipalityContact: "roads-desk@gcc.example" };

/* ------------------------------ Warranty ------------------------------ */
export type WarrantyState = "active" | "expiring" | "expired" | "unknown";
const DAY = 86400000;
export function fmtDate(iso?: string) { if (!iso) return "Unknown"; return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
export function remainingText(days: number) { if (days < 0) return `${Math.abs(days)} days ago`; if (days < 120) return `${days} days`; const y = Math.floor(days / 365); const m = Math.floor((days % 365) / 30.4); return [y ? `${y} year${y > 1 ? "s" : ""}` : "", m ? `${m} month${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ") || `${days} days`; }
export function warrantyOf(c: RoadContract | undefined, thresholdDays = state.settings.expiryWarningDays) {
  if (!c || !c.contractorId || !c.warrantyEnd) return { state: "unknown" as WarrantyState, days: 0, label: "Warranty information unavailable" };
  const days = Math.ceil((new Date(c.warrantyEnd + "T23:59:59").getTime() - Date.now()) / DAY);
  if (days < 0) return { state: "expired" as WarrantyState, days, label: `Expired · ended ${fmtDate(c.warrantyEnd)}` };
  if (days <= thresholdDays) return { state: "expiring" as WarrantyState, days, label: `Expiring soon · ${remainingText(days)} remaining` };
  return { state: "active" as WarrantyState, days, label: `Active · ${remainingText(days)} remaining` };
}
export const contractFor = (segment: string) => roadContracts.find((c) => c.segment === segment);
export const contractorFor = (id?: string) => contractors.find((c) => c.id === id);

/* ------------------------------ Incidents ------------------------------ */
export type IncidentStatus = "New" | "Validated" | "Notified" | "Repair requested" | "In repair" | "Awaiting verification" | "Verified" | "Closed" | "Reopened" | "Under review" | "Maintenance process";
export type Incident = { id: string; type: string; road: string; segment: string; lat: number; lng: number; bus: string; route: string; date: string; severity: "Low" | "Medium" | "High" | "Critical"; confidence: number; buses: number; first: string; last: string; status: IncidentStatus; detectionId?: string; recurring?: { previousRepair: string; similarity: number } };

const baseIncidents: Omit<Incident, "status">[] = [
  { id: "RD-1842", type: "Pothole", road: "Anna Salai", segment: "18A", lat: 13.0478, lng: 80.2425, bus: "Bus 01", route: "18A · Broadway–Kilambakkam", date: "Today", severity: "High", confidence: 94, buses: 3, first: "08:41", last: "10:12", detectionId: "DET-1842" },
  { id: "RD-1838", type: "Water-related road damage", road: "Venkatanarayana Road", segment: "TN-04", lat: 13.0418, lng: 80.2381, bus: "Bus 02", route: "5E · Vadapalani–Besant Nagar", date: "Today", severity: "Medium", confidence: 89, buses: 2, first: "09:23", last: "09:48", detectionId: "DET-1838" },
  { id: "RD-1829", type: "Damaged road section", road: "L.B. Road", segment: "AD-07", lat: 13.0012, lng: 80.2565, bus: "Bus 04", route: "18A · Broadway–Kilambakkam", date: "Today", severity: "High", confidence: 92, buses: 3, first: "07:12", last: "11:03", detectionId: "DET-1829" },
  { id: "RD-1817", type: "Surface deterioration", road: "R.K. Mutt Road", segment: "MY-02", lat: 13.0339, lng: 80.2619, bus: "Bus 05", route: "12B · Foreshore–Koyambedu", date: "Today", severity: "Low", confidence: 86, buses: 2, first: "06:55", last: "09:18", detectionId: "DET-1817" },
  { id: "RD-1809", type: "Pothole cluster", road: "Greams Road", segment: "GP-09", lat: 13.0604, lng: 80.2534, bus: "Bus 04", route: "18A · Broadway–Kilambakkam", date: "Today", severity: "Critical", confidence: 97, buses: 4, first: "06:31", last: "10:45", detectionId: "DET-1809" },
  ...route62Defects.map((d, i) => ({ id: `RD-${2014 + i * 7}`, type: d.issue, road: d.near.split(" · ")[0] ?? d.near, segment: (["R62-PH", "R62-AV", "R62-CTH", "R62-AMB", "R62-SUR"] as const)[i] ?? "R62-PH", lat: 13.04 + i * 0.03, lng: 80.1 + i * 0.02, bus: d.bus, route: "62 · Poonamallee–Red Hills", date: "Today", severity: d.severity, confidence: d.confidence, buses: Number(d.passes.split("/")[0]) || 3, first: d.first, last: d.last, detectionId: d.id })),
];

export type NotifCategory = "Critical road damage" | "New detection" | "Warranty active" | "Warranty expiring" | "Warranty expired" | "Contractor notification" | "Inspection required" | "Repair overdue" | "Verification completed" | "Repair failed" | "Recurring damage" | "Contract verification" | "Fleet";
export type NotifStatus = "Pending" | "Sent" | "Viewed" | "Acknowledged" | "Action Required" | "Resolved";
export type Notification = { id: string; category: NotifCategory; recipient: "Municipality" | "Contractor" | "Admin"; to: string; title: string; message: string; incidentId?: string; segment?: string; time: string; status: NotifStatus };
export type RepairStatus = "Requested" | "Acknowledged" | "Scheduled" | "In Progress" | "Completed" | "Awaiting Verification" | "Verified" | "Reopened";
export type RepairCase = { id: string; incidentId: string; segment: string; contractorId?: string; owner: string; assigned: string; target: string; actual?: string; status: RepairStatus; notes: string; reviewer: string; verification?: { bus: string; confidence: number; result: string } };
export type AuditEntry = { time: string; text: string; actor: string };

type State = { settings: Settings; incidents: Incident[]; notifications: Notification[]; repairs: Record<string, RepairCase>; audit: Record<string, AuditEntry[]>; flags: Record<string, string[]> };
let state: State = { settings: defaultSettings, incidents: [], notifications: [], repairs: {}, audit: {}, flags: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());
const set = (fn: (s: State) => State) => { state = fn(state); emit(); };
let seq = 1;
const nid = () => `NT-${String(4000 + seq++)}`;
const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const addDays = (n: number) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

function log(s: State, incidentId: string, text: string, actor = "UrbanPulse", time = clock()): State {
  return { ...s, audit: { ...s.audit, [incidentId]: [...(s.audit[incidentId] ?? []), { time, text, actor }] } };
}

/** Automated pipeline: validate → identify segment → contractor → warranty → notify. */
function runPipeline(s: State, inc: Omit<Incident, "status">, time: string): State {
  const c = contractFor(inc.segment); const ctr = contractorFor(c?.contractorId); const w = warrantyOf(c, s.settings.expiryWarningDays);
  let next: State = { ...s };
  next = log(next, inc.id, `Detected by ${inc.bus} on ${inc.route} · ${inc.type} · ${inc.confidence}% confidence`, inc.bus, inc.first);
  next = log(next, inc.id, `Validated across ${inc.buses} bus observations (last ${inc.last})`, "UrbanPulse", inc.last);
  next = log(next, inc.id, `Mapped to ${inc.road} · Segment ${inc.segment}`, "UrbanPulse", inc.last);
  next = log(next, inc.id, ctr ? `Contract records associate ${ctr.name} (${c?.projectId}) with this segment` : "No contractor record found for this segment", "UrbanPulse", inc.last);
  next = log(next, inc.id, `Warranty check: ${w.label}`, "UrbanPulse", inc.last);
  const notes: Notification[] = [];
  const base = `${inc.severity.toLowerCase()}-severity ${inc.type.toLowerCase()} on ${inc.road}, Segment ${inc.segment}. AI confidence: ${inc.confidence}%. Detected by ${inc.bus} at ${inc.first}.`;
  if (s.settings.notifyMunicipality) notes.push({ id: nid(), category: inc.severity === "Critical" ? "Critical road damage" : w.state === "expired" ? "Warranty expired" : "New detection", recipient: "Municipality", to: c?.municipality ?? "Municipality", title: w.state === "expired" ? `Warranty expired — ${inc.id}` : `Road damage detected — ${inc.id}`, message: `UrbanPulse detected a ${base} ${w.state === "expired" ? "The available road contract indicates the warranty period has ended. Please initiate the appropriate municipal maintenance process if required." : "Please review and initiate the appropriate road maintenance process."}`, incidentId: inc.id, segment: inc.segment, time, status: "Sent" });
  if ((w.state === "active" || w.state === "expiring") && ctr && s.settings.notifyContractor) notes.push({ id: nid(), category: "Contractor notification", recipient: "Contractor", to: ctr.name, title: `Road damage detected under active warranty — ${inc.id}`, message: `UrbanPulse has detected a ${base} The available project records indicate this segment is currently within its warranty period (ends ${fmtDate(c?.warrantyEnd)}). Please review the issue and coordinate the appropriate repair according to the applicable contract and warranty terms.`, incidentId: inc.id, segment: inc.segment, time, status: "Action Required" });
  if (w.state === "unknown") notes.push({ id: nid(), category: "Contract verification", recipient: "Admin", to: "Contracts cell", title: `Verify road contract — ${inc.road} ${inc.segment}`, message: `Contractor or warranty information is missing for ${inc.road}, Segment ${inc.segment}. Please verify the road contract/warranty records so incident ${inc.id} can be routed.`, incidentId: inc.id, segment: inc.segment, time, status: "Action Required" });
  next = { ...next, notifications: [...notes, ...next.notifications] };
  notes.forEach((n) => { next = log(next, inc.id, `Notification sent to ${n.to} (${n.recipient.toLowerCase()})`, "UrbanPulse", time); });
  const status: IncidentStatus = w.state === "unknown" ? "Under review" : w.state === "expired" ? "Maintenance process" : "Notified";
  return { ...next, incidents: [{ ...inc, status }, ...next.incidents] };
}

function seed(): State {
  let s: State = { settings: defaultSettings, incidents: [], notifications: [], repairs: {}, audit: {}, flags: {} };
  [...baseIncidents].reverse().forEach((i) => { s = runPipeline(s, i, i.last); });
  // Warranty expiring reminders
  roadContracts.forEach((c) => { const w = warrantyOf(c, s.settings.expiryWarningDays); if (w.state === "expiring") s.notifications.push({ id: nid(), category: "Warranty expiring", recipient: "Admin", to: "Contracts cell", title: `Warranty expiring soon — ${c.road} ${c.segment}`, message: `Warranty ends ${fmtDate(c.warrantyEnd)} (${w.days} days). Review existing road-condition issues before the warranty period ends.`, segment: c.segment, time: "08:00", status: "Pending" }); });
  // A seeded repair case in progress + awaiting verification on the Anna Salai incident
  s.repairs["RD-1842"] = { id: "RP-3101", incidentId: "RD-1842", segment: "18A", contractorId: "CTR-101", owner: "ABC Infrastructure Pvt. Ltd.", assigned: addDays(-1), target: addDays(6), status: "Scheduled", notes: "Contractor acknowledged; patching crew scheduled.", reviewer: "AE, Zone 9" };
  s = log(s, "RD-1842", "Contractor accepted repair request · RP-3101 created", "ABC Infrastructure", "10:40");
  s.incidents = s.incidents.map((i) => (i.id === "RD-1842" ? { ...i, status: "Repair requested" } : i));
  s.notifications.push({ id: nid(), category: "Fleet", recipient: "Admin", to: "Fleet desk", title: "Bus 03 camera offline", message: "Bus 03 (29C) has not uploaded observations for 18 minutes. Coverage on Perambur corridor may drop.", time: "10:20", status: "Pending" });
  return s;
}
state = seed();

export function useWarrantyStore() { return useSyncExternalStore((f) => { listeners.add(f); return () => listeners.delete(f); }, () => state, () => state); }
export const getIncident = (id: string) => state.incidents.find((i) => i.id === id);

/* ------------------------------ Actions ------------------------------ */
function updIncident(id: string, status: IncidentStatus) { set((s) => ({ ...s, incidents: s.incidents.map((i) => (i.id === id ? { ...i, status } : i)) })); }
function flag(id: string, key: string) { set((s) => ({ ...s, flags: { ...s.flags, [id]: [...(s.flags[id] ?? []), key] } })); }
export const hasFlag = (s: State, id: string, key: string) => (s.flags[id] ?? []).includes(key);

export function notify(incidentId: string, who: "Contractor" | "Municipality") {
  const inc = getIncident(incidentId); if (!inc) return; const c = contractFor(inc.segment); const ctr = contractorFor(c?.contractorId);
  if (who === "Contractor" && !ctr) { toast.error("No contractor on record", { description: "Verify the road contract before notifying a contractor." }); return; }
  const to = who === "Contractor" ? ctr!.name : c?.municipality ?? "Municipality";
  set((s) => log({ ...s, notifications: [{ id: nid(), category: who === "Contractor" ? "Contractor notification" : "Inspection required", recipient: who, to, title: `${who} notified — ${inc.id}`, message: `Manual notification about ${inc.type.toLowerCase()} on ${inc.road}, Segment ${inc.segment} (${inc.confidence}% confidence). Contract records are provided for human review.`, incidentId, segment: inc.segment, time: clock(), status: "Sent" }, ...s.notifications] }, incidentId, `Manual notification sent to ${to}`, "Gaushik Kumar"));
  toast.success(`${who} notified`, { description: `${to} · Demo only — no real message was sent.` });
}
export function municipalAction(incidentId: string, action: "Inspection" | "Maintenance request" | "Officer assigned" | "Marked for review") {
  flag(incidentId, action);
  set((s) => log(s, incidentId, action === "Officer assigned" ? "Assigned to Assistant Engineer, Zone 9" : `${action} created`, "Gaushik Kumar"));
  if (action === "Maintenance request") updIncident(incidentId, "Maintenance process");
  toast.success(action === "Officer assigned" ? "Officer assigned" : `${action} created`, { description: `${incidentId} · Demo workflow.` });
}
export function acceptRepair(incidentId: string) {
  const inc = getIncident(incidentId); if (!inc) return; const c = contractFor(inc.segment); const ctr = contractorFor(c?.contractorId);
  if (state.repairs[incidentId]) { toast.info("Repair case already exists"); return; }
  const rc: RepairCase = { id: `RP-${3100 + Object.keys(state.repairs).length + 2}`, incidentId, segment: inc.segment, contractorId: ctr?.id, owner: ctr?.name ?? "GCC maintenance", assigned: addDays(0), target: addDays(state.settings.repairDeadlineDays), status: ctr ? "Acknowledged" : "Requested", notes: "", reviewer: "AE, " + (c?.zone ?? "Zone") };
  set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: rc }, notifications: s.notifications.map((n) => (n.incidentId === incidentId && n.recipient === "Contractor" ? { ...n, status: "Acknowledged" } : n)) }, incidentId, `Repair case ${rc.id} created · target ${fmtDate(rc.target)}`, ctr?.name ?? "Gaushik Kumar"));
  updIncident(incidentId, "Repair requested");
  toast.success(`Repair case ${rc.id} created`, { description: `Target completion ${fmtDate(rc.target)} · Demo workflow.` });
}
export function disputeRequest(incidentId: string) {
  set((s) => log({ ...s, notifications: s.notifications.map((n) => (n.incidentId === incidentId && n.recipient === "Contractor" ? { ...n, status: "Viewed" } : n)) }, incidentId, "Contractor requested review of the repair request", "Contractor"));
  updIncident(incidentId, "Under review");
  toast.info("Review requested", { description: "A municipal officer will review the contract terms. No liability has been determined." });
}
const order: RepairStatus[] = ["Requested", "Acknowledged", "Scheduled", "In Progress", "Completed"];
export function advanceRepair(incidentId: string) {
  const rc = state.repairs[incidentId]; if (!rc) return; const idx = order.indexOf(rc.status); const nextStatus = order[Math.min(idx + 1, order.length - 1)] ?? "Completed";
  if (nextStatus === "Completed") return completeRepair(incidentId);
  set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: { ...rc, status: nextStatus } } }, incidentId, `Repair status → ${nextStatus}`, rc.owner));
  if (nextStatus === "In Progress") updIncident(incidentId, "In repair");
  toast.success(`Repair ${nextStatus.toLowerCase()}`);
}
export function completeRepair(incidentId: string) {
  const rc = state.repairs[incidentId]; if (!rc) return;
  set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: { ...rc, status: "Completed", actual: addDays(0) } } }, incidentId, "Repair marked completed", rc.owner));
  updIncident(incidentId, "Awaiting verification");
  toast.success("Repair marked completed", { description: "Waiting for the next bus to pass this segment…" });
  setTimeout(() => {
    const cur = state.repairs[incidentId]; if (!cur) return; const inc = getIncident(incidentId);
    const verification = { bus: inc?.bus === "Bus 01" ? "Bus 04" : "Bus 01", confidence: 96, result: "Road surface anomaly significantly reduced" };
    set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: { ...cur, status: "Awaiting Verification", verification } }, notifications: [{ id: nid(), category: "Verification completed", recipient: "Municipality", to: contractFor(cur.segment)?.municipality ?? "Municipality", title: `Bus re-observation — ${incidentId}`, message: `${verification.bus} re-observed Segment ${cur.segment}: ${verification.result} (${verification.confidence}% verification confidence). Awaiting municipal confirmation.`, incidentId, segment: cur.segment, time: clock(), status: "Action Required" }, ...s.notifications] }, incidentId, `${verification.bus} re-observed segment · ${verification.result} · ${verification.confidence}%`, verification.bus));
    toast.info(`${verification.bus} re-observed Segment ${cur.segment}`, { description: `AI verification confidence ${verification.confidence}% · awaiting municipal confirmation.` });
  }, 2200);
}
export function confirmRepair(incidentId: string, outcome: "confirm" | "reinspect" | "not-repaired") {
  const rc = state.repairs[incidentId]; if (!rc) return;
  if (outcome === "confirm") {
    set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: { ...rc, status: "Verified" } }, notifications: s.notifications.map((n) => (n.incidentId === incidentId ? { ...n, status: "Resolved" } : n)) }, incidentId, "Repair confirmed by municipality · case closed", "Gaushik Kumar"));
    updIncident(incidentId, "Closed"); toast.success("Repair verified · case closed");
  } else if (outcome === "reinspect") {
    flag(incidentId, "Inspection"); set((s) => log(s, incidentId, "Field re-inspection requested", "Gaushik Kumar")); toast.info("Re-inspection requested");
  } else {
    set((s) => log({ ...s, repairs: { ...s.repairs, [incidentId]: { ...rc, status: "Reopened", verification: undefined } }, notifications: [{ id: nid(), category: "Repair failed", recipient: "Municipality", to: "Roads desk", title: `Repair not accepted — ${incidentId}`, message: `Municipality marked the repair on Segment ${rc.segment} as not repaired. Case reopened.`, incidentId, segment: rc.segment, time: clock(), status: "Action Required" }, ...s.notifications] }, incidentId, "Marked not repaired · case reopened", "Gaushik Kumar"));
    updIncident(incidentId, "Reopened"); toast.warning("Case reopened");
  }
}
export function simulateRecurrence(incidentId: string) {
  const inc = getIncident(incidentId); if (!inc) return; const id = `${inc.id}-R`;
  if (getIncident(id)) { toast.info("Recurring incident already created"); return; }
  const w = warrantyOf(contractFor(inc.segment));
  const recurring: Omit<Incident, "status"> = { ...inc, id, first: clock(), last: clock(), date: "Today", recurring: { previousRepair: "Verified earlier today", similarity: 89 } };
  set((s) => { let n = runPipeline(s, recurring, clock()); n = { ...n, incidents: n.incidents.map((i) => (i.id === id ? { ...i, status: "Reopened" } : i)), notifications: [{ id: nid(), category: "Recurring damage", recipient: "Municipality", to: contractFor(inc.segment)?.municipality ?? "Municipality", title: `Recurring road damage — ${inc.road} ${inc.segment}`, message: `The same damage reappeared after a verified repair (similarity 89%).${w.state === "active" || w.state === "expiring" ? " Segment is still under warranty — contractor notified for review." : ""}`, incidentId: id, segment: inc.segment, time: clock(), status: "Action Required" }, ...n.notifications] }; return log(n, id, `Recurring damage · similarity 89% to ${inc.id}`, "UrbanPulse"); });
  toast.warning("Recurring road damage detected", { description: `${id} created and reopened · Demo scenario.` });
  return id;
}
let simIdx = 0;
export function simulateDetection() {
  const picks = [{ segment: "R62-CTH", road: "CTH Road", type: "Road depression", sev: "High" as const }, { segment: "PR-03", road: "Perambur High Road", type: "Broken road edge", sev: "Medium" as const }, { segment: "R62-AV", road: "Avadi High Rd", type: "Road crack", sev: "Medium" as const }, { segment: "MY-02", road: "R.K. Mutt Road", type: "Uneven road", sev: "High" as const }];
  const p = picks[simIdx++ % picks.length]!; const t = clock();
  const inc: Omit<Incident, "status"> = { id: `RD-${1900 + simIdx}`, type: p.type, road: p.road, segment: p.segment, lat: 13.06 + simIdx * 0.004, lng: 80.18 + simIdx * 0.006, bus: "Bus 62-104", route: "62 · Poonamallee–Red Hills", date: "Today", severity: p.sev, confidence: 88 + (simIdx % 8), buses: 2, first: t, last: t };
  set((s) => runPipeline(s, inc, t));
  const w = warrantyOf(contractFor(p.segment));
  toast.success(`Road damage detected — ${inc.id}`, { description: `${p.type} · ${p.road} · warranty ${w.state} · notifications routed automatically (demo).` });
  return inc.id;
}
export function setNotificationStatus(id: string, status: NotifStatus) { set((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, status } : n)) })); }
export function markAllViewed() { set((s) => ({ ...s, notifications: s.notifications.map((n) => (n.status === "Sent" || n.status === "Pending" ? { ...n, status: "Viewed" } : n)) })); }
export function updateSettings(p: Partial<Settings>) { set((s) => ({ ...s, settings: { ...s.settings, ...p } })); }
export function resetSettings() { set((s) => ({ ...s, settings: defaultSettings })); toast.success("Settings reset to defaults"); }
