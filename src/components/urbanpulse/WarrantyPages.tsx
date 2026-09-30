import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bell, BusFront, Check, CheckCircle2, CircleAlert, FileText, MapPin, Plus, RotateCcw, ShieldCheck } from "lucide-react";
import { AppShell, Page } from "./AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  acceptRepair, advanceRepair, completeRepair, confirmRepair, contractFor, contractorFor, contractors, disputeRequest, fmtDate, hasFlag,
  markAllViewed, municipalAction, notify, remainingText, resetSettings, roadContracts, setNotificationStatus, simulateDetection,
  simulateRecurrence, updateSettings, useWarrantyStore, warrantyOf, type Incident, type NotifStatus, type RoadContract, type WarrantyState,
} from "@/lib/warranty";

const wClass: Record<WarrantyState, string> = { active: "status-healthy", expiring: "status-aging", expired: "status-critical", unknown: "status-unknown" };
const wText: Record<WarrantyState, string> = { active: "Warranty active", expiring: "Warranty expiring soon", expired: "Warranty expired", unknown: "Warranty unknown" };
export function WarrantyBadge({ c }: { c?: RoadContract }) { const w = warrantyOf(c); return <span className={cn("status-badge", wClass[w.state])}><i />{wText[w.state]}</span>; }
function Sev({ v }: { v: string }) { return <span className={cn("severity", `severity-${v.toLowerCase()}`)}>{v}</span>; }
function Demo() { return <span className="demo-label">Illustrative data</span>; }
function Head({ eyebrow, title, right }: { eyebrow: string; title: string; right?: ReactNode }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><div className="flex flex-wrap items-center gap-2">{right}<Demo /></div></div>; }
function Row({ k, v }: { k: string; v: ReactNode }) { return <div><dt>{k}</dt><dd>{v}</dd></div>; }
const Disclaimer = () => <p className="mt-3 border-l-2 border-warning pl-3 text-xs text-muted-foreground">Contract records indicate this contractor is associated with this road segment. Review applicable contract terms — only an authorised municipal officer makes the final responsibility determination.</p>;

/* ---------------- Overview KPIs ---------------- */
export function WarrantyKpis() {
  const s = useWarrantyStore(); const inc = s.incidents; const rep = Object.values(s.repairs);
  const ws = (st: WarrantyState[]) => inc.filter((i) => st.includes(warrantyOf(contractFor(i.segment)).state)).length;
  const k = [
    ["Damage detected today", inc.length, "/incidents"], ["Critical", inc.filter((i) => i.severity === "Critical").length, "/incidents"],
    ["Under warranty", ws(["active", "expiring"]), "/warranty"], ["Warranty expired", ws(["expired"]), "/warranty"], ["Warranty unknown", ws(["unknown"]), "/warranty"],
    ["Contractors notified", s.notifications.filter((n) => n.recipient === "Contractor").length, "/notifications"], ["Repairs requested", rep.length, "/incidents"],
    ["Repairs completed", rep.filter((r) => ["Completed", "Awaiting Verification", "Verified"].includes(r.status)).length, "/incidents"],
    ["Awaiting verification", rep.filter((r) => r.status === "Awaiting Verification").length, "/incidents"], ["Recurring damage", inc.filter((i) => i.recurring).length, "/incidents"],
  ] as const;
  return <section className="mt-6"><Head eyebrow="Damage, contracts & repairs" title="Road damage accountability" /><div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-5">{k.map(([l, v, to]) => <Link key={l} to={to} className="bg-card p-4 transition-colors hover:bg-secondary"><p className="text-xs text-muted-foreground">{l}</p><strong className="mt-1 block text-2xl tabular-nums">{v}</strong></Link>)}</div></section>;
}

