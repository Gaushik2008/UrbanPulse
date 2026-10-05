import { useEffect, useRef, useState } from "react";
import { BusFront, Truck, Camera, Radar, ScanLine, MapPin, Gauge, ListOrdered, Route as RouteIcon, Wrench, RefreshCw, ShieldCheck, ArrowDown, ArrowRight, CheckCircle2, Play, Pause, RotateCcw, Building2, CircleHelp, Check, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import roadDefectImage from "@/assets/anna-salai-pothole.jpg";
import repairedRoadImage from "@/assets/anna-salai-repaired.jpg";

/* ---------------- Simulated fleet data ---------------- */
export type Vehicle = { id: string; type: "Public Transit" | "Municipal Corporation"; route: string; observations: number; detections: number; contribution: number; telemetry: string; status: "Active" | "Idle" | "Offline"; segments: number };
export const publicBuses: Vehicle[] = [
  { id: "Bus 01", type: "Public Transit", route: "62 · Poonamallee–Red Hills", observations: 428, detections: 12, contribution: 18, telemetry: "4 sec ago", status: "Active", segments: 142 },
  { id: "Bus 02", type: "Public Transit", route: "5E · Vadapalani–Besant Nagar", observations: 312, detections: 8, contribution: 13, telemetry: "9 sec ago", status: "Active", segments: 108 },
  { id: "Bus 03", type: "Public Transit", route: "29C · Perambur–Thiruvanmiyur", observations: 191, detections: 4, contribution: 8, telemetry: "18 min ago", status: "Offline", segments: 64 },
  { id: "Bus 04", type: "Public Transit", route: "62 · Poonamallee–Red Hills", observations: 506, detections: 17, contribution: 22, telemetry: "2 sec ago", status: "Active", segments: 171 },
  { id: "Bus 05", type: "Public Transit", route: "12B · Foreshore–Koyambedu", observations: 359, detections: 9, contribution: 15, telemetry: "11 sec ago", status: "Active", segments: 119 },
];
export const municipalVehicles: Vehicle[] = [
  { id: "MC-01", type: "Municipal Corporation", route: "Avadi Zone · Ward 12–18 sweep", observations: 241, detections: 9, contribution: 12, telemetry: "6 sec ago", status: "Active", segments: 96 },
  { id: "MC-02", type: "Municipal Corporation", route: "Poonamallee High Rd · Inspection", observations: 284, detections: 11, contribution: 16, telemetry: "12 sec ago", status: "Active", segments: 118 },
  { id: "MC-03", type: "Municipal Corporation", route: "Ambattur Industrial Estate", observations: 198, detections: 7, contribution: 10, telemetry: "21 sec ago", status: "Active", segments: 81 },
  { id: "MC-04", type: "Municipal Corporation", route: "Perambur · Garbage collection loop", observations: 176, detections: 5, contribution: 9, telemetry: "3 min ago", status: "Idle", segments: 72 },
  { id: "MC-05", type: "Municipal Corporation", route: "Inner Ring Road · Water tanker", observations: 125, detections: 4, contribution: 7, telemetry: "38 sec ago", status: "Active", segments: 54 },
];

export function SimLive({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-info", className)}><i className="size-1.5 animate-pulse rounded-full bg-info" />Simulated live</span>;
}

export function SimulationBadge() {
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><button type="button" className="demo-label inline-flex items-center gap-1.5"><i className="size-1.5 animate-pulse rounded-full bg-info" />Simulation mode</button></TooltipTrigger><TooltipContent className="max-w-64">Prototype telemetry shown for demonstration. Production deployment can connect to vehicle cameras, GPS and municipal systems.</TooltipContent></Tooltip></TooltipProvider>;
}

/* ---------------- Fleet → network visual ---------------- */
export function FleetNetworkVisual() {
  const box = "flex items-center justify-center gap-2 border border-border bg-card px-4 py-3 text-xs font-semibold uppercase tracking-wide";
  return <div className="mx-auto flex max-w-md flex-col items-center gap-2">
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2"><div className={box}><BusFront className="size-4 text-primary" />Public buses</div><span className="text-muted-foreground">+</span><div className={box}><Truck className="size-4 text-primary" />Municipal fleet</div></div>
    <ArrowDown className="size-4 text-muted-foreground" /><div className={cn(box, "w-full")}><Radar className="size-4 text-info" />Mobile sensing network</div>
    <ArrowDown className="size-4 text-muted-foreground" /><div className={cn(box, "w-full")}><ScanLine className="size-4 text-info" />AI road intelligence</div>
    <ArrowDown className="size-4 text-muted-foreground" /><div className={cn(box, "w-full bg-primary text-primary-foreground")}><Building2 className="size-4" />Municipal action</div>
  </div>;
}

/* ---------------- Unknown ≠ Healthy ---------------- */
export function UnknownBanner() {
  const step = "border border-border bg-background px-3 py-2 text-[11px] font-semibold uppercase tracking-wide";
  return <section className="panel grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
    <div><p className="eyebrow">Core principle</p><h3 className="mt-1 text-2xl font-semibold">No observation ≠ no problem</h3><p className="mt-2 text-sm text-muted-foreground">A road without recent observations is not assumed to be healthy. UrbanPulse classifies it as <b className="text-foreground">UNKNOWN</b> and prioritizes coverage gaps for future observation.</p></div>
    <div className="grid grid-cols-2 gap-3 text-center">
      <div className="flex flex-col items-center gap-1.5"><span className={cn(step, "border-success/40")}>Recently observed</span><ArrowDown className="size-3 text-muted-foreground" /><span className={cn(step, "text-success")}>Known condition</span></div>
      <div className="flex flex-col items-center gap-1.5"><span className={step}>Not recently observed</span><ArrowDown className="size-3 text-muted-foreground" /><span className={cn(step, "text-unknown")}>Unknown</span><ArrowDown className="size-3 text-muted-foreground" /><span className={step}>Coverage gap</span><ArrowDown className="size-3 text-muted-foreground" /><span className={cn(step, "text-primary")}>Prioritized</span></div>
    </div>
  </section>;
}

/* ---------------- 10-stage workflow ---------------- */
const stages = [
  { i: Camera, l: "Observe", d: "Vehicle cameras continuously capture road conditions." },
  { i: Radar, l: "Detect", d: "AI identifies potholes, waterlogging, road damage and congestion." },
  { i: ScanLine, l: "Validate", d: "Repeated observations and cross-fleet evidence reduce false positives." },
  { i: MapPin, l: "Locate", d: "GPS and geospatial data identify the road segment and jurisdiction." },
  { i: Gauge, l: "Assess", d: "Severity, confidence and road impact are calculated." },
  { i: ListOrdered, l: "Prioritize", d: "Score weighs severity, traffic, confidence, road importance and coverage age." },
  { i: RouteIcon, l: "Route", d: "Assigned to the right department and contractor by ownership and warranty." },
  { i: Wrench, l: "Repair", d: "A work order is generated for the responsible authority." },
  { i: RefreshCw, l: "Re-observe", d: "Participating vehicles revisit the location." },
  { i: ShieldCheck, l: "Verify", d: "AI checks whether the repair actually resolved the issue." },
];
export function Workflow10() {
  const [a, setA] = useState(0);
  const S = stages[a]!;
  return <section className="panel">
    <div className="section-heading"><div><p className="eyebrow">Closed-loop workflow</p><h3>Observe → Verify</h3></div><span className="text-xs text-muted-foreground">Select a stage</span></div>
    <div className="grid grid-cols-5 gap-px overflow-hidden border border-border bg-border lg:grid-cols-10">
      {stages.map((s, i) => <button key={s.l} onClick={() => setA(i)} className={cn("flex flex-col items-center gap-1.5 bg-background px-1 py-3 text-[11px] font-semibold uppercase transition-colors", i === a ? "bg-primary text-primary-foreground" : i < a ? "text-primary" : "text-muted-foreground hover:bg-secondary")}><s.i className="size-4" />{s.l}</button>)}
    </div>
    <div key={a} className="mt-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"><span className="grid size-9 shrink-0 place-items-center bg-secondary text-primary"><S.i className="size-4" /></span><div><p className="text-xs text-muted-foreground">Stage {a + 1} of 10</p><strong>{S.l}</strong><p className="text-sm text-muted-foreground">{S.d}</p></div></div>
  </section>;
}

/* ---------------- Fleet Intelligence ---------------- */
function Bar({ label, v }: { label: string; v: number }) {
  return <div><div className="flex justify-between text-xs"><span className="font-semibold uppercase tracking-wide text-muted-foreground">{label}</span><b className="tabular-nums">{v}%</b></div><div className="mt-1.5 h-2.5 bg-secondary"><div className="h-full bg-primary transition-all duration-700" style={{ width: `${v}%` }} /></div></div>;
}
function VehicleCard({ v }: { v: Vehicle }) {
  const Icon = v.type === "Public Transit" ? BusFront : Truck;
  return <article className="panel flex flex-col gap-3">
    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center bg-secondary"><Icon className="size-4" /></span><div><strong className="block text-sm">{v.id}</strong><small className="text-muted-foreground">{v.type}</small></div></div>{v.status === "Offline" ? <span className="text-xs text-muted-foreground">Offline</span> : <SimLive />}</div>
    <p className="text-xs text-muted-foreground">{v.route}</p>
    <dl className="grid grid-cols-2 gap-2 text-xs">{[["Observations", v.observations], ["Detections", v.detections], ["Contribution", v.contribution + "%"], ["Segments", v.segments]].map(([k, x]) => <div key={k as string}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold tabular-nums">{x}</dd></div>)}</dl>
    <p className="text-[11px] text-muted-foreground">Last telemetry: {v.telemetry} · {v.status}</p>
  </article>;
}
export function FleetIntelligence() {
  return <div className="space-y-8">
    <div className="kpi-strip">{[["Total active vehicles", "30"], ["Public buses", "18"], ["Municipal vehicles", "12"], ["Road segments observed", "1,842"]].map(([l, v]) => <div className="kpi" key={l}><div><p>{l}</p><strong>{v}</strong></div><SimLive /></div>)}</div>
    <section className="panel grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4"><p className="eyebrow">Coverage comparison · simulated</p><Bar label="Public bus coverage" v={72} /><Bar label="Municipal fleet coverage" v={84} /><Bar label="Combined coverage" v={93} /></div>
      <div className="border border-success/30 bg-success-soft p-4 text-sm"><CheckCircle2 className="mb-2 text-success" /><strong>Multi-fleet insight</strong><p className="mt-1 text-muted-foreground">Municipal vehicles covered 21 road segments not recently observed by public buses.</p></div>
    </section>
    <section><div className="section-heading"><div><p className="eyebrow">A · Public transit</p><h2>Public buses</h2></div></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{publicBuses.map((v) => <VehicleCard key={v.id} v={v} />)}</div></section>
    <section><div className="section-heading"><div><p className="eyebrow">B · Municipal corporation</p><h2>Municipal vehicles</h2></div></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{municipalVehicles.map((v) => <VehicleCard key={v.id} v={v} />)}</div></section>
  </div>;
}

/* ---------------- Priority score ---------------- */
const factors = [{ l: "Severity", w: 35, s: 98 }, { l: "Traffic exposure", w: 25, s: 92 }, { l: "AI confidence", w: 15, s: 96 }, { l: "Coverage age", w: 15, s: 70 }, { l: "Road importance", w: 10, s: 90 }];
export function PriorityScore() {
  const score = Math.round(factors.reduce((a, f) => a + (f.w * f.s) / 100, 0));
  return <section className="panel">
    <div className="flex items-center justify-between"><p className="eyebrow">Priority scoring engine</p><span className="text-3xl font-semibold tabular-nums">{score}<small className="text-sm text-muted-foreground"> / 100</small></span></div>
    <div className="mt-4 space-y-3">{factors.map((f) => <div key={f.l}><div className="flex justify-between text-xs"><span>{f.l} <span className="text-muted-foreground">· weight {f.w}%</span></span><b className="tabular-nums">{f.s}</b></div><div className="mt-1 h-1.5 bg-secondary"><div className="h-full bg-destructive" style={{ width: `${f.s}%` }} /></div></div>)}</div>
    <p className="mt-4 text-xs text-muted-foreground">Priority is calculated using defect severity, traffic exposure, AI confidence, time since last observation, and road importance.</p>
  </section>;
}

/* ---------------- Location chain ---------------- */
export function LocationChain() {
  const chain = [["GPS", "13.0469, 80.1018"], ["Road", "Poonamallee High Road · Seg 42"], ["Ward", "Ward 15"], ["Zone", "Avadi Zone"], ["Authority", "Municipal Corporation"], ["Department", "Roads & Infrastructure"]];
  return <section className="panel"><p className="eyebrow">Location intelligence</p><h3 className="mt-1">Who is responsible?</h3>
    <ol className="mt-4 space-y-0">{chain.map(([k, v], i) => <li key={k} className="relative flex gap-3 pb-3 last:pb-0"><span className={cn("relative z-10 mt-1 size-2.5 shrink-0 rounded-full", i === chain.length - 1 ? "bg-primary" : "bg-muted-foreground/50")} />{i < chain.length - 1 && <span className="absolute left-[4.5px] top-3.5 h-full w-px bg-border" />}<div className="flex flex-1 justify-between gap-3 text-sm"><span className="text-xs font-semibold uppercase text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div></li>)}</ol>
  </section>;
}

/* ---------------- Warranty routing ---------------- */
export function WarrantyRouting() {
  const [active, setActive] = useState(true);
  return <section className="panel">
    <div className="flex items-center justify-between"><p className="eyebrow">Road contract & warranty</p><div className="control-group">{["Active", "Expired"].map((x) => <button key={x} onClick={() => setActive(x === "Active")} className={cn("control-chip", (x === "Active") === active && "control-chip-active")}>{x}</button>)}</div></div>
    <dl className="detail-list mt-4"><div><dt>Contractor</dt><dd>ABC Infrastructure Ltd.</dd></div><div><dt>Work order</dt><dd>TN-RD-2025-184</dd></div><div><dt>Construction date</dt><dd>{active ? "14 Feb 2025" : "14 Feb 2022"}</dd></div><div><dt>Warranty expiry</dt><dd>{active ? "14 Feb 2027" : "14 Feb 2024"}</dd></div><div><dt>Warranty status</dt><dd className={active ? "text-success" : "text-destructive"}>● {active ? "ACTIVE" : "EXPIRED"}</dd></div></dl>
    <div className="mt-4 border border-border bg-background p-4"><p className="eyebrow">Automatic routing</p><div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold"><span className="border border-border px-2 py-1"><Check className="mr-1 inline size-3 text-success" />Municipal Corporation</span>{active && <><span>+</span><span className="border border-border px-2 py-1"><Check className="mr-1 inline size-3 text-success" />ABC Infrastructure Ltd.</span></>}</div><p className="mt-2 text-xs text-muted-foreground">Reason: {active ? "Road defect detected within active warranty period." : "Warranty period has expired. No contractor responsibility notice is sent."}</p></div>
    <p className="mt-2 text-[11px] text-muted-foreground">Illustrative contract record · toggle to compare routing. Final responsibility decisions rest with a city officer.</p>
  </section>;
}

/* ---------------- Work order stepper ---------------- */
const woSteps = ["Detection", "Validated", "Prioritized", "Work order created", "Assigned", "Repair in progress", "Repair completed", "Awaiting verification", "Verified"];
const woActions: { l: string; to: number; msg: string }[] = [
  { l: "Generate Work Order", to: 3, msg: "Work order WO-1842 generated (simulated)" },
  { l: "Assign Authority", to: 4, msg: "Assigned to Roads & Infrastructure, Avadi Zone" },
  { l: "Notify Contractor", to: 5, msg: "ABC Infrastructure notified — warranty active (simulated)" },
  { l: "Mark Repair Complete", to: 6, msg: "Repair marked complete" },
  { l: "Trigger Re-Observation", to: 7, msg: "Bus 04 and MC-02 scheduled to re-observe" },
  { l: "Verify Repair", to: 8, msg: "Repair verified across 2/2 passes · 98%" },
];
export function WorkOrderStepper() {
  const [s, setS] = useState(2);
  return <section className="panel">
    <div className="section-heading"><div><p className="eyebrow">Action / work order</p><h3>{woSteps[s]}</h3></div><Button variant="ghost" size="sm" onClick={() => setS(2)}><RotateCcw />Reset</Button></div>
    <ol className="grid grid-cols-3 gap-1 sm:grid-cols-9">{woSteps.map((x, i) => <li key={x} className={cn("border-t-2 pt-2 text-[10px] font-semibold uppercase leading-tight transition-colors", i <= s ? "border-primary text-foreground" : "border-border text-muted-foreground")}>{x}</li>)}</ol>
    <div className="mt-4 flex flex-wrap gap-2">{woActions.map((a) => <Button key={a.l} size="sm" variant={a.to === s + 1 ? "default" : "outline"} disabled={a.to !== s + 1} onClick={() => { setS(a.to); toast.success(a.msg, { description: "Demo interaction · no real work order sent" }); }}>{a.l}</Button>)}<Button size="sm" variant="ghost" disabled={s < 3} onClick={() => toast("WO-1842 · Poonamallee High Road", { description: `Status: ${woSteps[s]} · Owner: Roads & Infrastructure` })}>View Work Order</Button></div>
  </section>;
}

/* ---------------- Road-camera video simulation ---------------- */
const demoSteps = [
  { title: "Route 62 observation", detail: "Bus 04 · Poonamallee High Road", phase: "OBSERVE", image: roadDefectImage },
  { title: "Road anomaly detected", detail: "Potential pothole cluster isolated", phase: "DETECT", image: roadDefectImage, detect: true },
  { title: "AI classification", detail: "Pothole cluster · confidence 96%", phase: "CLASSIFY", image: roadDefectImage, detect: true },
  { title: "Cross-fleet confirmation", detail: "Municipal vehicle MC-02 confirms", phase: "VALIDATE", image: roadDefectImage, detect: true },
  { title: "Road segment located", detail: "Ward 15 · Avadi Zone", phase: "LOCATE", image: roadDefectImage, detect: true },
  { title: "Warranty matched", detail: "Active road contract identified", phase: "ROUTE", image: roadDefectImage, detect: true },
  { title: "Municipality alerted", detail: "Work order WO-1842 generated", phase: "ACTION", image: roadDefectImage, detect: true },
  { title: "Repair recorded", detail: "Field team marked work complete", phase: "REPAIR", image: repairedRoadImage },
  { title: "Bus returns to segment", detail: "New Route 62 camera observation", phase: "RE-OBSERVE", image: repairedRoadImage },
  { title: "Repair verified", detail: "No recurring defect · confidence 98%", phase: "VERIFIED", image: repairedRoadImage, verified: true },
] as const;
export function DemoRunner({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (t.current) clearInterval(t.current); }, []);
  const stop = () => { if (t.current) clearInterval(t.current); t.current = null; setPlaying(false); };
  const run = () => {
    if (t.current) clearInterval(t.current);
    if (i >= demoSteps.length - 1) setI(0);
    setPlaying(true);
    t.current = setInterval(() => setI((x) => {
      if (x >= demoSteps.length - 1) { if (t.current) clearInterval(t.current); t.current = null; setPlaying(false); return x; }
      return x + 1;
    }), 1600);
  };
  const scene = demoSteps[i] ?? demoSteps[0];
  const done = i === demoSteps.length - 1;
  return <section className={cn("panel", !compact && "p-6")}>
    <div className="section-heading"><div><p className="eyebrow">Route 62 · road-camera simulation</p><h3>Detection to verified repair</h3></div><div className="flex items-center gap-2"><span className="demo-label">Illustrative footage</span><Button onClick={playing ? stop : run}>{playing ? <><Pause />Pause</> : done ? <><RotateCcw />Replay</> : <><Play />Play simulation</>}</Button></div></div>
    <div className="simulation-player">
      <img key={scene.image} src={scene.image} alt={scene.image === repairedRoadImage ? "Road-camera view after the simulated repair" : "Road-camera view of a detected pothole"} />
      <div className="simulation-vignette" />
      {scene.detect && <div className="simulation-detection-box"><span>POTHOLE · 96%</span></div>}
      <div className="simulation-topbar"><span><i /> SIMULATED CAMERA · BUS 04</span><span>ROUTE 62 · AVADI ZONE</span></div>
      <div className="simulation-readout"><span className={cn("simulation-phase", scene.verified && "simulation-phase-verified")}>{scene.phase}</span><strong>{scene.title}</strong><small>{scene.detail}</small></div>
      <div className="simulation-telemetry"><span>13.0469° N · 80.1018° E</span><span><Volume2 /> Road audio</span><time>14:{String(31 + i).padStart(2, "0")}:0{Math.min(i, 9)}</time></div>
    </div>
    <div className="simulation-controls">
      <Button size="icon" variant="outline" onClick={playing ? stop : run} aria-label={playing ? "Pause simulation" : "Play simulation"}>{playing ? <Pause /> : <Play />}</Button>
      <input aria-label="Simulation position" type="range" min="0" max={demoSteps.length - 1} value={i} onChange={(event) => { stop(); setI(Number(event.target.value)); }} />
      <span>{String(i * 2).padStart(2, "0")}:00 / 18:00</span>
    </div>
    <ol className="simulation-chapters">{demoSteps.map((step, index) => <li key={step.phase}><button type="button" onClick={() => { stop(); setI(index); }} className={cn(index === i && "is-active", index < i && "is-complete")} aria-label={`Show ${step.title}`}><span>{index < i ? <Check /> : index + 1}</span><small>{step.phase}</small></button></li>)}</ol>
    <p className="mt-3 text-xs text-muted-foreground">Image-based real-time simulation using illustrative road-camera frames. It is not a live MTC or municipal camera feed.</p>
  </section>;
}

/* ---------------- Inspection "why this route" ---------------- */
export function WhyRoute() {
  const f = ["Priority", "Severity", "Traffic exposure", "Coverage age", "Road importance", "Distance"];
  return <section className="panel"><p className="eyebrow">Why this route?</p><div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase">{f.map((x, i) => <span key={x} className="contents"><span className="border border-border px-2 py-1">{x}</span>{i < f.length - 1 && <span className="text-muted-foreground">+</span>}</span>)}<ArrowRight className="size-3" /><span className="bg-primary px-2 py-1 text-primary-foreground">Optimized route</span></div><p className="mt-3 text-sm text-muted-foreground">Route optimized to cover 5 high-priority coverage gaps and 3 critical defects while minimizing travel distance (simulated optimization).</p></section>;
}

/* ---------------- Coverage stats & gap ranking ---------------- */
export function CoverageStats() {
  const s = [["Road network", "1,842 km"], ["Observed", "1,334 km"], ["Unknown", "508 km"], ["Coverage", "72.4%"], ["Segments observed", "1,842"], ["Vehicles contributing", "30"], ["Observations · 24h", "2,444"], ["Coverage gaps", "27"]];
  const gaps = [["Perambur High Road", "18 days", "2.4 km"], ["Inner Ring Road", "11 days", "3.1 km"], ["Ambattur Industrial Road", "9 days", "1.8 km"]];
  return <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
    <section className="panel"><div className="flex items-center justify-between"><p className="eyebrow">Network coverage</p><span className="demo-label">Illustrative data</span></div><p className="mt-2 text-sm text-muted-foreground">72.4% of mapped road network observed within the selected time window.</p><div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">{s.map(([l, v]) => <div key={l} className="bg-background p-3"><p className="text-xs text-muted-foreground">{l}</p><strong className="text-lg tabular-nums">{v}</strong></div>)}</div></section>
    <section className="panel"><p className="eyebrow">Coverage gap ranking</p><ol className="mt-3 divide-y divide-border">{gaps.map(([n, t, k], i) => <li key={n} className="flex items-center gap-3 py-2.5 text-sm"><b className="w-4 tabular-nums">{i + 1}</b><span className="flex-1">{n}</span><span className="text-xs text-muted-foreground">{t} · {k}</span></li>)}</ol><Button className="mt-3 w-full" onClick={() => toast.success("Inspection route generated", { description: "3 gaps · 7.3 km · assigned to MC-04 (simulated)" })}><RouteIcon />Generate inspection route</Button></section>
  </div>;
}

/* ---------------- Analytics extras ---------------- */
export function DecisionAnalytics() {
  const k = [["Road network coverage", "72.4%"], ["Active detections", "27"], ["Repairs verified", "127"], ["Avg response time", "6h 18m"], ["Repeat defects", "14"], ["Cross-fleet confirmations", "86"]];
  const ins = ["Road health improved 8.4% this week.", "14 recurring defects detected.", "Avadi has the highest concentration of critical issues.", "Municipal vehicles contributed 21% additional road coverage."];
  return <div className="space-y-6">
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-3 xl:grid-cols-6">{k.map(([l, v]) => <div key={l} className="bg-background p-4"><p className="text-xs text-muted-foreground">{l}</p><strong className="text-2xl tabular-nums">{v}</strong></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="panel"><p className="eyebrow">Insights · simulated</p><ul className="mt-3 space-y-2 text-sm">{ins.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="size-4 shrink-0 text-primary" />{x}</li>)}</ul></section>
      <section className="panel"><p className="eyebrow">Fleet contribution</p><div className="mt-3 space-y-3"><div><div className="flex justify-between text-sm"><span><BusFront className="mr-1 inline size-4" />Public buses · 1,420 obs</span><b>58%</b></div><div className="mt-1 h-2 bg-secondary"><div className="h-full w-[58%] bg-primary" /></div></div><div><div className="flex justify-between text-sm"><span><Truck className="mr-1 inline size-4" />Municipal vehicles · 1,024 obs</span><b>42%</b></div><div className="mt-1 h-2 bg-secondary"><div className="h-full w-[42%] bg-info" /></div></div></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="border border-border p-2"><strong className="block text-lg">612</strong>Bus only</div><div className="border border-border p-2"><strong className="block text-lg">398</strong>Municipal only</div><div className="border border-border p-2"><strong className="block text-lg">832</strong>Jointly observed</div></div></section>
    </div>
  </div>;
}

/* ---------------- Dashboard extras ---------------- */
export function DashboardKpis() {
  const k = [["Road network coverage", "72.4%", "/coverage"], ["Active vehicles", "30", "/fleet"], ["Active detections", "27", "/detections"], ["Critical issues", "8", "/incidents"], ["Repairs verified", "127", "/verification"], ["Unknown road segments", "508", "/coverage"]];
  return <section className="kpi-strip">{k.map(([l, v, h]) => <a href={h} className="kpi hover:bg-secondary" key={l}><div><p>{l}</p><strong>{v}</strong></div><SimLive /></a>)}</section>;
}
export function RecentActivity() {
  const a = [["2 min", "MC-02 confirmed pothole cluster R62-014 (cross-fleet)"], ["6 min", "Work order WO-1842 routed to Municipal Corporation + ABC Infrastructure"], ["14 min", "Bus 04 re-observed Anna Salai 18A — repair verified"], ["22 min", "Coverage gap: Perambur High Road unobserved 18 days"], ["31 min", "Bus 01 detected waterlogging near Avadi (R62-021)"]];
  return <section className="panel"><div className="flex items-center justify-between"><p className="eyebrow">Recent activity</p><SimLive /></div><ul className="mt-3 divide-y divide-border">{a.map(([t, x]) => <li key={x} className="flex gap-3 py-2.5 text-sm"><span className="w-12 shrink-0 text-xs text-muted-foreground tabular-nums">{t}</span>{x}</li>)}</ul></section>;
}
export function ResponsibilityHint() {
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><CircleHelp className="inline size-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent>Simulated prototype data</TooltipContent></Tooltip></TooltipProvider>;
}
