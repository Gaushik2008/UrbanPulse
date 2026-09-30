import { createFileRoute } from "@tanstack/react-router";import { WarrantyPage } from "@/components/urbanpulse/WarrantyPages";
export const Route=createFileRoute("/warranty")({head:()=>({meta:[{title:"Warranty — UrbanPulse"},{name:"description",content:"Active, expiring, expired and unknown road warranties."},{property:"og:title",content:"Warranty — UrbanPulse"},{property:"og:description",content:"Active, expiring, expired and unknown road warranties."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:WarrantyPage});