/* ---------------- Incidents ---------------- */
export function IncidentsPage() {
  const s = useWarrantyStore(); const nav = useNavigate();
  return <AppShell title="Road Damage Incidents" subtitle="Automatically created from bus detections, routed by contract and warranty."><Page>
    <Head eyebrow={`${s.incidents.length} incidents`} title="Incident register" right={<Button onClick={() => { const id = simulateDetection(); nav({ to: "/incidents/$id", params: { id } }); }}><Plus />Simulate bus detection</Button>} />
    <div className="table-wrap"><table><thead><tr><th>Incident</th><th>Road · Segment</th><th>Severity</th><th>Confidence</th><th>Contractor</th><th>Warranty</th><th>Status</th></tr></thead><tbody>
      {s.incidents.map((i) => { const c = contractFor(i.segment); return <tr key={i.id}><td><Link to="/incidents/$id" params={{ id: i.id }} className="font-medium hover:text-primary">{i.id}</Link><small>{i.type}{i.recurring && " · recurring"}</small></td><td>{i.road}<small>{i.segment} · {i.bus}</small></td><td><Sev v={i.severity} /></td><td className="tabular-nums">{i.confidence}%</td><td>{contractorFor(c?.contractorId)?.name ?? "Not on record"}</td><td><WarrantyBadge c={c} /></td><td>{i.status}</td></tr>; })}
    </tbody></table></div>
  </Page></AppShell>;
}

