import { useEffect, useRef, useState } from "react";
import { BusFront, CircleAlert, LocateFixed, Minus, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMapFilterView, mapFilters, type MapFilter } from "@/lib/map-filters";
import { route62Defects, sendRepairAlert, useRepairAlerts, type Route62Defect } from "@/lib/route62-defects";
import { roadSignDataUrl, RoadSignIcon } from "./RoadSign";

type LatLng = { lat: number; lng: number };
type MapInstance = {
  fitBounds: (bounds: unknown, padding?: number) => void;
  panTo: (position: LatLng) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number | undefined;
};
type MarkerInstance = {
  setPosition: (position: LatLng) => void;
  setMap: (map: MapInstance | null) => void;
  setIcon?: (icon: unknown) => void;
  addListener?: (event: string, fn: () => void) => void;
};
type PolylineInstance = { setMap: (map: MapInstance | null) => void; setOptions: (options: Record<string, unknown>) => void };
type GoogleMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => MapInstance;
  Marker: new (options: Record<string, unknown>) => MarkerInstance;
  Polyline: new (options: Record<string, unknown>) => PolylineInstance;
  LatLngBounds: new () => { extend: (position: LatLng) => void };
  Size: new (w: number, h: number) => unknown;
  Point: new (x: number, y: number) => unknown;
  geometry: { encoding: { decodePath: (encoded: string) => LatLng[] } };
};

declare global {
  interface Window {
    google?: { maps: GoogleMapsApi };
    initUrbanPulseMap?: () => void;
  }
}

const ROUTE_62_POLYLINE = "khsnAcnzgNYAF}AAyA?]GQYILoCFqCgFCyBE}CA{BEq@zGC|CNpELj@fApDl@`CPdBVnA`@`EX`Cd@pC`@zBb@dBDb@AN\\bEPvDFr@\\|Bb@|BnAtE`Az@`@Pb@Bb@C`@QXYR_@Fe@Ce@Ka@SWa@Yi@Mi@Ao@FmF|A}[tIgCr@aC~@aAf@mTxMsV~MqBhAiIjEoK~F}Q`KoLnG}EdC_FnCsDnBqHdEeHrDaE~BsIrF_ErCcDdCyKlJ}DnD}GxG{HnGaQhMsCfBiBbAuAh@{Ah@kCr@kB^yBXcCRuBH{CA_`@iAsDC}@@iL\\wBDgKFwHP_Vn@{E@_QP{C?]?e@GwDKiEU_Jo@eHY}GMmPSiH[eBCqJF_QUyL_@sDUqCI_ECcg@_BuBMmBS{Ba@sBk@qBw@aBy@mBsAmMoKyEuDeLyIqPcNqFoEcBkAyCaBcQkI}O{HeMgGoCyAeBgAmCqBcC}ByBgCcBaC{AgC{AcDmA_D[_AcAiEc@sBa@yC]eEcAyP}@yMg@qHUkGScDq@_Im@sFk@qHIwA]aEqDad@uBu\\qAeMoAaPS_DwBqXq@iJWsFEmC@wDJgEj@}IfBqVp@_HvDsZvAqMxCwYb@wFJcDByCKsCIqAUgBU{Aw@iDaAwCm@uAcAoB{BiDqA{AqBeBoCsBu@e@yBgAeMcFaFoBkAa@yBaA_JgD}HaDwFqCuEkC{CoBwEiDsRsMoGqEwRuNiKcHeM{IgFyD_LgIqDiDs@y@yAwBqBqDm@yAkEoMg@{Ae@}@_@[a@K]A_@Fa@RUZMb@An@Hf@PX\\v@Z~@JtAo@j@[f@e@~@c@l@Dh@JZBh@GxAYd@?hHiBnF_BdEcBn@]~Aq@bJ{EdF_DdOiKnJqGvIiGr@o@lA_Bl@cAXw@VHb@FPFzGiGvAqA~GaG";

const routeStops = [
  { name: "Poonamallee", position: { lat: 13.0518, lng: 80.0949 } },
  { name: "Avadi", position: { lat: 13.12, lng: 80.1022 } },
  { name: "Ambattur O.T.", position: { lat: 13.1197, lng: 80.1501 } },
  { name: "Pudur", position: { lat: 13.1366, lng: 80.1601 } },
  { name: "Surapet", position: { lat: 13.1605, lng: 80.1764 } },
  { name: "Red Hills", position: { lat: 13.19, lng: 80.18 } },
] as const;
const firstRouteStop = routeStops[0];
const simulatedBuses = [
  { route: "62", offset: 0 },
  { route: "154", offset: 0.24 },
  { route: "25", offset: 0.49 },
  { route: "M88", offset: 0.72 },
] as const;

