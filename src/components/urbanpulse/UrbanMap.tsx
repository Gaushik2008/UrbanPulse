import { useState } from "react";
import { Bus, ChevronRight, Layers3, LocateFixed, Minus, Plus, X } from "lucide-react";
import { roads, type RoadSegment, type RoadStatus } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusClass: Record<RoadStatus,string> = {healthy:"stroke-success",observed:"stroke-info",aging:"stroke-warning",attention:"stroke-warning",critical:"stroke-destructive",unknown:"stroke-unknown"};
const dotClass: Record<RoadStatus,string> = {healthy:"bg-success",observed:"bg-info",aging:"bg-warning",attention:"bg-warning",critical:"bg-destructive",unknown:"bg-unknown"};
const statusLabel: Record<RoadStatus,string> = {healthy:"Healthy",observed:"Observed",aging:"Aging",attention:"Attention",critical:"Critical",unknown:"Unknown"};

export function UrbanMap({coverage=false, route=false, compact=false}:{coverage?:boolean;route?:boolean;compact?:boolean}) {
 const [selected,setSelected]=useState<RoadSegment|null>(null);
 const [layer,setLayer]=useState(coverage?"Coverage":"Road condition");
 const [period,setPeriod]=useState("Live");
 return <div className={cn("map-shell relative overflow-hidden border border-border bg-map",compact?"h-[420px]":"h-[560px]")}>
  <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
   {!coverage && <div className="control-group">{["Live","24h","7d","30d"].map(v=><button key={v} onClick={()=>setPeriod(v)} className={cn("control-chip",period===v&&"control-chip-active")}>{v}</button>)}</div>}
   <div className="control-group"><Layers3 className="size-3.5 text-muted-foreground" />{[coverage?"Coverage":"Road condition","Bus routes","Detections"].map(v=><button key={v} onClick={()=>setLayer(v)} className={cn("control-chip",layer===v&&"control-chip-active")}>{v}</button>)}</div>
  </div>
  <svg viewBox="0 0 1020 660" className="h-full w-full" role="img" aria-label="Interactive demonstration map of Chennai road observations">
   <rect width="1020" height="660" className="pointer-events-none fill-map"/>
   <path d="M0 85 H1020 M0 245 H1020 M0 420 H1020 M0 590 H1020 M180 0 V660 M360 0 V660 M600 0 V660 M835 0 V660" className="pointer-events-none stroke-map-grid" strokeWidth="1"/>
   <path d="M0 115 C180 160 280 75 430 115 S760 230 1020 120 M0 390 C200 330 320 440 520 380 S790 300 1020 350 M260 0 C240 170 340 270 300 660 M780 0 C760 190 690 300 820 660" className="pointer-events-none fill-none stroke-map-road" strokeWidth="18"/>
   {roads.map(r=><g key={r.id} onClick={()=>setSelected(r)} className="cursor-pointer outline-none" role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')setSelected(r)}} aria-label={`${r.name}, ${statusLabel[r.status]}`}>
    <path d={r.path} className="fill-none stroke-map-casing" strokeWidth={selected?.id===r.id?13:10}/>
    <path d={r.path} className={cn("fill-none transition-all duration-300",statusClass[r.status],r.status==="unknown"&&"stroke-dashed")} strokeWidth={selected?.id===r.id?8:6}/>
   </g>)}
   <text x="62" y="44" className="map-label">PERAMBUR</text><text x="438" y="380" className="map-label">T. NAGAR</text><text x="736" y="458" className="map-label">ADYAR</text><text x="185" y="455" className="map-label">MYLAPORE</text>
   {[{x:290,y:270,n:"04"},{x:540,y:185,n:"07"},{x:700,y:440,n:"11"}].map(b=><g key={b.n} transform={`translate(${b.x} ${b.y})`}><circle r="15" className="fill-primary stroke-primary-foreground" strokeWidth="3"/><text textAnchor="middle" y="4" className="fill-primary-foreground text-[10px] font-bold">{b.n}</text></g>)}
   {route&&<><path d="M210 525 C330 455 430 470 510 405 S650 300 770 215" className="fill-none stroke-primary" strokeWidth="5" strokeDasharray="10 8"/>{[{x:210,y:525,n:"D"},{x:370,y:455,n:"1"},{x:510,y:405,n:"2"},{x:650,y:300,n:"3"},{x:770,y:215,n:"4"}].map(p=><g key={p.n} transform={`translate(${p.x} ${p.y})`}><circle r="16" className="fill-foreground stroke-background" strokeWidth="3"/><text textAnchor="middle" y="5" className="fill-background text-xs font-bold">{p.n}</text></g>)}</>}
  </svg>
  <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-3 rounded-md border border-border bg-background/95 px-3 py-2 text-[11px] shadow-sm backdrop-blur-sm">
   {(["healthy","observed","aging","critical","unknown"] as RoadStatus[]).map(s=><span key={s} className="flex items-center gap-1.5"><i className={cn("size-2 rounded-full",dotClass[s])}/>{statusLabel[s]}</span>)}
  </div>
  <div className="absolute bottom-4 right-4 z-10 flex flex-col border border-border bg-background shadow-sm"><Button variant="ghost" size="icon" aria-label="Zoom in"><Plus/></Button><Button variant="ghost" size="icon" aria-label="Zoom out"><Minus/></Button><Button variant="ghost" size="icon" aria-label="Locate"><LocateFixed/></Button></div>
  {selected&&<aside className="absolute inset-y-0 right-0 z-20 w-full max-w-sm border-l border-border bg-background p-5 shadow-panel animate-in slide-in-from-right duration-200">
   <div className="flex items-start justify-between"><div><p className="eyebrow">Road segment</p><h3 className="mt-1 text-lg font-semibold">{selected.name}</h3><p className="text-sm text-muted-foreground">{selected.code}</p></div><Button variant="ghost" size="icon" onClick={()=>setSelected(null)} aria-label="Close road details"><X/></Button></div>
   <div className="mt-6 flex items-center justify-between border-y border-border py-4"><span className="text-sm text-muted-foreground">Status</span><Status status={selected.status}/></div>
   <dl className="detail-list"><div><dt>Last observed</dt><dd>{selected.lastObserved}</dd></div><div><dt>Observation frequency</dt><dd>{selected.frequency}</dd></div><div><dt>Road health</dt><dd>{selected.health||"—"} / 100</dd></div><div><dt>Issue detected</dt><dd>{selected.issue||"No active issue"}</dd></div><div><dt>Traffic exposure</dt><dd>{selected.traffic}</dd></div><div><dt>Risk score</dt><dd>{selected.risk}</dd></div></dl>
   <div className="mt-5 border border-warning/30 bg-warning-soft p-4"><p className="eyebrow text-warning-foreground">Next recommended action</p><p className="mt-1 font-semibold">{selected.status==="unknown"?"Schedule observation route":"Inspect within 24 hours"}</p></div>
   <div className="mt-5 grid gap-2"><Button> Create inspection <ChevronRight/></Button><Button variant="outline">View history</Button><Button variant="ghost">View detections</Button></div>
  </aside>}
 </div>
}
export function Status({status}:{status:RoadStatus}){return <span className={cn("status-badge",`status-${status}`)}><i/>{statusLabel[status]}</span>}