export function IncidentDetailPage({ id }: { id: string }) {
  const s = useWarrantyStore(); const nav = useNavigate(); const i = s.incidents.find((x) => x.id === id);
  if (!i) return <AppShell title="Incident not found" subtitle=""><Page><p>No incident {id}. <Link to="/incidents" className="text-primary">Back to incidents</Link></p></Page></AppShell>;
  const c = contractFor(i.segment); const ctr = contractorFor(c?.contractorId); const w = warrantyOf(c); const rc = s.repairs[i.id]; const audit = s.audit[i.id] ?? [];
  const notes = s.notifications.filter((n) => n.incidentId === i.id);
  return <AppShell title={`${i.id} · ${i.type}`} subtitle={`${i.road} — Segment ${i.segment}`}><Page>
    <div className="mb-4 flex flex-wrap items-center gap-2"><Sev v={i.severity} /><span className="status-badge status-observed"><i />{i.status}</span><WarrantyBadge c={c} />{i.recurring && <span className="status-badge status-critical"><i />Recurring · {i.recurring.similarity}% similar</span>}<Demo /></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]"><div className="space-y-6">
      <section className="panel"><p className="eyebrow">Location & detection</p><dl className="detail-list mt-3"><Row k="Road" v={i.road} /><Row k="Segment" v={<Link to="/roads/$segment" params={{ segment: i.segment }} className="text-primary">{i.segment}</Link>} /><Row k="GPS" v={`${i.lat.toFixed(4)}, ${i.lng.toFixed(4)}`} /><Row k="Damage type" v={i.type} /><Row k="AI confidence" v={`${i.confidence}%`} /><Row k="First / last detected" v={`${i.date} · ${i.first} / ${i.last}`} /><Row k="Detected by" v={`${i.bus} · ${i.route}`} /><Row k="Buses confirming" v={i.buses} /></dl>
        <a className="mt-3 inline-flex items-center gap-1 text-sm text-primary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${i.lat},${i.lng}`}><MapPin className="size-4" />Open location in Google Maps</a></section>
      <section className="panel"><p className="eyebrow">Contract & warranty</p>{c ? <dl className="detail-list mt-3"><Row k="Contractor" v={ctr ? <Link to="/contractors/$id" params={{ id: ctr.id }} className="text-primary">{ctr.name}</Link> : "Not on record"} /><Row k="Project" v={c.projectId ? `${c.projectName} — ${c.projectId}` : "Unknown"} /><Row k="Contract ref." v={c.tender ?? "Unknown"} /><Row k="Warranty" v={`${fmtDate(c.warrantyStart)} → ${fmtDate(c.warrantyEnd)}`} /><Row k="Status" v={w.label} /></dl> : <p className="mt-2 text-sm">No contract record.</p>}<Disclaimer /></section>
      <section className="panel"><p className="eyebrow">Audit log</p><ol className="mt-3 space-y-3 border-l border-border pl-4">{audit.map((a, n) => <li key={n} className="text-sm"><span className="tabular-nums text-muted-foreground">{a.time}</span> · {a.text} <small className="text-muted-foreground">— {a.actor}</small></li>)}</ol></section>
    </div>
    <aside className="space-y-6 self-start">
      <section className="panel"><p className="eyebrow">Automated routing</p><p className="mt-2 text-sm font-medium">{w.state === "unknown" ? "Contract verification task created for admin review" : w.state === "expired" ? "Municipality notified — maintenance process" : "Municipality and contractor notified — repair requested"}</p>
        <div className="mt-4 grid gap-2">
          {(w.state === "active" || w.state === "expiring") && !rc && <><Button onClick={() => acceptRepair(i.id)}><Check />Accept repair request (contractor)</Button><Button variant="outline" onClick={() => disputeRequest(i.id)}>Dispute / request review</Button></>}
          {w.state !== "active" && w.state !== "expiring" && <>{(["Inspection", "Maintenance request", "Officer assigned"] as const).map((a) => <Button key={a} variant="outline" disabled={hasFlag(s, i.id, a)} onClick={() => municipalAction(i.id, a)}>{hasFlag(s, i.id, a) ? <Check /> : null}{a === "Inspection" ? "Create inspection" : a === "Maintenance request" ? "Create maintenance request" : "Assign officer"}</Button>)}{!rc && <Button onClick={() => acceptRepair(i.id)}>Open repair case</Button>}</>}
          <div className="grid grid-cols-2 gap-2"><Button variant="ghost" onClick={() => notify(i.id, "Municipality")}><Bell />Municipality</Button><Button variant="ghost" onClick={() => notify(i.id, "Contractor")}><Bell />Contractor</Button></div>
        </div></section>
      {rc && <section className="panel"><div className="flex items-center justify-between"><p className="eyebrow">Repair case {rc.id}</p><span className="status-badge status-observed"><i />{rc.status}</span></div>
        <dl className="detail-list mt-3"><Row k="Owner" v={rc.owner} /><Row k="Assigned" v={fmtDate(rc.assigned)} /><Row k="Target" v={fmtDate(rc.target)} /><Row k="Completed" v={fmtDate(rc.actual)} /><Row k="Reviewer" v={rc.reviewer} /></dl>
        {rc.verification && <div className="mt-4 border border-success/30 bg-success-soft p-3 text-sm"><strong className="flex items-center gap-2"><BusFront className="size-4" />{rc.verification.bus} re-observed</strong><p>{rc.verification.result} · {rc.verification.confidence}% confidence</p></div>}
        <div className="mt-4 grid gap-2">
          {["Requested", "Acknowledged", "Scheduled", "In Progress"].includes(rc.status) && <Button onClick={() => advanceRepair(i.id)}>Advance status</Button>}
          {["Scheduled", "In Progress"].includes(rc.status) && <Button variant="outline" onClick={() => completeRepair(i.id)}>Mark repair completed</Button>}
          {rc.status === "Awaiting Verification" && <><Button onClick={() => confirmRepair(i.id, "confirm")}><CheckCircle2 />Confirm repair</Button><Button variant="outline" onClick={() => confirmRepair(i.id, "reinspect")}>Request reinspection</Button><Button variant="outline" onClick={() => confirmRepair(i.id, "not-repaired")}>Mark not repaired</Button></>}
          {rc.status === "Verified" && <Button variant="outline" onClick={() => { const nid = simulateRecurrence(i.id); if (nid) nav({ to: "/incidents/$id", params: { id: nid } }); }}><RotateCcw />Simulate recurring damage</Button>}
        </div></section>}
      <section className="panel"><p className="eyebrow">Notifications ({notes.length})</p><ul className="mt-3 space-y-2 text-sm">{notes.map((n) => <li key={n.id} className="flex justify-between gap-2"><span>{n.to}<small className="block text-muted-foreground">{n.category}</small></span><span className="text-xs">{n.status}</span></li>)}</ul></section>
    </aside></div>
  </Page></AppShell>;
}

