import type { RoadSign as Sign } from "@/lib/route62-defects";

const glyph: Record<Sign, string> = {
  pothole: '<ellipse cx="32" cy="42" rx="12" ry="5" fill="#1f2937"/>',
  water: '<path d="M18 40c4-4 8 4 12 0s8 4 12 0 6 3 6 3M18 47c4-4 8 4 12 0s8 4 12 0 6 3 6 3" stroke="#1f2937" stroke-width="3" fill="none"/>',
  uneven: '<path d="M16 46c6-10 10 0 16-8s10 2 16-4" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
  works: '<circle cx="30" cy="27" r="4" fill="#1f2937"/><path d="M28 32l-5 14M29 34l8 4M23 46h20" stroke="#1f2937" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
};

/** Indian-style warning road sign: red-bordered triangle with a pictogram. */
export function roadSignSvg(sign: Sign, alerted = false) {
  const border = alerted ? "#16a34a" : "#dc2626";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 60"><path d="M32 4 L60 54 H4 Z" fill="#ffffff" stroke="${border}" stroke-width="7" stroke-linejoin="round"/>${glyph[sign]}</svg>`;
}

export function roadSignDataUrl(sign: Sign, alerted = false) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(roadSignSvg(sign, alerted))}`;
}

export function RoadSignIcon({ sign, alerted = false, size = 36, label }: { sign: Sign; alerted?: boolean; size?: number; label: string }) {
  return <img src={roadSignDataUrl(sign, alerted)} width={size} height={size} alt={`Road sign: ${label}`} className="shrink-0" />;
}
