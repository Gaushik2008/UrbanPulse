export type RoadStatus = "healthy" | "observed" | "aging" | "attention" | "critical" | "unknown";
export type RoadSegment = { id:string; name:string; code:string; status:RoadStatus; lastObserved:string; frequency:string; health:number; traffic:string; risk:number; path:string; issue?:string };
export const roads: RoadSegment[] = [
 {id:"18a",name:"Anna Salai",code:"Segment 18A",status:"attention",lastObserved:"18 minutes ago",frequency:"High",health:68,traffic:"High",risk:74,path:"M70 330 C190 300 320 310 470 240 S750 130 940 180",issue:"Pothole · medium"},
 {id:"tn4",name:"Venkatanarayana Road",code:"Segment TN-04",status:"critical",lastObserved:"42 minutes ago",frequency:"High",health:41,traffic:"High",risk:89,path:"M430 70 C440 180 420 310 510 440 S680 540 760 600",issue:"Waterlogging · high"},
 {id:"ad7",name:"L.B. Road",code:"Segment AD-07",status:"healthy",lastObserved:"6 minutes ago",frequency:"High",health:91,traffic:"Medium",risk:18,path:"M90 530 C250 470 380 500 540 520 S800 470 960 400"},
 {id:"my2",name:"R.K. Mutt Road",code:"Segment MY-02",status:"observed",lastObserved:"31 minutes ago",frequency:"Medium",health:82,traffic:"Medium",risk:32,path:"M150 80 C220 190 280 280 310 580"},
 {id:"gp9",name:"Greams Road",code:"Segment GP-09",status:"aging",lastObserved:"3 days ago",frequency:"Low",health:73,traffic:"Medium",risk:55,path:"M610 50 C590 170 640 270 720 350 S850 500 910 610"},
 {id:"pr3",name:"Perambur High Road",code:"Segment PR-03",status:"unknown",lastObserved:"18 days ago",frequency:"Unknown",health:0,traffic:"High",risk:62,path:"M80 160 C260 130 380 170 540 130 S790 70 940 100"},
];
export const detections = [
 {id:"DET-1842",issue:"Pothole",location:"Anna Salai · 18A",severity:"High",confidence:94,first:"08:41",last:"10:12",status:"Open"},
 {id:"DET-1838",issue:"Waterlogging",location:"T Nagar · TN-04",severity:"Medium",confidence:89,first:"09:23",last:"09:48",status:"Monitoring"},
 {id:"DET-1829",issue:"Damaged road",location:"Adyar · AD-07",severity:"High",confidence:92,first:"07:12",last:"11:03",status:"Inspection scheduled"},
 {id:"DET-1817",issue:"Surface deterioration",location:"Mylapore · MY-02",severity:"Low",confidence:86,first:"06:55",last:"09:18",status:"Monitoring"},
 {id:"DET-1809",issue:"Pothole cluster",location:"Greams Road · GP-09",severity:"Critical",confidence:97,first:"06:31",last:"10:45",status:"Open"},
];
export const buses = [
 {id:"Bus 01",status:"Active",route:"21G · Broadway–Tambaram",gps:"Just now",distance:"12.4 km",observations:428,detections:12,coverage:"18%"},
 {id:"Bus 02",status:"Active",route:"5E · Vadapalani–Besant Nagar",gps:"1 min ago",distance:"8.7 km",observations:312,detections:8,coverage:"13%"},
 {id:"Bus 03",status:"Offline",route:"29C · Perambur–Thiruvanmiyur",gps:"18 min ago",distance:"6.1 km",observations:191,detections:4,coverage:"8%"},
 {id:"Bus 04",status:"Active",route:"18A · Broadway–Kilambakkam",gps:"Just now",distance:"15.2 km",observations:506,detections:17,coverage:"22%"},
 {id:"Bus 05",status:"Active",route:"12B · Foreshore–Koyambedu",gps:"2 min ago",distance:"10.8 km",observations:359,detections:9,coverage:"15%"},
];
export const trend = [{t:"01 Aug",health:100,coverage:58},{t:"04 Aug",health:91,coverage:61},{t:"07 Aug",health:82,coverage:64},{t:"10 Aug",health:64,coverage:68},{t:"12 Aug",health:41,coverage:70},{t:"15 Aug",health:88,coverage:72.4}];