/* ---------------- Contracts / Road detail ---------------- */
export function RoadContractsPage() {
  const nav = useNavigate(); useWarrantyStore();
  return <AppShell title="Road Contracts" subtitle="Construction, contractor and warranty records per road segment."><Page>
    <Head eyebrow={`${roadContracts.length} segments`} title="Road contract register" />
    <div className="table-wrap"><table><thead><tr><th>Road</th><th>Segment</th><th>Contractor</th><th>Project</th><th>Completed</th><th>Warranty end</th><th>Status</th></tr></thead><tbody>
      {roadContracts.map((c) => <tr key={c.segment} className="cursor-pointer" tabIndex={0} onClick={() => nav({ to: "/roads/$segment", params: { segment: c.segment } })} onKeyDown={(e) => e.key === "Enter" && nav({ to: "/roads/$segment", params: { segment: c.segment } })}><td className="font-medium">{c.road}</td><td>{c.segment}</td><td>{contractorFor(c.contractorId)?.name ?? "Unknown"}</td><td>{c.projectId ?? "—"}</td><td>{fmtDate(c.completed)}</td><td>{fmtDate(c.warrantyEnd)}</td><td><WarrantyBadge c={c} /></td></tr>)}
    </tbody></table></div>
  </Page></AppShell>;
}