const routeToneColors = {
  default: "--map-route",
  critical: "--map-critical",
  aging: "--map-aging",
  healthy: "--map-healthy",
  overdue: "--map-overdue",
  coverage: "--map-coverage",
} as const;

let mapsPromise: Promise<GoogleMapsApi> | null = null;
function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    window.initUrbanPulseMap = () => window.google?.maps ? resolve(window.google.maps) : reject(new Error("Google Maps did not initialize"));
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!key) {
      reject(new Error("Google Maps connection is unavailable"));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=initUrbanPulseMap&libraries=geometry&channel=${encodeURIComponent(channel ?? "urbanpulse")}`;
    script.async = true;
    script.onerror = () => reject(new Error("Google Maps could not be loaded"));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export function UrbanMap({ coverage = false, route = false, compact = false }: { coverage?: boolean; route?: boolean; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const pathRef = useRef<LatLng[]>([]);
  const routeLineRef = useRef<PolylineInstance | null>(null);
  const busMarkers = useRef<Record<string, MarkerInstance>>({});
  const defectMarkers = useRef<Record<string, MarkerInstance>>({});
  const [period, setPeriod] = useState("Live");
  const [filter, setFilter] = useState<MapFilter>(coverage ? "Coverage" : "All");
  const [query, setQuery] = useState("");
  const [selectedStop, setSelectedStop] = useState(firstRouteStop);
  const [loadError, setLoadError] = useState("");
  const [selectedDefect, setSelectedDefect] = useState<Route62Defect | null>(null);
  const alerts = useRepairAlerts();
  const filterView = getMapFilterView(filter, route62Defects);

  useEffect(() => {
    const maps = window.google?.maps;
    if (!maps) return;
    route62Defects.forEach((defect) => defectMarkers.current[defect.id]?.setIcon?.({
      url: roadSignDataUrl(defect.sign, Boolean(alerts[defect.id])),
      scaledSize: new maps.Size(36, 34),
      anchor: new maps.Point(18, 32),
    }));
  }, [alerts]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const visibleDefects = new Set(filterView.defectIds);
    route62Defects.forEach((defect) => defectMarkers.current[defect.id]?.setMap(visibleDefects.has(defect.id) ? map : null));
    simulatedBuses.forEach((bus) => busMarkers.current[bus.route]?.setMap(filterView.showBuses ? map : null));
    const styles = getComputedStyle(document.documentElement);
    const routeColor = styles.getPropertyValue(routeToneColors[filterView.routeTone]).trim();
    routeLineRef.current?.setOptions({
      strokeColor: routeColor,
      strokeOpacity: filter === "Overdue" ? 0.62 : 1,
      strokeWeight: filter === "Coverage" ? 8 : 5,
    });
    if (selectedDefect && !visibleDefects.has(selectedDefect.id)) setSelectedDefect(null);
  }, [filter, filterView.defectIds.join("|"), filterView.routeTone, filterView.showBuses, selectedDefect]);

  useEffect(() => {
    let active = true;
    const overlays: Array<{ setMap: (map: MapInstance | null) => void }> = [];
    let animation = 0;
    loadGoogleMaps().then((maps) => {
      if (!active || !hostRef.current) return;
      const styles = getComputedStyle(document.documentElement);
      const map = new maps.Map(hostRef.current, {
        center: { lat: 13.12, lng: 80.14 }, zoom: 12, mapTypeControl: false, streetViewControl: false,
        fullscreenControl: false, zoomControl: false, clickableIcons: false, gestureHandling: "greedy",
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
      });
      mapRef.current = map;
      const path = maps.geometry.encoding.decodePath(ROUTE_62_POLYLINE);
      pathRef.current = path;
      const bounds = new maps.LatLngBounds();
      path.forEach((point) => bounds.extend(point));
      const casing = new maps.Polyline({ path, strokeColor: styles.getPropertyValue("--map-route-casing").trim(), strokeOpacity: 0.92, strokeWeight: 9, map });
      const line = new maps.Polyline({ path, strokeColor: styles.getPropertyValue("--map-route").trim(), strokeOpacity: 1, strokeWeight: 5, map });
      routeLineRef.current = line;
      overlays.push(casing, line);

      [routeStops[0], routeStops[routeStops.length - 1]].forEach((stop, index) => {
        if (!stop) return;
        const marker = new maps.Marker({ map, position: stop.position, title: `${index === 0 ? "Start" : "End"}: ${stop.name}`, label: index === 0 ? "A" : "B" });
        overlays.push(marker);
      });

      route62Defects.forEach((defect) => {
        const marker = new maps.Marker({
          map, position: defect.position, zIndex: 20,
          title: `${defect.signLabel} · ${defect.near} (illustrative)`,
          icon: { url: roadSignDataUrl(defect.sign), scaledSize: new maps.Size(36, 34), anchor: new maps.Point(18, 32) },
        });
        marker.addListener?.("click", () => { setSelectedDefect(defect); map.panTo(defect.position); });
        defectMarkers.current[defect.id] = marker;
        overlays.push(marker);
      });

      if (path.length === 0) throw new Error("Route 62 geometry is unavailable");
      simulatedBuses.forEach((bus) => {
        const startIndex = Math.min(path.length - 1, Math.floor(bus.offset * path.length));
        const position = path[startIndex];
        if (!position) return;
        const marker = new maps.Marker({ map, position, zIndex: 30, title: `Simulated bus route ${bus.route}`, label: bus.route });
        busMarkers.current[bus.route] = marker;
        overlays.push(marker);
      });
      map.fitBounds(bounds, compact ? 38 : 64);

      let step = 0;
      const moveBuses = () => {
        if (!active || path.length === 0) return;
        step = (step + 1) % path.length;
        simulatedBuses.forEach((bus) => {
          const index = (step + Math.floor(bus.offset * path.length)) % path.length;
          const nextPoint = path[index];
          if (nextPoint) busMarkers.current[bus.route]?.setPosition(nextPoint);
        });
        animation = window.setTimeout(moveBuses, 300);
      };
      animation = window.setTimeout(moveBuses, 800);
    }).catch((error: unknown) => {
      if (active) setLoadError(error instanceof Error ? error.message : "Google Maps could not be loaded");
    });
    return () => {
      active = false;
      window.clearTimeout(animation);
      overlays.forEach((overlay) => overlay.setMap(null));
      mapRef.current = null;
      routeLineRef.current = null;
      busMarkers.current = {};
      defectMarkers.current = {};
    };
  }, [compact]);

  const selectStop = (stop: (typeof routeStops)[number]) => {
    setSelectedStop(stop);
    mapRef.current?.panTo(stop.position);
    mapRef.current?.setZoom(14);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = query.trim().toLowerCase();
    const stop = routeStops.find((item) => item.name.toLowerCase().includes(normalized));
    if (stop) { selectStop(stop); return; }
    const defect = route62Defects.find((item) => `${item.issue} ${item.near} ${item.id}`.toLowerCase().includes(normalized));
    if (defect) {
      setFilter(defect.severity === "Critical" || defect.severity === "High" ? "Critical" : "Aging");
      setSelectedDefect(defect);
      mapRef.current?.panTo(defect.position);
      mapRef.current?.setZoom(15);
      return;
    }
    const bus = simulatedBuses.find((item) => item.route.toLowerCase() === normalized.replace("route", "").trim());
    const path = pathRef.current;
    if (bus && path.length > 0) {
      setFilter("All");
      const position = path[Math.min(path.length - 1, Math.floor(bus.offset * path.length))];
      if (position) { mapRef.current?.panTo(position); mapRef.current?.setZoom(14); }
    }
  };

  return <div className={cn("map-shell google-map-shell relative overflow-hidden border border-border bg-map", compact ? "h-[420px]" : "h-[560px]")}>
    <div ref={hostRef} className="absolute inset-0" aria-label="Google Map showing Chennai bus route 62, simulated buses, and illustrative road defects" />
    {loadError && <div className="absolute inset-0 grid place-items-center bg-secondary p-8 text-center"><div><CircleAlert className="mx-auto mb-3 text-warning"/><strong>Map unavailable</strong><p className="mt-1 text-sm text-muted-foreground">{loadError}</p></div></div>}
    <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
      <form onSubmit={submitSearch} className="map-search pointer-events-auto">
        <Search aria-hidden="true"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stop, defect or bus route…" aria-label="Search stop, defect or bus route"/><Button type="submit" size="icon" variant="ghost" aria-label="Search"><Search/></Button>
      </form>
      <div className="control-group pointer-events-auto">{["Live", "24h", "7d", "30d"].map((value) => <Button key={value} type="button" size="sm" variant="ghost" onClick={() => setPeriod(value)} className={cn("control-chip h-auto", period === value && "control-chip-active")}>{value}</Button>)}</div>
    </div>
    <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-5rem)] pointer-events-none">
      <div className="map-route-card pointer-events-auto">
        <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><BusFront/> <strong>Route 62 corridor</strong></span><span className="demo-label">Simulated vehicles</span></div>
        <p>Poonamallee → Red Hills · buses 62, 154, 25, M88</p>
        <p className="map-filter-summary" aria-live="polite">{filterView.summary}</p>
        <div className="mt-2 flex max-w-[34rem] gap-1 overflow-x-auto pb-1">{routeStops.map((stop) => <Button key={stop.name} size="sm" variant="ghost" onClick={() => selectStop(stop)} className={cn("shrink-0", selectedStop.name === stop.name && "bg-accent text-accent-foreground")}>{stop.name}</Button>)}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">{mapFilters.map((value) => <Button key={value} size="sm" variant="ghost" onClick={() => setFilter(value)} aria-pressed={filter === value} className={cn("map-filter h-7 px-2 text-[11px]", filter === value && "map-filter-active")}>{value}</Button>)}</div>
      </div>
    </div>
    <div className="absolute bottom-3 right-3 z-10 flex flex-col border border-border bg-background shadow-sm">
      <Button variant="ghost" size="icon" onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 12) + 1)} aria-label="Zoom in"><Plus/></Button>
      <Button variant="ghost" size="icon" onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 12) - 1)} aria-label="Zoom out"><Minus/></Button>
      <Button variant="ghost" size="icon" onClick={() => selectStop(firstRouteStop)} aria-label="Locate Poonamallee"><LocateFixed/></Button>
    </div>
    {selectedDefect && <div className="absolute right-3 top-16 z-20 w-[min(20rem,calc(100%-1.5rem))] border border-border bg-background p-4 shadow-panel" role="dialog" aria-label={`${selectedDefect.issue} details`}>
      <Button variant="ghost" size="icon" className="absolute right-1 top-1" aria-label="Close defect details" onClick={() => setSelectedDefect(null)}><X/></Button>
      <div className="flex items-center gap-3 pr-8"><RoadSignIcon sign={selectedDefect.sign} alerted={Boolean(alerts[selectedDefect.id])} label={selectedDefect.signLabel} size={44}/><div><p className="eyebrow">{selectedDefect.id} · Route 62</p><strong className="block text-sm">{selectedDefect.issue}</strong><p className="text-xs text-muted-foreground">{selectedDefect.near}</p></div></div>
      <dl className="detail-list mt-3"><div><dt>Severity</dt><dd>{selectedDefect.severity}</dd></div><div><dt>AI confidence</dt><dd>{selectedDefect.confidence}%</dd></div><div><dt>Consistent passes</dt><dd>{selectedDefect.passes}</dd></div><div><dt>Last seen</dt><dd>{selectedDefect.last} · {selectedDefect.bus}</dd></div></dl>
      <Button className="mt-3 w-full" onClick={() => sendRepairAlert(selectedDefect)} disabled={Boolean(alerts[selectedDefect.id])}>{alerts[selectedDefect.id] ? `Alert sent at ${alerts[selectedDefect.id]}` : "Alert municipality to repair"}</Button>
      <p className="mt-2 text-[11px] text-muted-foreground">Illustrative demo detection</p>
    </div>}
    {route && <div className="absolute right-3 top-20 z-10 hidden border border-border bg-background p-3 shadow-panel sm:block"><p className="eyebrow">Actual road corridor</p><strong className="mt-1 block text-sm">MTC route 62</strong><p className="text-xs text-muted-foreground">51 stops · 6 major stops listed</p></div>}
  </div>;
}

export function Status({ status }: { status: string }) {
  const normalized = status === "attention" ? "aging" : status;
  return <span className={cn("status-badge", `status-${normalized}`)}><i/>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}