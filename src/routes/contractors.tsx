import { createFileRoute } from "@tanstack/react-router";import { ContractorsPage } from "@/components/urbanpulse/WarrantyPages";
export const Route=createFileRoute("/contractors")({head:()=>({meta:[{title:"Contractors — UrbanPulse"},{name:"description",content:"Factual operational records for road contractors."},{property:"og:title",content:"Contractors — UrbanPulse"},{property:"og:description",content:"Factual operational records for road contractors."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:ContractorsPage});