export function RoadDetailPage({ segment }: { segment: string }) {
  const s = useWarrantyStore(); const c = contractFor(segment);
  if (!c) return <AppShell title="Segment not found" subtitle=""><Page><Link to="/contracts" className="text-primary">Back to road contracts</Link></Page></AppShell>;
  const ctr = contractorFor(c.contractorId); const w = warrantyOf(c); const open = s.incidents.filter((i) => i.segment === segment && i.status !== "Closed"); const first = open[0];
  const tl: [string, string | undefined, boolean][] = [["Construction started", fmtDate(c.started), !!c.started], ["Construction completed", fmtDate(c.completed), !!c.completed], ["Warranty started", fmtDate(c.warrantyStart), !!c.warrantyStart], ["Damage detected", first ? `${first.id} · ${first.first}` : undefined, !!first], ["Contractor notified", undefined, !!first && s.notifications.some((n) => n.incidentId === first.id && n.recipient === "Contractor")], ["Repair requested", first && s.repairs[first.id]?.id, !!first && !!s.repairs[first.id]], ["Repair completed", first && fmtDate(s.repairs[first.id]?.actual), !!first && !!s.repairs[first.id]?.actual], ["Bus re-observed", first && s.repairs[first.id]?.verification?.bus, !!first && !!s.repairs[first.id]?.verification], ["Repair verified", undefined, !!first && s.repairs[first.id]?.status === "Verified"], ["Warranty end", fmtDate(c.warrantyEnd), w.state === "expired"]];
  return <AppShell title={`${c.road} — ${c.segment}`} subtitle={`${c.municipality} · ${c.zone}`}><Page>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><div className="space-y-6">
      <section className="kpi-strip">{[["Coverage", `${c.coverage}%`], ["Last observation", c.lastObservation], ["Active issues", open.length], ["Previous observations", c.previousObservations], ["Previous repairs", c.previousRepairs]].map(([l, v]) => <div className="kpi" key={l}><div><p>{l}</p><strong>{v}</strong></div></div>)}</section>
      <section className="panel"><Head eyebrow="Construction information" title={ctr?.name ?? "Contractor not on record"} right={<WarrantyBadge c={c} />} /><dl className="detail-list"><Row k="Project" v={c.projectId ? `${c.projectName} — ${c.projectId}` : "Unknown"} /><Row k="Tender" v={c.tender ?? "Unknown"} /><Row k="Authority" v={c.authority} /><Row k="Completion" v={fmtDate(c.completed)} /><Row k="Warranty" v={w.label} /><Row k="Maintenance" v={c.maintenance} /><Row k="Documents" v={c.documents.join(", ") || "None on file"} /></dl><Disclaimer /></section>
      <section className="panel"><p className="eyebrow">Warranty timeline</p><ol className="mt-4 space-y-3">{tl.map(([l, d, done]) => <li key={l} className="flex items-center gap-3 text-sm"><span className={cn("grid size-6 place-items-center rounded-full border", done ? "border-success bg-success-soft text-success" : "border-border text-muted-foreground")}>{done ? <Check className="size-3.5" /> : null}</span><span className={cn("flex-1", !done && "text-muted-foreground")}>{l}</span><span className="tabular-nums text-muted-foreground">{d && d !== "Unknown" ? d : ""}</span></li>)}</ol></section>
    </div>
    <aside className="space-y-6 self-start"><section className="panel"><p className="eyebrow">Actions</p><div className="mt-3 grid gap-2">
      {first ? <><Button asChild><Link to="/incidents/$id" params={{ id: first.id }}>View incident {first.id}</Link></Button><Button variant="outline" disabled={hasFlag(s, first.id, "Inspection")} onClick={() => municipalAction(first.id, "Inspection")}>Create inspection</Button><Button variant="outline" onClick={() => notify(first.id, "Contractor")}>Notify contractor</Button><Button variant="outline" onClick={() => notify(first.id, "Municipality")}>Notify municipality</Button></> : <p className="text-sm text-muted-foreground">No open issues on this segment.</p>}
      {ctr && <Button variant="ghost" asChild><Link to="/contractors/$id" params={{ id: ctr.id }}><FileText />View contractor</Link></Button>}
    </div></section>
    <section className="panel"><p className="eyebrow">Open issues</p><ul className="mt-3 space-y-2 text-sm">{open.map((i) => <li key={i.id}><Link to="/incidents/$id" params={{ id: i.id }} className="text-primary">{i.id}</Link> · {i.type} · {i.status}</li>)}{!open.length && <li className="text-muted-foreground">None</li>}</ul></section></aside></div>
  </Page></AppShell>;
}

/* ---------------- Contractors ---------------- */
function statsFor(id: string, incidents: Incident[], repairs: Record<string, { status: string; contractorId?: string | undefined }>) {
  const segs = roadContracts.filter((c) => c.contractorId === id); const ws = segs.map((c) => warrantyOf(c).state); const segIds = segs.map((c) => c.segment); const rs = Object.values(repairs).filter((r) => r.contractorId === id);
  return { segs, under: ws.filter((x) => x === "active" || x === "expiring").length, expired: ws.filter((x) => x === "expired").length, open: incidents.filter((i) => segIds.includes(i.segment) && i.status !== "Closed").length, requests: rs.length, pending: rs.filter((r) => !["Verified", "Awaiting Verification"].includes(r.status)).length, verified: rs.filter((r) => r.status === "Verified").length };
}
export function ContractorsPage() {
  const s = useWarrantyStore();
  return <AppShell title="Contractors" subtitle="Factual operational records — no rankings or blame scores."><Page><Head eyebrow={`${contractors.length} contractors`} title="Contractor directory" />
    <div className="grid gap-3 md:grid-cols-2">{contractors.map((c) => { const st = statsFor(c.id, s.incidents, s.repairs); return <Link key={c.id} to="/contractors/$id" params={{ id: c.id }} className="panel block hover:border-primary"><p className="eyebrow">{c.id}</p><h3 className="mt-1">{c.name}</h3><div className="mt-3 grid grid-cols-4 gap-2 text-xs">{[["Segments", st.segs.length], ["Under warranty", st.under], ["Open incidents", st.open], ["Repairs", st.requests]].map(([l, v]) => <div key={l}><span className="text-muted-foreground">{l}</span><strong className="block text-lg tabular-nums">{v}</strong></div>)}</div></Link>; })}</div>
  </Page></AppShell>;
}
export function ContractorDetailPage({ id }: { id: string }) {
  const s = useWarrantyStore(); const c = contractorFor(id);
  if (!c) return <AppShell title="Contractor not found" subtitle=""><Page><Link to="/contractors" className="text-primary">Back</Link></Page></AppShell>;
  const st = statsFor(id, s.incidents, s.repairs);
  return <AppShell title={c.name} subtitle={`${c.id} · ${c.registration}`}><Page>
    <section className="kpi-strip">{[["Roads under warranty", st.under], ["Expired warranties", st.expired], ["Open incidents", st.open], ["Repair requests", st.requests], ["Pending repairs", st.pending], ["Verified repairs", st.verified]].map(([l, v]) => <div className="kpi" key={l}><div><p>{l}</p><strong>{v}</strong></div></div>)}</section>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><section><Head eyebrow="Projects" title="Associated road segments" /><div className="table-wrap"><table><thead><tr><th>Road</th><th>Project</th><th>Completed</th><th>Warranty</th><th>Documents</th></tr></thead><tbody>{st.segs.map((r) => <tr key={r.segment}><td><Link to="/roads/$segment" params={{ segment: r.segment }} className="font-medium hover:text-primary">{r.road}</Link><small>{r.segment}</small></td><td>{r.projectId}<small>{r.projectName}</small></td><td>{fmtDate(r.completed)}</td><td><WarrantyBadge c={r} /></td><td>{r.documents.join(", ") || "—"}</td></tr>)}</tbody></table></div></section>
      <aside className="panel self-start"><p className="eyebrow">Contact (fictional)</p><dl className="detail-list mt-3"><Row k="Contact" v={c.contact} /><Row k="Email" v={c.email} /><Row k="Phone" v={c.phone} /><Row k="Address" v={c.address} /></dl><p className="mt-3 text-xs text-muted-foreground">Demo contractor — not a real company record.</p></aside></div>
  </Page></AppShell>;
}

/* ---------------- Warranty ---------------- */
export function WarrantyPage() {
  useWarrantyStore(); const groups: WarrantyState[] = ["expiring", "active", "expired", "unknown"];
  return <AppShell title="Warranty" subtitle="Automatic warranty checks against today's date."><Page><Head eyebrow="Warranty status" title="Warranty overview" />
    <div className="grid gap-6 lg:grid-cols-2">{groups.map((g) => { const list = roadContracts.filter((c) => warrantyOf(c).state === g); return <section key={g} className="panel"><div className="flex items-center justify-between"><span className={cn("status-badge", wClass[g])}><i />{wText[g]}</span><strong className="tabular-nums">{list.length}</strong></div>
      <ul className="mt-3 divide-y divide-border">{list.map((c) => { const w = warrantyOf(c); return <li key={c.segment} className="py-2"><Link to="/roads/$segment" params={{ segment: c.segment }} className="flex justify-between gap-3 text-sm hover:text-primary"><span>{c.road} · {c.segment}</span><span className="text-muted-foreground">{g === "unknown" ? "Verify records" : g === "expired" ? `Ended ${fmtDate(c.warrantyEnd)}` : `${remainingText(w.days)} left`}</span></Link></li>; })}{!list.length && <li className="py-2 text-sm text-muted-foreground">None</li>}</ul></section>; })}</div>
  </Page></AppShell>;
}

/* ---------------- Notifications ---------------- */
const nextStatus: Partial<Record<NotifStatus, NotifStatus>> = { Pending: "Viewed", Sent: "Viewed", Viewed: "Acknowledged", "Action Required": "Acknowledged", Acknowledged: "Resolved" };
export function NotificationsPage() {
  const s = useWarrantyStore();
  return <AppShell title="Notifications" subtitle="Alerts routed to the municipality, contractors and admins."><Page>
    <Head eyebrow={`${s.notifications.filter((n) => n.status !== "Resolved").length} open`} title="Notification center" right={<Button variant="outline" onClick={markAllViewed}>Mark all viewed</Button>} />
    <p className="mb-4 text-xs text-muted-foreground">Demo environment — no emails or messages are actually sent.</p>
    <div className="space-y-3">{s.notifications.map((n) => { const ns = nextStatus[n.status]; return <article key={n.id} className="panel flex flex-col gap-3 sm:flex-row sm:items-start">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-md", /Critical|failed|expired|Recurring/.test(n.category) ? "bg-destructive/10 text-destructive" : "bg-secondary")}>{/Verification/.test(n.category) ? <ShieldCheck className="size-4" /> : <CircleAlert className="size-4" />}</span>
      <div className="min-w-0 flex-1"><p className="eyebrow">{n.category} · to {n.recipient}: {n.to} · {n.time}</p><strong className="block">{n.title}</strong><p className="text-sm text-muted-foreground">{n.message}</p>
        <div className="mt-2 flex flex-wrap gap-2">{n.incidentId && <Button size="sm" variant="ghost" asChild><Link to="/incidents/$id" params={{ id: n.incidentId }}>View incident</Link></Button>}{n.segment && <Button size="sm" variant="ghost" asChild><Link to="/roads/$segment" params={{ segment: n.segment }}>View road contract</Link></Button>}{ns && <Button size="sm" variant="outline" onClick={() => setNotificationStatus(n.id, ns)}>Mark {ns.toLowerCase()}</Button>}</div></div>
      <span className="text-xs font-medium">{n.status}</span></article>; })}</div>
  </Page></AppShell>;
}

/* ---------------- Settings ---------------- */
export function SettingsPage() {
  const { settings: st } = useWarrantyStore();
  const num = (k: "expiryWarningDays" | "contractorResponseHours" | "repairDeadlineDays" | "escalationHours" | "verificationPasses", l: string, unit: string) => <label className="block text-sm"><span className="text-muted-foreground">{l}</span><div className="mt-1 flex items-center gap-2"><input type="number" min={1} value={st[k]} onChange={(e) => updateSettings({ [k]: Math.max(1, Number(e.target.value) || 1) })} className="h-10 w-28 rounded-md border border-input bg-background px-3" /><span>{unit}</span></div></label>;
  return <AppShell title="Settings" subtitle="Warranty, notification and verification rules."><Page><Head eyebrow="Configuration" title="Warranty settings" right={<Button variant="outline" onClick={resetSettings}>Reset defaults</Button>} />
    <div className="grid gap-6 lg:grid-cols-2"><section className="panel space-y-4">{num("expiryWarningDays", "Warranty expiry warning", "days")}{num("contractorResponseHours", "Contractor response deadline", "hours")}{num("repairDeadlineDays", "Repair deadline", "days")}{num("escalationHours", "Escalation time", "hours")}{num("verificationPasses", "Verification required", "bus observations")}</section>
      <section className="panel space-y-4">{([["notifyMunicipality", "Automatically notify municipality"], ["notifyContractor", "Automatically notify contractor when warranty is active"]] as const).map(([k, l]) => <label key={k} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={st[k]} onChange={(e) => updateSettings({ [k]: e.target.checked })} className="size-4" />{l}</label>)}
        <label className="block text-sm"><span className="text-muted-foreground">Municipality contact</span><input value={st.municipalityContact} onChange={(e) => updateSettings({ municipalityContact: e.target.value })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3" /></label>
        <p className="text-xs text-muted-foreground">Contractor contacts are managed on each contractor profile. Settings apply to this browser session only.</p></section></div>
  </Page></AppShell>;
}
