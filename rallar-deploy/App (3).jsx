import { useState } from "react"

const C = {
  bg:"#ffffff",bg2:"#f0f5fb",bg3:"#e3ecf7",
  b:"rgba(21,101,192,.12)",b2:"rgba(21,101,192,.22)",
  tx:"#0d1f35",mu:"#5a7089",ac:"#1565c0",da:"#c62828",ok:"#2e7d32"
}

const AVROP = [
  {id:"1",best:"Trafikverket",proj:"Botniabanans förstärkning etapp 3",plats:"Härnösand–Kramfors",tider:"Mån–Fre 06:00–16:00",omf:"8 veckor · 15 man",uppg:"Rälsbyte, ballastarbeten, spårjustering",behov:"Söker erfaret team med termit-svetsare och bangubbar. Erfarenhet av Banverket-projekt ett krav.",verktyg:["Termit svetsset","Rälslyftar","Grävmaskin"],deadline:"2026-06-15"},
  {id:"2",best:"Jernhusen AB",proj:"Underhåll Stockholm Central",plats:"Stockholm C",tider:"Nattarbete 22:00–05:00",omf:"3 veckor · 6 man",uppg:"Växelunderhåll, spårinspektion",behov:"Nattjobb med nattillägg. Väljer helst lokala leverantörer med kort inställelsetid.",verktyg:["Svetsutrustning","Mätutrustning"],deadline:"2026-06-01"},
  {id:"3",best:"Region Norrbotten",proj:"Malmbanan etapp 7",plats:"Kiruna–Riksgränsen",tider:"Dag- och nattskift",omf:"12 veckor · 20 man",uppg:"Spårförstärkning, dränering, ballasttamping",behov:"Stort projekt med förlängningsmöjlighet. Söker stabil underleverantör med egen utrustning.",verktyg:["Grävmaskin","Hjullastare","Dumper","Kompressor"],deadline:"2026-07-01"},
]

// Avrop publicerade av inloggad användares företag (Lindqvist Rail AB)
const MINA_AVROP = [
  {id:"m1",best:"Lindqvist Rail AB",proj:"Spårjustering Falun bangård",plats:"Falun Central",tider:"Mån–Fre 07:00–16:00",omf:"4 veckor · 8 man",uppg:"Justering av spår och växlar, ballastrensning",behov:"Söker team med erfarenhet av bangårdsarbete och egen mätutrustning. Lokalkännedom om Dalarna är ett plus.",verktyg:["Mätutrustning","Stampar","Hjullastare"],deadline:"2026-07-15",publicerad:"2026-05-18"},
  {id:"m2",best:"Lindqvist Rail AB",proj:"Signalunderhåll Borlänge–Hedemora",plats:"Borlänge–Hedemora",tider:"Nattarbete 22:00–06:00",omf:"2 veckor · 4 man",uppg:"Signalinspektion och periodiskt underhåll",behov:"Kräver certifierad signalpersonal med BVS-godkännande.",verktyg:["Mätutrustning","Signalverktyg"],deadline:"2026-06-30",publicerad:"2026-05-20"},
]

const ANSTALLDA = [
  {id:"1",name:"Erik Lindqvist",roll:"Termit svetsare",tel:"070-111 22 33"},
  {id:"2",name:"Sara Johansson",roll:"Hudik förare",tel:"070-222 33 44"},
  {id:"3",name:"Marcus Berg",roll:"Bangubbar",tel:"070-333 44 55"},
  {id:"4",name:"Anna Nilsson",roll:"Maskinist",tel:"070-444 55 66"},
]

// ── PLANERING (Företag-flik): hela arbetsstyrkan + projekt + veckobokningar ──
const PLANERING_ANSTALLDA = [
  {id:"u1", name:"Erik Lindqvist",  roll:"Termit svetsare"},
  {id:"u2", name:"Sara Johansson",  roll:"Hudik förare"},
  {id:"u3", name:"Marcus Berg",     roll:"Bangubbar"},
  {id:"u4", name:"Anna Nilsson",    roll:"Maskinist"},
  {id:"u5", name:"Magnus Holm",     roll:"Arbetsledare"},
  {id:"u6", name:"Lars Andersson",  roll:"Spårtekniker"},
  {id:"u7", name:"Henrik Ek",       roll:"Termit svetsare"},
  {id:"u8", name:"Bo Svensson",     roll:"Signaltekniker"},
  {id:"u9", name:"Lena Hagberg",    roll:"Signaltekniker"},
  {id:"u10",name:"Karl Forsberg",   roll:"Maskinist"},
]

const PROJEKT_LIST = [
  {id:"pr1",namn:"Botniabanan etapp 3",   plats:"Härnösand–Kramfors", arbete:"Rälsbyte",       color:0},
  {id:"pr2",namn:"Spårjustering Falun",   plats:"Falun C",            arbete:"Spårjustering",  color:1},
  {id:"pr3",namn:"Signalunderhåll",       plats:"Borlänge–Hedemora",  arbete:"Signaler",       color:2},
  {id:"pr4",namn:"Vegetationsröjning Syd",plats:"Malmö–Ystad",        arbete:"Röjning",        color:3},
  {id:"pr5",namn:"Termitsvets Sthlm",     plats:"Stockholm C",        arbete:"Termitsvets",    color:4},
  {id:"pr6",namn:"Växelrevision Boden",   plats:"Boden",              arbete:"Växelrevision",  color:5},
  {id:"pr7",namn:"Påsvets Gävle",         plats:"Gävle",              arbete:"Påsvets",        color:6},
]

// Pastellpalett: ljus fyllning, tydligare gräns + textfärg för läsbarhet på vit bg
const PROJECT_PALETTE = [
  {bg:"#dbeafe",border:"#93c5fd",text:"#1e40af"}, // blå
  {bg:"#dcfce7",border:"#86efac",text:"#15803d"}, // grön
  {bg:"#fef3c7",border:"#fcd34d",text:"#b45309"}, // gul
  {bg:"#fce7f3",border:"#f9a8d4",text:"#be185d"}, // rosa
  {bg:"#e0e7ff",border:"#a5b4fc",text:"#4338ca"}, // indigo
  {bg:"#cffafe",border:"#67e8f9",text:"#0e7490"}, // cyan
  {bg:"#fed7aa",border:"#fdba74",text:"#c2410c"}, // orange
  {bg:"#e9d5ff",border:"#c4b5fd",text:"#6b21a8"}, // lila
]

const WEEKS = [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]

const INIT_BOKNINGAR = [
  // Erik Lindqvist — Botniabanan + Termitsvets Sthlm
  {id:"bk1", anstalldId:"u1", projektId:"pr1", vecka:18},
  {id:"bk2", anstalldId:"u1", projektId:"pr1", vecka:19},
  {id:"bk3", anstalldId:"u1", projektId:"pr1", vecka:20},
  {id:"bk4", anstalldId:"u1", projektId:"pr5", vecka:22},
  {id:"bk5", anstalldId:"u1", projektId:"pr5", vecka:23},
  // Sara Johansson — Spårjustering Falun
  {id:"bk6", anstalldId:"u2", projektId:"pr2", vecka:19},
  {id:"bk7", anstalldId:"u2", projektId:"pr2", vecka:20},
  {id:"bk8", anstalldId:"u2", projektId:"pr2", vecka:21},
  {id:"bk9", anstalldId:"u2", projektId:"pr2", vecka:22},
  // Marcus Berg — Botniabanan + Växelrevision
  {id:"bk10",anstalldId:"u3", projektId:"pr1", vecka:20},
  {id:"bk11",anstalldId:"u3", projektId:"pr1", vecka:21},
  {id:"bk12",anstalldId:"u3", projektId:"pr1", vecka:22},
  {id:"bk13",anstalldId:"u3", projektId:"pr6", vecka:24},
  {id:"bk14",anstalldId:"u3", projektId:"pr6", vecka:25},
  // Anna Nilsson — Vegetationsröjning
  {id:"bk15",anstalldId:"u4", projektId:"pr4", vecka:18},
  {id:"bk16",anstalldId:"u4", projektId:"pr4", vecka:19},
  {id:"bk17",anstalldId:"u4", projektId:"pr4", vecka:20},
  {id:"bk18",anstalldId:"u4", projektId:"pr4", vecka:22},
  // Magnus Holm — Botniabanan (arbetsledare)
  {id:"bk19",anstalldId:"u5", projektId:"pr1", vecka:19},
  {id:"bk20",anstalldId:"u5", projektId:"pr1", vecka:20},
  {id:"bk21",anstalldId:"u5", projektId:"pr1", vecka:21},
  {id:"bk22",anstalldId:"u5", projektId:"pr1", vecka:22},
  // Lars Andersson — Signalunderhåll
  {id:"bk23",anstalldId:"u6", projektId:"pr3", vecka:21},
  {id:"bk24",anstalldId:"u6", projektId:"pr3", vecka:22},
  // Henrik Ek — Påsvets + Termitsvets
  {id:"bk25",anstalldId:"u7", projektId:"pr7", vecka:22},
  {id:"bk26",anstalldId:"u7", projektId:"pr7", vecka:23},
  {id:"bk27",anstalldId:"u7", projektId:"pr5", vecka:25},
  // Bo Svensson — Signaler
  {id:"bk28",anstalldId:"u8", projektId:"pr3", vecka:22},
  {id:"bk29",anstalldId:"u8", projektId:"pr3", vecka:23},
  // Lena Hagberg — Signaler
  {id:"bk30",anstalldId:"u9", projektId:"pr3", vecka:23},
  {id:"bk31",anstalldId:"u9", projektId:"pr3", vecka:24},
  // Karl Forsberg — Växelrevision
  {id:"bk32",anstalldId:"u10",projektId:"pr6", vecka:24},
  {id:"bk33",anstalldId:"u10",projektId:"pr6", vecka:25},
]

// ═══════════════════════════════════════════════════════════════════════
// PROJEKTERING-modul (Företag) — separat datalager från Planering-fliken
// ═══════════════════════════════════════════════════════════════════════
const PROJEKT_STATUS_LIST = ["Offert","Planering","Pågående","Klar","Fakturerad"]

const PROJEKT_STATUS_STYLE = {
  "Offert":     {bg:"#f3f4f6", text:"#6b7280", border:"#d1d5db"},
  "Planering":  {bg:"#dbeafe", text:"#1e40af", border:"#93c5fd"},
  "Pågående":   {bg:"#fef3c7", text:"#b45309", border:"#fcd34d"},
  "Klar":       {bg:"#dcfce7", text:"#15803d", border:"#86efac"},
  "Fakturerad": {bg:"#e0e7ff", text:"#4338ca", border:"#a5b4fc"},
}

const INIT_PROJEKTERING_PROJEKT = [
  {id:"pj1",nummer:"PRJ-2026-118",namn:"Botniabanan etapp 3",bestallare:"Trafikverket Region Nord",plats:"Härnösand–Kramfors",omfattning:"Rälsbyte 8 km, ballast 2400 ton, termitsvets 24 skarvar",arbetstider:"Mån–Fre 06:00–16:00",arbetsorder:"AO-2026-0118",arbetsledare:"Magnus Holm",kontaktperson:"Eva Lindberg · 070-555 12 34",uppgifter:"Spårförstärkning och rälsbyte mellan km 142–150",extra:"Säkerhetszon 25m. Närhet till bostadsområde — bullernivå begränsad nattetid.",start:"2026-05-04",slut:"2026-07-01",budget:2400,status:"Pågående",farg:0},
  {id:"pj2",nummer:"PRJ-2026-119",namn:"Spårjustering Falun bangård",bestallare:"Lindqvist Rail AB",plats:"Falun Central",omfattning:"Spårjustering 12 spår, ballastrensning, växeljustering",arbetstider:"Mån–Fre 07:00–16:00",arbetsorder:"AO-2026-0119",arbetsledare:"Magnus Holm",kontaktperson:"Anna Bergström · 070-446 78 90",uppgifter:"Justering av spår och växlar, ballastrensning",extra:"BVS-utbildning krävs. Bemanning 8 man.",start:"2026-06-15",slut:"2026-07-12",budget:1280,status:"Planering",farg:1},
  {id:"pj3",nummer:"PRJ-2026-120",namn:"Signalunderhåll Borlänge",bestallare:"Trafikverket Region Mitt",plats:"Borlänge–Hedemora",omfattning:"Signalinspektion 18 signaler, periodiskt underhåll",arbetstider:"Nattarbete 22:00–06:00",arbetsorder:"AO-2026-0120",arbetsledare:"Magnus Holm",kontaktperson:"Per Sandberg · 070-123 45 67",uppgifter:"Signalinspektion och periodiskt underhåll",extra:"Kräver BVS-godkännande för signalpersonal.",start:"2026-06-08",slut:"2026-06-22",budget:320,status:"Pågående",farg:2},
  {id:"pj4",nummer:"PRJ-2026-098",namn:"Vegetationsröjning Syd",bestallare:"Trafikverket Region Syd",plats:"Malmö–Ystad",omfattning:"Röjning 45 km, herbicidbehandling utvalda sträckor",arbetstider:"Mån–Fre 06:00–14:00",arbetsorder:"AO-2026-0098",arbetsledare:"Lars Andersson",kontaktperson:"Bo Jansson · 070-987 65 43",uppgifter:"Vegetationsröjning enligt MaaS-plan",extra:"Kemikalierapportering krävs månadsvis.",start:"2026-04-27",slut:"2026-08-31",budget:1800,status:"Pågående",farg:3},
  {id:"pj5",nummer:"PRJ-2026-101",namn:"Termitsvets Stockholm C",bestallare:"Jernhusen AB",plats:"Stockholm Central, spår 8-12",omfattning:"Termitsvetsning 16 skarvar",arbetstider:"Nattarbete 23:00–05:00",arbetsorder:"AO-2026-0101",arbetsledare:"Henrik Ek",kontaktperson:"Sofia Lund · 070-345 67 89",uppgifter:"Termitsvetsning skarvar spår 8-12",extra:"Trafikfri nattetid. Tunnelbane-spår.",start:"2026-05-25",slut:"2026-06-08",budget:240,status:"Pågående",farg:4},
  {id:"pj6",nummer:"PRJ-2026-067",namn:"Växelrevision Boden",bestallare:"Trafikverket Region Nord",plats:"Boden bangård",omfattning:"Komplett växelrevision 4 växlar",arbetstider:"Mån–Fre 06:00–16:00",arbetsorder:"AO-2026-0067",arbetsledare:"Magnus Holm",kontaktperson:"Eva Lindberg · 070-555 12 34",uppgifter:"Revision av 4 växlar inkl. byte av delar",extra:"",start:"2026-03-08",slut:"2026-04-26",budget:480,status:"Klar",farg:5},
  {id:"pj7",nummer:"PRJ-2026-042",namn:"Påsvets Gävle",bestallare:"Gävle Hamn AB",plats:"Gävle hamnspår",omfattning:"Påsvetsning av 32 skarvar",arbetstider:"Mån–Fre 06:00–14:00",arbetsorder:"AO-2026-0042",arbetsledare:"Henrik Ek",kontaktperson:"Karl Bergman · 070-111 22 33",uppgifter:"Påsvetsning på industrispår",extra:"Stickprovskontroll var 8:e skarv.",start:"2026-02-13",slut:"2026-03-24",budget:360,status:"Fakturerad",farg:6},
  {id:"pj8",nummer:"PRJ-2026-130",namn:"Banunderhåll Mälarbanan",bestallare:"Trafikverket Region Mitt",plats:"Stockholm–Västerås",omfattning:"Periodisk inspektion + småjusteringar",arbetstider:"Helger 08:00–18:00",arbetsorder:"AO-2026-0130",arbetsledare:"Magnus Holm",kontaktperson:"Anna Wikström · 070-234 56 78",uppgifter:"Förebyggande underhåll, kvartalsbas",extra:"Offert insänd 2026-05-20.",start:"",slut:"",budget:600,status:"Offert",farg:7},
]

const INIT_TIDSRAPPORTER = [
  {id:"tr1", projektId:"pj1",anstalldNamn:"Erik Lindqvist", datum:"2026-05-25",timmar:8, typ:"Normal", kommentar:""},
  {id:"tr2", projektId:"pj1",anstalldNamn:"Magnus Holm",    datum:"2026-05-25",timmar:8, typ:"Normal", kommentar:""},
  {id:"tr3", projektId:"pj1",anstalldNamn:"Marcus Berg",    datum:"2026-05-25",timmar:10,typ:"Övertid",kommentar:"Förlängd dag pga sprickbildning vid km 142+120"},
  {id:"tr4", projektId:"pj1",anstalldNamn:"Erik Lindqvist", datum:"2026-05-24",timmar:8, typ:"Normal", kommentar:""},
  {id:"tr5", projektId:"pj1",anstalldNamn:"Magnus Holm",    datum:"2026-05-24",timmar:8, typ:"Normal", kommentar:""},
  {id:"tr6", projektId:"pj1",anstalldNamn:"Marcus Berg",    datum:"2026-05-24",timmar:9, typ:"Normal", kommentar:""},
  {id:"tr7", projektId:"pj3",anstalldNamn:"Bo Svensson",    datum:"2026-05-25",timmar:8, typ:"Normal", kommentar:"Nattskift"},
  {id:"tr8", projektId:"pj3",anstalldNamn:"Lars Andersson", datum:"2026-05-25",timmar:6, typ:"Normal", kommentar:""},
  {id:"tr9", projektId:"pj4",anstalldNamn:"Anna Nilsson",   datum:"2026-05-22",timmar:4, typ:"Restid", kommentar:"Resa Malmö–Ystad"},
  {id:"tr10",projektId:"pj4",anstalldNamn:"Anna Nilsson",   datum:"2026-05-22",timmar:8, typ:"Normal", kommentar:""},
  {id:"tr11",projektId:"pj5",anstalldNamn:"Henrik Ek",      datum:"2026-05-23",timmar:6, typ:"Normal", kommentar:""},
  {id:"tr12",projektId:"pj6",anstalldNamn:"Marcus Berg",    datum:"2026-04-22",timmar:8, typ:"Normal", kommentar:""},
]

// Avvikelser kopplade till specifika projekt (parallellt med befintliga INIT_AVVIKELSER)
const INIT_PROJEKT_AVVIKELSER = [
  {id:"pa1",projektId:"pj1",text:"Sprickbildning i räls vid km 142+120, behöver åtgärdas inom 48h",av:"Marcus Berg",  datum:"2026-05-24",status:"open"},
  {id:"pa2",projektId:"pj1",text:"Säkerhetsavstånd avvek från regulering — ny mätning krävs",      av:"Magnus Holm",  datum:"2026-05-23",status:"closed"},
  {id:"pa3",projektId:"pj3",text:"Signal 3B saknar status-LED — anmält till Trafikverket",         av:"Bo Svensson",  datum:"2026-05-22",status:"open"},
  {id:"pa4",projektId:"pj4",text:"Herbicid-spill rapporterat — sanering klar",                     av:"Anna Nilsson", datum:"2026-05-19",status:"closed"},
]

// Projektering har egna bokningar — separat från Planering-flikens bokningar
const INIT_PROJEKTERING_BOKNINGAR = [
  {id:"pbk1", anstalldId:"u1",projektId:"pj1",vecka:20},
  {id:"pbk2", anstalldId:"u1",projektId:"pj1",vecka:21},
  {id:"pbk3", anstalldId:"u1",projektId:"pj1",vecka:22},
  {id:"pbk4", anstalldId:"u3",projektId:"pj1",vecka:21},
  {id:"pbk5", anstalldId:"u3",projektId:"pj1",vecka:22},
  {id:"pbk6", anstalldId:"u5",projektId:"pj1",vecka:20},
  {id:"pbk7", anstalldId:"u5",projektId:"pj1",vecka:21},
  {id:"pbk8", anstalldId:"u5",projektId:"pj1",vecka:22},
  {id:"pbk9", anstalldId:"u2",projektId:"pj2",vecka:24},
  {id:"pbk10",anstalldId:"u2",projektId:"pj2",vecka:25},
  {id:"pbk11",anstalldId:"u2",projektId:"pj2",vecka:26},
  {id:"pbk12",anstalldId:"u8",projektId:"pj3",vecka:22},
  {id:"pbk13",anstalldId:"u9",projektId:"pj3",vecka:23},
  {id:"pbk14",anstalldId:"u4",projektId:"pj4",vecka:18},
  {id:"pbk15",anstalldId:"u4",projektId:"pj4",vecka:19},
  {id:"pbk16",anstalldId:"u4",projektId:"pj4",vecka:20},
  {id:"pbk17",anstalldId:"u7",projektId:"pj5",vecka:22},
  {id:"pbk18",anstalldId:"u7",projektId:"pj5",vecka:23},
]

// När en anställd läggs till på ett projekt skapas en notis. Anställd måste markera sedd.
// kvitteradTid: "ÅÅÅÅ-MM-DD HH:MM" när sedd, annars null
const INIT_PROJEKT_NOTISER = [
  {id:"pn1", projektId:"pj1", anstalldId:"u1", sedd:true,  kvitteradTid:"2026-05-04 07:12"},
  {id:"pn2", projektId:"pj1", anstalldId:"u5", sedd:true,  kvitteradTid:"2026-05-04 06:55"},
  {id:"pn3", projektId:"pj2", anstalldId:"u2", sedd:true,  kvitteradTid:"2026-05-23 14:30"},
  {id:"pn4", projektId:"pj2", anstalldId:"u3", sedd:false, kvitteradTid:null}, // Marcus Berg — kommer se notis vid login
  {id:"pn5", projektId:"pj3", anstalldId:"u8", sedd:true,  kvitteradTid:"2026-06-07 22:00"},
  {id:"pn6", projektId:"pj3", anstalldId:"u9", sedd:false, kvitteradTid:null},
  {id:"pn7", projektId:"pj5", anstalldId:"u7", sedd:false, kvitteradTid:null},
  {id:"pn8", projektId:"pj5", anstalldId:"u5", sedd:false, kvitteradTid:null}, // Magnus Holm — kommer se notis vid login
]

const ARBETEN = [
  {id:"1",plats:"Härnösand station",uppg:"Termitsvetsning spår 3",tid:"06:00–16:00",mat:"Termitpatroner x4, skyddshandskar",status:"pagaende"},
  {id:"2",plats:"Kramfors depot",uppg:"Rälsbyte nordvästra spåret",tid:"07:00–15:00",mat:"Räls 60E1, klammer x20",status:"kommande"},
  {id:"3",plats:"Sundsvall C",uppg:"Spårjustering perrong 2",tid:"06:00–14:00",mat:"Ballast 2t, stampar",status:"klar"},
]

const DAGORDER_INIT = {proj:"Botniabanan etapp 3",plats:"Härnösand station, spår 3",uppg:"Termitsvetsning av rälsskarv vid km 142+450",tid:"06:00–16:00 (lunch 10:00–10:30)",mat:"Termitpatroner x4, formar 60E1, tändare, propan",coords:"62.6324,17.9395",datum:"2026-05-25"}

const INIT_AVVIKELSER = [
  {id:"1",text:"Sprickbildning i räls vid km 142+120, behöver åtgärdas inom 48h",av:"Marcus Berg",datum:"2026-05-24",status:"open"},
  {id:"2",text:"Saknad skyddsutrustning (hjälm) hos extern leverantör",av:"Erik Lindqvist",datum:"2026-05-25",status:"open"},
  {id:"3",text:"Vattenskada i förrådscontainer, material blött",av:"Sara Johansson",datum:"2026-05-22",status:"closed"},
]

const INIT_ANSOKNINGAR = [
  {id:"a1",avropId:"m1",foretag:"NordRail AB",arbetsledare:"Magnus Holm",tel:"070-555 66 77",msg:"Vi har ett 8-mans team med två erfarna spårtekniker som jobbat med liknande bangårdsarbeten i Borlänge förra året. Tillgängliga från 2026-06-15. Egen mätutrustning och stamputrustning.",team:["Erik Lindqvist","Sara Johansson","Marcus Berg","Anna Nilsson"],datum:"2026-05-22",status:"open"},
  {id:"a2",avropId:"m1",foretag:"BanService Norr AB",arbetsledare:"Lars Andersson",tel:"070-666 77 88",msg:"Specialiserade på bangårdsarbete med egen mätutrustning. Kan starta omgående med 6 mans team. Referenser från Trafikverket finns.",team:["Per Olsson","Karin Berg","Tom Lindholm"],datum:"2026-05-23",status:"open"},
  {id:"a3",avropId:"m1",foretag:"Mid-Sweden Rail",arbetsledare:"Henrik Ek",tel:"070-888 99 00",msg:"Lokala från Falun, snabba inställelsetider. Gjorde spårjustering på samma bangård 2024.",team:["Johan Lind","Eva Persson","Tom Karlsson"],datum:"2026-05-24",status:"open"},
  {id:"a4",avropId:"m2",foretag:"NordRail AB",arbetsledare:"Magnus Holm",tel:"070-555 66 77",msg:"BVS-certifierade signaltekniker tillgängliga. 4-mans team specialiserade på nattskift och signalanläggningar.",team:["Bo Svensson","Lena Hagberg","Karl Forsberg","Maria Sjögren"],datum:"2026-05-25",status:"open"},
]

// Ändringar som arbetsledare publicerar till dagordern
// kvittenser-mappen: { [anstalldId]: { sedd: boolean, tid?: "HH:MM" } } — visas i Projektkoll under "Kvitterade ändringar"
const INIT_ANDRINGAR = [
  {id:"1",text:"Ny säkerhetszon gäller från idag — 25m istf 15m",datum:"2026-05-25",av:"Magnus Holm",sedd:false,
   kvittenser:{"1":{sedd:false},"2":{sedd:true,tid:"07:11"},"3":{sedd:true,tid:"06:23"},"4":{sedd:false}}},
]

// Kompetenser per roll (visas på Profil för Ute på spåret-roller)
const KOMPETENSER = {
  arbetare:    ["Bangubbar (grundutbildning)","Termitsvetsning","BVS-certifierad","Säkerhet på väg","Halkbana lastbil","Heta arbeten"],
  arbetsledare:["Arbetsledning järnvägsarbete","Spårjustering & växlar","Säkerhetschef BVS","BVS-godkänd handledare","Maskinförarbevis","HLR & första hjälpen"],
}

const TIDIGARE_JOBB = {
  arbetare: [
    {proj:"Botniabanan etapp 2",          plats:"Härnösand",            period:"2025-03 → 2025-06", roll:"Bangubbar"},
    {proj:"Stockholm C nattunderhåll",    plats:"Stockholm",            period:"2024-11 → 2025-02", roll:"Bangubbar"},
    {proj:"Malmbanan vinterunderhåll",    plats:"Kiruna",               period:"2024-01 → 2024-03", roll:"Bangubbar"},
  ],
  arbetsledare: [
    {proj:"Botniabanan etapp 2",          plats:"Härnösand–Kramfors",   period:"2025-03 → 2025-06", roll:"Arbetsledare"},
    {proj:"Mälarbanan utbyte",            plats:"Sundbyberg",           period:"2024-08 → 2024-12", roll:"Arbetsledare"},
    {proj:"Citybanan slutförande",        plats:"Stockholm",            period:"2024-01 → 2024-07", roll:"Arbetsledare"},
  ],
}

const DEMO_USERS = {
  foretag:         {name:"Anna Bergström", role:"foretag",       company:"Lindqvist Rail AB"},
  arbetsledare:    {name:"Magnus Holm",    role:"arbetsledare",  company:"NordRail AB"},
  arbetare:        {name:"Marcus Berg",    role:"arbetare",      company:"NordRail AB"},
}

const DEFAULT_SCREEN = {foretag:"marketplace",arbetsledare:"dagorder",arbetare:"dagorder"}

// ── Styles ──────────────────────────────────────────────────
const card = {background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"16px 18px"}
const inp = {background:C.bg3,border:`1px solid ${C.b}`,borderRadius:8,color:C.tx,padding:"13px 15px",width:"100%",fontSize:15,outline:"none",fontFamily:"inherit"}
const btnP = {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"15px",borderRadius:8,fontSize:15,fontWeight:500,cursor:"pointer",border:"none",background:C.ac,color:"#ffffff",fontFamily:"inherit"}
const btnG = {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"14px",borderRadius:8,fontSize:15,cursor:"pointer",border:`1px solid ${C.b}`,background:"transparent",color:C.mu,fontFamily:"inherit"}
const lbl = {fontSize:13,color:C.mu,display:"block",marginBottom:6}
const hdr = {padding:"14px 20px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.b}`,background:C.bg,position:"sticky",top:0,zIndex:10}

// ── Badge ────────────────────────────────────────────────────
function Badge({status}) {
  const m={publicerad:["#1D9E75","rgba(29,158,117,.15)","Publicerad"],tillsatt:["#5b9cf6","rgba(91,156,246,.15)","Tillsatt"],pagaende:[C.ac,"rgba(232,184,75,.15)","Pågående"],kommande:[C.mu,"rgba(255,255,255,.08)","Kommande"],klar:["#1D9E75","rgba(29,158,117,.15)","Klar"],open:[C.da,"rgba(224,82,82,.15)","Öppen"],closed:[C.mu,"rgba(255,255,255,.08)","Stängd"],accepted:[C.ok,"rgba(46,125,50,.12)","Accepterad"],rejected:[C.mu,"rgba(255,255,255,.08)","Avslagen"]}
  const [col,bg,lbl] = m[status]||[C.mu,"rgba(255,255,255,.08)",status]
  return <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,background:bg,color:col}}>{lbl}</span>
}

// ── Login ────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [cat, setCat] = useState(null)

  const Logo = () => (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
      <div style={{width:36,height:36,background:C.ac,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#ffffff",lineHeight:1}}>R</div>
      <span style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Rallar</span>
    </div>
  )

  if (cat === "spar") {
    const roles = [
      {v:"arbetsledare", l:"Arbetsledare", d:"Full tillgång — dagorder, projektkoll, avvikelser"},
      {v:"arbetare",     l:"Arbetare",     d:"Dagorder, mina arbeten, rapportera avvikelser"},
    ]
    return (
      <div style={{padding:"52px 24px 40px",display:"flex",flexDirection:"column",minHeight:"100%"}}>
        <Logo/>
        <button onClick={()=>setCat(null)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.mu,fontSize:14,padding:0,marginBottom:20}}>← Tillbaka</button>
        <div style={{background:"#0d47a1",borderRadius:12,padding:"14px 18px",marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:600,color:"#ffffff",marginBottom:2}}>Ute på spåret</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.75)"}}>Dagorder, avvikelser och projektöversikt</div>
        </div>
        <p style={{color:C.mu,fontSize:14,marginBottom:16}}>Vem är du?</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {roles.map(r => (
            <button key={r.v} onClick={() => onLogin(r.v)} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:12,padding:"16px 18px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"border-color .15s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.ac}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontWeight:500,fontSize:15}}>{r.l}</div>
                {r.v==="arbetsledare" && <span style={{fontSize:11,background:"rgba(21,101,192,.1)",color:C.ac,padding:"2px 8px",borderRadius:10,border:`1px solid ${C.b2}`}}>Full behörighet</span>}
              </div>
              <div style={{color:C.mu,fontSize:13,marginTop:3}}>{r.d}</div>
            </button>
          ))}
        </div>
        <div style={{marginTop:20,background:C.bg2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.mu}}>
          🔒 Arbetsledarens funktioner är låsta för vanliga arbetare
        </div>
        <p style={{textAlign:"center",color:C.mu,fontSize:12,marginTop:"auto",paddingTop:40}}>Demo — ingen inloggning krävs</p>
      </div>
    )
  }

  return (
    <div style={{padding:"64px 24px 40px",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <Logo/>
      <h1 style={{fontSize:26,fontWeight:600,letterSpacing:"-.4px",marginBottom:8}}>Välkommen till Rallar</h1>
      <p style={{color:C.mu,fontSize:15,marginBottom:32}}>Välj din kategori för att fortsätta</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <button onClick={()=>onLogin("foretag")} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"22px 20px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"all .15s"}}
          onMouseOver={e=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.background=C.bg3}}
          onMouseOut={e=>{e.currentTarget.style.borderColor=C.b;e.currentTarget.style.background=C.bg2}}>
          <div style={{fontSize:24,marginBottom:10}}>🏢</div>
          <div style={{fontWeight:600,fontSize:17,marginBottom:6}}>Företag & Beställare</div>
          <div style={{color:C.mu,fontSize:13,lineHeight:1.5}}>Beställare · Projektledare · Underleverantör</div>
          <div style={{marginTop:12,fontSize:12,color:C.ac,fontWeight:500}}>Marketplace · Avrop · Projekthantering →</div>
        </button>
        <button onClick={()=>setCat("spar")} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"22px 20px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"all .15s"}}
          onMouseOver={e=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.background=C.bg3}}
          onMouseOut={e=>{e.currentTarget.style.borderColor=C.b;e.currentTarget.style.background=C.bg2}}>
          <div style={{fontSize:24,marginBottom:10}}>🚦</div>
          <div style={{fontWeight:600,fontSize:17,marginBottom:6}}>Ute på spåret</div>
          <div style={{color:C.mu,fontSize:13,lineHeight:1.5}}>Arbetsledare · Arbetare</div>
          <div style={{marginTop:12,fontSize:12,color:C.ac,fontWeight:500}}>Dagorder · Avvikelser · Projektkoll →</div>
        </button>
      </div>
      <p style={{textAlign:"center",color:C.mu,fontSize:12,marginTop:"auto",paddingTop:40}}>Demo — ingen inloggning krävs</p>
    </div>
  )
}

// ── Marketplace ──────────────────────────────────────────────
function Marketplace({navigate}) {
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Marketplace</h1>
          <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,color:C.ac,background:"rgba(232,184,75,.15)"}}>{AVROP.length} avrop</span>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {AVROP.map(a => (
          <button key={a.id} onClick={() => navigate("avrop",a)} style={{...card,textAlign:"left",cursor:"pointer",width:"100%",transition:"border-color .15s"}}
            onMouseOver={e=>e.currentTarget.style.borderColor=C.b2}
            onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:11,color:C.mu,fontWeight:500,letterSpacing:".5px"}}>{a.best.toUpperCase()}</span>
              <Badge status="publicerad"/>
            </div>
            <div style={{fontWeight:600,fontSize:16,marginBottom:6,letterSpacing:"-.2px"}}>{a.proj}</div>
            <div style={{color:C.mu,fontSize:13,marginBottom:10}}>📍 {a.plats}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {a.verktyg.slice(0,3).map(v => <span key={v} style={{fontSize:11,background:"rgba(255,255,255,.06)",color:C.mu,padding:"3px 8px",borderRadius:6}}>{v}</span>)}
            </div>
            <div style={{marginTop:12,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:C.mu}}>{a.tider}</span>
              <span style={{fontSize:12,color:C.da}}>Deadline {a.deadline}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Avrop detail ─────────────────────────────────────────────
function AvropDetail({avrop, navigate, role}) {
  const [ansokSent, setAnsokSent] = useState(false)
  const [showAnsok, setShowAnsok] = useState(false)
  const [selected, setSelected] = useState([])
  const [msg, setMsg] = useState("")

  if (ansokSent) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Ansökan skickad!</h2>
      <p style={{color:C.mu,fontSize:15}}>Beställaren granskar och återkommer.</p>
      <button style={{...btnP,maxWidth:280,marginTop:32}} onClick={() => navigate("marketplace")}>Tillbaka till marketplace</button>
    </div>
  )

  if (showAnsok) return (
    <div>
      <div style={hdr}>
        <button onClick={() => setShowAnsok(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{fontWeight:600,fontSize:15}}>Ansök om avrop</div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={lbl}>Meddelande till beställaren</label>
          <textarea style={{...inp,height:90,resize:"none"}} placeholder="Berätta om ert team..." value={msg} onChange={e=>setMsg(e.target.value)}/>
        </div>
        <div>
          <label style={lbl}>Anställda ni tar med</label>
          {ANSTALLDA.map(a => {
            const sel = selected.includes(a.id)
            return (
              <button key={a.id} onClick={() => setSelected(s => sel ? s.filter(x=>x!==a.id) : [...s,a.id])}
                style={{display:"flex",alignItems:"center",gap:12,width:"100%",background:sel?"rgba(232,184,75,.07)":C.bg2,border:`1px solid ${sel?C.ac:C.b}`,borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer"}}>
                <div style={{width:20,height:20,borderRadius:4,border:`1.5px solid ${sel?C.ac:C.b2}`,background:sel?C.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {sel && <span style={{fontSize:11,color:"#ffffff",fontWeight:700}}>✓</span>}
                </div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:14,fontWeight:500,color:C.tx}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
              </button>
            )
          })}
        </div>
        <button style={btnP} onClick={() => setAnsokSent(true)}>Skicka ansökan</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("marketplace")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div>
          <div style={{fontSize:11,color:C.mu}}>{avrop.best}</div>
          <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px"}}>{avrop.proj}</div>
        </div>
      </div>
      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
        {[["Arbetsplats",avrop.plats],["Arbetstider",avrop.tider],["Omfattning",avrop.omf],["Arbetsuppgifter",avrop.uppg]].map(([l,v]) => (
          <div key={l} style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</div><div style={{fontSize:14}}>{v}</div></div>
        ))}
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Vad vi söker</div><div style={{fontSize:14,lineHeight:1.6}}>{avrop.behov}</div></div>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Verktyg som krävs</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {avrop.verktyg.map(v => <span key={v} style={{fontSize:13,background:"rgba(232,184,75,.12)",color:C.ac,padding:"5px 10px",borderRadius:8,border:"1px solid rgba(232,184,75,.2)"}}>{v}</span>)}
          </div>
        </div>
        <div style={{fontSize:13,color:C.da,textAlign:"center"}}>Deadline: {avrop.deadline}</div>
        {role === "foretag" && <button style={btnP} onClick={() => setShowAnsok(true)}>Ansök på detta avrop</button>}
      </div>
    </div>
  )
}

// ── Skapa avrop ──────────────────────────────────────────────
function SkapaAvrop({navigate}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [data, setData] = useState({proj:"",plats:"",tider:"",omf:"",uppg:"",behov:"",deadline:"",verktyg:[]})

  function runAI() {
    setLoading(true)
    setTimeout(() => {
      setData({proj:"Förstärkning bangård Sundsvall C",plats:"Sundsvall Central",tider:"Mån–Fre 06:00–16:00",omf:"6 veckor · 10 man",uppg:"Spårjustering, ballastrensning, skarvsvetsning",behov:"",deadline:"2026-06-20",verktyg:[]})
      setLoading(false)
      setStep(2)
    }, 2000)
  }

  function toggleVerktyg(v) {
    setData(d => ({...d, verktyg: d.verktyg.includes(v) ? d.verktyg.filter(x=>x!==v) : [...d.verktyg,v]}))
  }

  if (published) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>🚀</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Avrop publicerat!</h2>
      <p style={{color:C.mu,fontSize:15}}>Underleverantörer kan nu se och ansöka.</p>
      <button style={{...btnP,maxWidth:280,marginTop:32}} onClick={() => {setPublished(false);setStep(1);navigate("mina-avrop")}}>Visa mina avrop</button>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <div style={{fontWeight:600,fontSize:16}}>Nytt avrop</div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[1,2,3].map(n => <div key={n} style={{width:24,height:3,borderRadius:2,background:n<=step?C.ac:C.b}}/>)}
        </div>
      </div>
      {step===1 && (
        <div style={{padding:"32px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{width:80,height:80,background:C.bg3,borderRadius:20,border:`2px dashed ${C.b2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>📄</div>
          <div style={{textAlign:"center"}}>
            <h2 style={{fontSize:20,fontWeight:600,marginBottom:8}}>Ladda upp avropsbild</h2>
            <p style={{color:C.mu,fontSize:14}}>AI läser bilden och fyller i projektet automatiskt</p>
          </div>
          <button style={{...btnP,maxWidth:280}} onClick={runAI} disabled={loading}>
            {loading ? "AI läser bilden..." : "Simulera AI-läsning"}
          </button>
          <p style={{fontSize:12,color:C.mu}}>I produktionen: ta foto eller välj från galleri</p>
        </div>
      )}
      {step===2 && (
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"rgba(46,125,50,.08)",border:"1px solid rgba(46,125,50,.25)",borderRadius:10,padding:"10px 14px",fontSize:13,color:C.ok}}>✓ AI fyllde i fälten — kontrollera och justera</div>
          {[["Projekt","proj"],["Arbetsplats","plats"],["Arbetstider","tider"],["Omfattning","omf"],["Arbetsuppgifter","uppg"]].map(([l,k]) => (
            <div key={k}><label style={lbl}>{l}</label><input style={inp} value={data[k]} onChange={e=>setData(d=>({...d,[k]:e.target.value}))}/></div>
          ))}
          <div><label style={lbl}>Deadline</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.deadline} onChange={e=>setData(d=>({...d,deadline:e.target.value}))}/></div>
          <button style={btnP} onClick={() => setStep(3)}>Fortsätt</button>
        </div>
      )}
      {step===3 && (
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>Behovsbeskrivning</label><textarea style={{...inp,height:110,resize:"none"}} placeholder="Vad söker ni hos underleverantören?" value={data.behov} onChange={e=>setData(d=>({...d,behov:e.target.value}))}/></div>
          <div>
            <label style={lbl}>Verktyg som krävs</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Grävmaskin","Svetsutrustning","Termit svetsset","Rälslyftar","Lastbil","Mätutrustning","Dumper","Kompressor"].map(v => (
                <button key={v} onClick={() => toggleVerktyg(v)} style={{fontSize:13,padding:"6px 12px",borderRadius:8,border:`1px solid ${data.verktyg.includes(v)?C.ac:C.b}`,background:data.verktyg.includes(v)?"rgba(232,184,75,.12)":C.bg3,color:data.verktyg.includes(v)?C.ac:C.mu,cursor:"pointer"}}>{v}</button>
              ))}
            </div>
          </div>
          <button style={{...btnP,marginTop:8}} onClick={() => setPublished(true)}>Publicera avrop</button>
          <button style={btnG} onClick={() => setStep(2)}>Tillbaka</button>
        </div>
      )}
    </div>
  )
}

// ── Mina avrop (företag) ─────────────────────────────────────
function MinaAvrop({navigate, ansokningar}) {
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Mina avrop</h1>
          <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,color:C.ac,background:"rgba(232,184,75,.15)"}}>{MINA_AVROP.length} aktiva</span>
        </div>
        <div style={{fontSize:13,color:C.mu,marginBottom:18}}>Publicerade avrop och inkomna ansökningar</div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {MINA_AVROP.map(a => {
          const openAns = ansokningar.filter(x => x.avropId === a.id && x.status === "open").length
          const acceptedAns = ansokningar.filter(x => x.avropId === a.id && x.status === "accepted").length
          return (
            <button key={a.id} onClick={() => navigate("ansokningar", a)} style={{...card,textAlign:"left",cursor:"pointer",width:"100%",transition:"border-color .15s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.b2}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <span style={{fontSize:11,color:C.mu,fontWeight:500,letterSpacing:".5px"}}>PUBLICERAT {a.publicerad}</span>
                <Badge status={acceptedAns > 0 ? "tillsatt" : "publicerad"}/>
              </div>
              <div style={{fontWeight:600,fontSize:16,marginBottom:6,letterSpacing:"-.2px"}}>{a.proj}</div>
              <div style={{color:C.mu,fontSize:13,marginBottom:10}}>📍 {a.plats}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:`1px solid ${C.b}`}}>
                <span style={{fontSize:13,fontWeight:500}}>
                  {openAns > 0 && (
                    <span style={{display:"inline-flex",alignItems:"center",gap:7,color:C.tx}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:C.da}}/>
                      {openAns} {openAns === 1 ? "ny ansökan" : "nya ansökningar"}
                    </span>
                  )}
                  {openAns === 0 && acceptedAns > 0 && <span style={{color:C.ok}}>✓ Tillsatt</span>}
                  {openAns === 0 && acceptedAns === 0 && <span style={{color:C.mu,fontWeight:400}}>Inga ansökningar än</span>}
                </span>
                <span style={{fontSize:12,color:C.da}}>Deadline {a.deadline}</span>
              </div>
            </button>
          )
        })}
        <button onClick={() => navigate("skapa-avrop")} style={{...btnG,marginTop:6,borderStyle:"dashed",color:C.ac}}>+ Skapa nytt avrop</button>
      </div>
    </div>
  )
}

// ── Ansökningar per avrop ────────────────────────────────────
function AvropAnsokningar({avrop, ansokningar, navigate}) {
  const filtered = ansokningar.filter(a => a.avropId === avrop.id)
  const open = filtered.filter(a => a.status === "open")
  const accepted = filtered.filter(a => a.status === "accepted")
  const rejected = filtered.filter(a => a.status === "rejected")

  const Row = ({a, dim}) => (
    <button key={a.id} onClick={() => navigate("ansokan", {ansokan: a, avrop})} style={{...card,textAlign:"left",cursor:"pointer",width:"100%",opacity:dim?.7:1,transition:"border-color .15s"}}
      onMouseOver={e=>e.currentTarget.style.borderColor=C.b2}
      onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <div style={{fontSize:15,fontWeight:600}}>{a.foretag}</div>
          <div style={{fontSize:12,color:C.mu,marginTop:2}}>{a.arbetsledare} · {a.team.length} man</div>
        </div>
        <Badge status={a.status}/>
      </div>
      {a.status === "open" && (
        <div style={{fontSize:13,color:C.mu,lineHeight:1.5,marginTop:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.msg}</div>
      )}
      <div style={{fontSize:11,color:C.mu,marginTop:8}}>{a.datum}</div>
    </button>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("mina-avrop")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{minWidth:0}}>
          <div style={{fontSize:11,color:C.mu}}>Ansökningar</div>
          <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{avrop.proj}</div>
        </div>
      </div>
      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length === 0 && (
          <div style={{...card,textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:32,marginBottom:10}}>📭</div>
            <div style={{color:C.mu,fontSize:14}}>Inga ansökningar än</div>
            <div style={{color:C.mu,fontSize:12,marginTop:6}}>Avrop publicerat {avrop.publicerad}</div>
          </div>
        )}
        {open.length > 0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"4px 0 2px"}}>NYA ({open.length})</div>}
        {open.map(a => <Row key={a.id} a={a}/>)}
        {accepted.length > 0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"10px 0 2px"}}>ACCEPTERADE ({accepted.length})</div>}
        {accepted.map(a => <Row key={a.id} a={a}/>)}
        {rejected.length > 0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"10px 0 2px"}}>AVSLAGNA ({rejected.length})</div>}
        {rejected.map(a => <Row key={a.id} a={a} dim/>)}
      </div>
    </div>
  )
}

// ── Ansökan detalj ───────────────────────────────────────────
function AnsokanDetail({ansokan, avrop, navigate, onAction}) {
  const [confirming, setConfirming] = useState(null) // "accept" | "reject" | null

  function handleAccept() { onAction(ansokan.id, "accepted"); navigate("ansokningar", avrop) }
  function handleReject() { onAction(ansokan.id, "rejected"); navigate("ansokningar", avrop) }

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("ansokningar", avrop)} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{minWidth:0}}>
          <div style={{fontSize:11,color:C.mu}}>Ansökan</div>
          <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ansokan.foretag}</div>
        </div>
      </div>
      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Avser avrop</div>
          <div style={{fontSize:14,fontWeight:500}}>{avrop.proj}</div>
          <div style={{fontSize:12,color:C.mu,marginTop:3}}>📍 {avrop.plats}</div>
        </div>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Arbetsledare</div>
          <div style={{fontSize:15,fontWeight:500}}>{ansokan.arbetsledare}</div>
          <div style={{fontSize:13,color:C.mu,marginTop:3}}>📞 {ansokan.tel}</div>
        </div>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Meddelande</div>
          <div style={{fontSize:14,lineHeight:1.6}}>{ansokan.msg}</div>
        </div>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:12,textTransform:"uppercase",letterSpacing:".5px"}}>Team ({ansokan.team.length} man)</div>
          {ansokan.team.map(name => (
            <div key={name} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{name.split(" ").map(n=>n[0]).join("")}</div>
              <div style={{fontSize:14}}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:12,color:C.mu,textAlign:"center"}}>Inkommen {ansokan.datum}</div>

        {ansokan.status === "open" && !confirming && (
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button style={{...btnG,flex:1,borderColor:"rgba(198,40,40,.3)",color:C.da}} onClick={() => setConfirming("reject")}>Avslå</button>
            <button style={{...btnP,flex:1}} onClick={() => setConfirming("accept")}>Acceptera</button>
          </div>
        )}
        {confirming === "accept" && (
          <div style={{...card,borderColor:"rgba(46,125,50,.3)",background:"rgba(46,125,50,.06)"}}>
            <div style={{fontSize:14,marginBottom:12,lineHeight:1.5}}>Acceptera ansökan från <strong>{ansokan.foretag}</strong>? Övriga sökande avslås automatiskt.</div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...btnG,flex:1}} onClick={() => setConfirming(null)}>Avbryt</button>
              <button style={{...btnP,flex:1}} onClick={handleAccept}>Bekräfta</button>
            </div>
          </div>
        )}
        {confirming === "reject" && (
          <div style={{...card,borderColor:"rgba(198,40,40,.3)",background:"rgba(198,40,40,.06)"}}>
            <div style={{fontSize:14,marginBottom:12,lineHeight:1.5}}>Avslå ansökan från <strong>{ansokan.foretag}</strong>?</div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...btnG,flex:1}} onClick={() => setConfirming(null)}>Avbryt</button>
              <button style={{...btnP,flex:1,background:C.da}} onClick={handleReject}>Bekräfta avslag</button>
            </div>
          </div>
        )}
        {ansokan.status === "accepted" && (
          <div style={{...card,borderColor:"rgba(46,125,50,.3)",background:"rgba(46,125,50,.06)",textAlign:"center"}}>
            <div style={{fontSize:14,color:C.ok,fontWeight:500}}>✓ Ansökan accepterad</div>
          </div>
        )}
        {ansokan.status === "rejected" && (
          <div style={{...card,borderColor:"rgba(198,40,40,.25)",background:"rgba(198,40,40,.05)",textAlign:"center"}}>
            <div style={{fontSize:14,color:C.da,fontWeight:500}}>Ansökan avslagen</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Planering (Företag): tre vyer (Veckovy / Per projekt / Per person) ──
// Klick-baserad bokning: tom cell → välj projekt; bokad cell → info + ta bort.
// Bokning = (anstalldId, projektId, vecka). En person kan bara vara på ett projekt per vecka.
function Planering({bokningar, onAdd, onRemove}) {
  const [view, setView] = useState("vecka")
  const [currentWeek, setCurrentWeek] = useState(22) // V22 = 2026-05-25
  const [picker, setPicker] = useState(null) // {mode:"projekt"|"anstalld"|"info", ...kontext}

  const findProjekt  = id => PROJEKT_LIST.find(p => p.id === id)
  const findAnstalld = id => PLANERING_ANSTALLDA.find(a => a.id === id)
  const colorFor     = p  => PROJECT_PALETTE[p.color % PROJECT_PALETTE.length]
  const initialer    = n  => n.split(" ").map(x => x[0]).join("")

  function openPickProjekt(anstalldId, vecka)  { setPicker({mode:"projekt",  anstalldId, vecka}) }
  function openPickAnstalld(projektId, vecka)  { setPicker({mode:"anstalld", projektId,  vecka}) }
  function openBokningInfo(b, a, p)            { setPicker({mode:"info", bokning:b, anstalld:a, projekt:p}) }

  function handleProjektSelect(projektId)      { onAdd({anstalldId:picker.anstalldId, projektId, vecka:picker.vecka}); setPicker(null) }
  function handleAnstalldSelect(anstalldId)    { onAdd({anstalldId, projektId:picker.projektId, vecka:picker.vecka}); setPicker(null) }
  function handleRemove()                      { onRemove(picker.bokning.id); setPicker(null) }

  // ─── VECKOVY ───────────────────────────────────────────────────────────
  function renderVeckoVy() {
    const idx = WEEKS.indexOf(currentWeek)
    const prev = idx > 0 ? WEEKS[idx-1] : null
    const next = idx < WEEKS.length-1 ? WEEKS[idx+1] : null
    const navBtn = (active) => ({width:38,height:38,borderRadius:8,border:`1px solid ${C.b}`,background:active?C.bg2:"transparent",color:active?C.ac:C.mu,fontSize:18,cursor:active?"pointer":"not-allowed",opacity:active?1:.4,fontFamily:"inherit"})

    return (
      <div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",marginBottom:16}}>
          <button onClick={() => prev && setCurrentWeek(prev)} disabled={!prev} style={navBtn(!!prev)}>←</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:C.mu,letterSpacing:".8px"}}>VECKA</div>
            <div style={{fontSize:26,fontWeight:600,lineHeight:1.1}}>V{currentWeek}</div>
          </div>
          <button onClick={() => next && setCurrentWeek(next)} disabled={!next} style={navBtn(!!next)}>→</button>
        </div>
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8}}>
          {PLANERING_ANSTALLDA.map(a => {
            const b = bokningar.find(b => b.anstalldId === a.id && b.vecka === currentWeek)
            const p = b ? findProjekt(b.projektId) : null
            const c = p ? colorFor(p) : null
            return (
              <button key={a.id} onClick={() => b && p ? openBokningInfo(b,a,p) : openPickProjekt(a.id, currentWeek)} style={{display:"flex",alignItems:"center",gap:12,background:C.bg2,border:`1px solid ${C.b}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"inherit"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{initialer(a.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:500,color:C.tx}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
                {p ? (
                  <div style={{background:c.bg,border:`1px solid ${c.border}`,color:c.text,padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:500,whiteSpace:"nowrap",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",flexShrink:0}}>{p.namn}</div>
                ) : (
                  <span style={{fontSize:12,color:C.mu,fontStyle:"italic",flexShrink:0}}>Ledig +</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── PER PROJEKT ───────────────────────────────────────────────────────
  function renderProjektVy() {
    return (
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
        {PROJEKT_LIST.map(p => {
          const c = colorFor(p)
          const projBokningar = bokningar.filter(b => b.projektId === p.id)
          const totalPersoner = new Set(projBokningar.map(b => b.anstalldId)).size
          return (
            <div key={p.id} style={{background:C.bg2,border:`1px solid ${c.border}`,borderRadius:14,padding:"14px 0"}}>
              <div style={{padding:"0 16px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <div style={{width:10,height:10,borderRadius:3,background:c.text}}/>
                  <div style={{fontSize:15,fontWeight:600}}>{p.namn}</div>
                </div>
                <div style={{fontSize:12,color:C.mu}}>📍 {p.plats} · {p.arbete}</div>
                <div style={{fontSize:11,color:C.mu,marginTop:4}}>{totalPersoner} {totalPersoner === 1 ? "person" : "personer"} bokade · {projBokningar.length} v totalt</div>
              </div>
              <div style={{overflowX:"auto",padding:"0 16px"}}>
                <div style={{display:"flex",gap:6,minWidth:"max-content",paddingBottom:4}}>
                  {WEEKS.map(w => {
                    const wb = projBokningar.filter(b => b.vecka === w)
                    return (
                      <button key={w} onClick={() => openPickAnstalld(p.id, w)} style={{minWidth:64,flexShrink:0,background:wb.length>0?c.bg:C.bg3,border:`1px solid ${wb.length>0?c.border:C.b}`,borderRadius:8,padding:6,cursor:"pointer",textAlign:"center",fontFamily:"inherit",minHeight:68,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                        <div style={{fontSize:10,color:C.mu,fontWeight:500}}>V{w}</div>
                        {wb.length > 0 ? (
                          <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                            {wb.map(b => {
                              const a = findAnstalld(b.anstalldId)
                              return a ? <div key={b.id} title={a.name} style={{width:22,height:22,borderRadius:"50%",background:c.text,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,lineHeight:1}}>{initialer(a.name)}</div> : null
                            })}
                          </div>
                        ) : (
                          <div style={{fontSize:18,color:C.mu,lineHeight:1}}>+</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ─── PER PERSON ────────────────────────────────────────────────────────
  function renderPersonVy() {
    return (
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
        {PLANERING_ANSTALLDA.map(a => {
          const personBokningar = bokningar.filter(b => b.anstalldId === a.id)
          return (
            <div key={a.id} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"14px 0"}}>
              <div style={{padding:"0 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{initialer(a.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
                <span style={{fontSize:11,color:C.mu,flexShrink:0}}>{personBokningar.length} v bokade</span>
              </div>
              <div style={{overflowX:"auto",padding:"0 16px"}}>
                <div style={{display:"flex",gap:4,minWidth:"max-content",paddingBottom:4}}>
                  {WEEKS.map(w => {
                    const b = personBokningar.find(b => b.vecka === w)
                    const p = b ? findProjekt(b.projektId) : null
                    const c = p ? colorFor(p) : null
                    return (
                      <button key={w} onClick={() => b && p ? openBokningInfo(b,a,p) : openPickProjekt(a.id, w)} style={{minWidth:74,flexShrink:0,background:p?c.bg:C.bg3,border:`1px solid ${p?c.border:C.b}`,borderRadius:8,padding:"6px 4px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",minHeight:60,display:"flex",flexDirection:"column",justifyContent:"center",gap:3}}>
                        <div style={{fontSize:10,color:C.mu,fontWeight:500}}>V{w}</div>
                        {p ? (
                          <div style={{fontSize:11,color:c.text,fontWeight:500,lineHeight:1.2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",padding:"0 2px"}}>{p.namn}</div>
                        ) : (
                          <div style={{fontSize:16,color:C.mu,lineHeight:1}}>+</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ─── PICKER MODAL ──────────────────────────────────────────────────────
  function renderPicker() {
    const overlay = {position:"fixed",inset:0,background:"rgba(13,31,53,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,padding:0}
    const sheet = {background:C.bg,borderTopLeftRadius:18,borderTopRightRadius:18,padding:"20px 20px 28px",maxWidth:430,width:"100%",maxHeight:"82vh",overflowY:"auto",boxShadow:"0 -10px 40px rgba(0,0,0,.18)"}

    if (picker.mode === "projekt") {
      const a = findAnstalld(picker.anstalldId)
      return (
        <div onClick={() => setPicker(null)} style={overlay}>
          <div onClick={e => e.stopPropagation()} style={sheet}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:C.mu,letterSpacing:".5px"}}>BOKA · VECKA {picker.vecka}</div>
              <div style={{fontSize:18,fontWeight:600,marginTop:4}}>{a?.name}</div>
              <div style={{fontSize:13,color:C.mu}}>Välj projekt</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {PROJEKT_LIST.map(p => {
                const c = colorFor(p)
                return (
                  <button key={p.id} onClick={() => handleProjektSelect(p.id)} style={{display:"flex",alignItems:"center",gap:12,background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                    <div style={{width:6,height:36,borderRadius:3,background:c.text,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:c.text}}>{p.namn}</div>
                      <div style={{fontSize:12,color:C.mu,marginTop:1}}>📍 {p.plats} · {p.arbete}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setPicker(null)} style={btnG}>Avbryt</button>
          </div>
        </div>
      )
    }

    if (picker.mode === "anstalld") {
      const p = findProjekt(picker.projektId)
      const c = p ? colorFor(p) : null
      return (
        <div onClick={() => setPicker(null)} style={overlay}>
          <div onClick={e => e.stopPropagation()} style={sheet}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:C.mu,letterSpacing:".5px"}}>VECKA {picker.vecka}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:4}}>
                <div style={{width:10,height:10,borderRadius:3,background:c?.text}}/>
                <div style={{fontSize:18,fontWeight:600}}>{p?.namn}</div>
              </div>
              <div style={{fontSize:13,color:C.mu}}>Välj anställd att lägga till</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
              {PLANERING_ANSTALLDA.map(a => {
                const befintlig = bokningar.find(b => b.anstalldId === a.id && b.vecka === picker.vecka)
                const befintligProj = befintlig ? findProjekt(befintlig.projektId) : null
                const redanHar = befintlig && befintlig.projektId === picker.projektId
                return (
                  <button key={a.id} onClick={() => !redanHar && handleAnstalldSelect(a.id)} disabled={redanHar} style={{display:"flex",alignItems:"center",gap:12,background:C.bg2,border:`1px solid ${C.b}`,borderRadius:10,padding:"10px 12px",cursor:redanHar?"not-allowed":"pointer",textAlign:"left",fontFamily:"inherit",opacity:redanHar?.5:1}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:C.ac,flexShrink:0}}>{initialer(a.name)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:500}}>{a.name}</div>
                      <div style={{fontSize:11,color:C.mu}}>{redanHar ? "Redan bokad här" : befintligProj ? `Just nu: ${befintligProj.namn}` : a.roll}</div>
                    </div>
                    {befintlig && !redanHar && <span style={{fontSize:10,color:C.da,fontWeight:500,flexShrink:0}}>BYTER</span>}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setPicker(null)} style={btnG}>Avbryt</button>
          </div>
        </div>
      )
    }

    if (picker.mode === "info") {
      const c = picker.projekt ? colorFor(picker.projekt) : null
      return (
        <div onClick={() => setPicker(null)} style={overlay}>
          <div onClick={e => e.stopPropagation()} style={sheet}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:11,color:C.mu,letterSpacing:".5px"}}>BOKNING · VECKA {picker.bokning.vecka}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:6,background:c.bg,border:`1px solid ${c.border}`,padding:"6px 12px",borderRadius:8}}>
                <div style={{width:8,height:8,borderRadius:2,background:c.text}}/>
                <div style={{fontSize:15,fontWeight:600,color:c.text}}>{picker.projekt?.namn}</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
              <div style={card}>
                <div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Anställd</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:C.ac}}>{initialer(picker.anstalld.name)}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{picker.anstalld.name}</div>
                    <div style={{fontSize:12,color:C.mu}}>{picker.anstalld.roll}</div>
                  </div>
                </div>
              </div>
              <div style={card}>
                <div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Plats</div>
                <div style={{fontSize:14}}>📍 {picker.projekt.plats}</div>
                <div style={{fontSize:12,color:C.mu,marginTop:2}}>{picker.projekt.arbete}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleRemove} style={{...btnG,flex:1,borderColor:"rgba(198,40,40,.3)",color:C.da}}>Ta bort bokning</button>
              <button onClick={() => setPicker(null)} style={{...btnP,flex:1}}>OK</button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Planering</h1>
          <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,color:C.ac,background:"rgba(232,184,75,.15)"}}>{bokningar.length} bokningar</span>
        </div>
        <div style={{fontSize:13,color:C.mu,marginBottom:14}}>{PLANERING_ANSTALLDA.length} anställda · {PROJEKT_LIST.length} projekt · V{WEEKS[0]}–V{WEEKS[WEEKS.length-1]}</div>
      </div>
      <div style={{padding:"0 20px 16px",display:"flex",gap:6}}>
        {[{id:"vecka",l:"Veckovy"},{id:"projekt",l:"Per projekt"},{id:"person",l:"Per person"}].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{flex:1,padding:"9px 4px",borderRadius:8,border:`1px solid ${view===v.id?C.ac:C.b}`,background:view===v.id?"rgba(21,101,192,.08)":C.bg2,color:view===v.id?C.ac:C.mu,fontWeight:view===v.id?500:400,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{v.l}</button>
        ))}
      </div>
      {view === "vecka"   && renderVeckoVy()}
      {view === "projekt" && renderProjektVy()}
      {view === "person"  && renderPersonVy()}
      {picker && renderPicker()}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ── PROJEKTERING-modul (Företag) ──────────────────────────────────────
// 5 underkomponenter: Projektering (wrapper m. tabs) · ProjektLista ·
// SkapaProjekt · ProjektDetalj · ProjekteringPlaneringsvy.
// Helt separat från Planering-fliken — eget datalager.
// ═══════════════════════════════════════════════════════════════════════

const statusBadge = (status) => {
  const s = PROJEKT_STATUS_STYLE[status] || PROJEKT_STATUS_STYLE.Offert
  return <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,background:s.bg,color:s.text,border:`1px solid ${s.border}`}}>{status}</span>
}

// ── Projektering (wrapper) ────────────────────────────────────────────
function Projektering({projekt, bokningar, tidsrapporter, projektAvvikelser, onAddBokning, onRemoveBokning, navigate}) {
  const [tab, setTab] = useState("lista") // lista | planeringsvy

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Projektering</h1>
          <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,color:C.ac,background:"rgba(232,184,75,.15)"}}>{projekt.length} projekt</span>
        </div>
        <div style={{fontSize:13,color:C.mu,marginBottom:14}}>Hantera projekt, bemanning och tidsrapporter</div>
      </div>
      <div style={{padding:"0 20px 16px",display:"flex",gap:6}}>
        {[{id:"lista",l:"Projektlista"},{id:"planeringsvy",l:"Planeringsvy"}].map(v => (
          <button key={v.id} onClick={() => setTab(v.id)} style={{flex:1,padding:"9px 4px",borderRadius:8,border:`1px solid ${tab===v.id?C.ac:C.b}`,background:tab===v.id?"rgba(21,101,192,.08)":C.bg2,color:tab===v.id?C.ac:C.mu,fontWeight:tab===v.id?500:400,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{v.l}</button>
        ))}
      </div>
      {tab === "lista" && <ProjektLista projekt={projekt} bokningar={bokningar} tidsrapporter={tidsrapporter} navigate={navigate}/>}
      {tab === "planeringsvy" && <ProjekteringPlaneringsvy projekt={projekt} bokningar={bokningar} onAddBokning={onAddBokning} onRemoveBokning={onRemoveBokning}/>}
    </div>
  )
}

// ── ProjektLista — sökbar och filterbar projektlista ──────────────────
function ProjektLista({projekt, bokningar, tidsrapporter, navigate}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(null) // null = alla

  const filtered = projekt.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return p.namn.toLowerCase().includes(s) ||
           p.nummer.toLowerCase().includes(s) ||
           p.bestallare.toLowerCase().includes(s) ||
           p.plats.toLowerCase().includes(s)
  })

  const statusCounts = PROJEKT_STATUS_LIST.reduce((acc, s) => ({...acc, [s]: projekt.filter(p => p.status === s).length}), {})

  return (
    <div style={{padding:"0 20px"}}>
      <button onClick={() => navigate("skapa-projekt")} style={{...btnP,marginBottom:12}}>+ Skapa nytt projekt</button>

      <input style={{...inp,marginBottom:10}} placeholder="🔍 Sök projekt, beställare, plats..." value={search} onChange={e => setSearch(e.target.value)}/>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,overflowX:"auto"}}>
        <button onClick={() => setStatusFilter(null)} style={{fontSize:12,padding:"5px 11px",borderRadius:14,border:`1px solid ${statusFilter===null?C.ac:C.b}`,background:statusFilter===null?"rgba(21,101,192,.1)":C.bg2,color:statusFilter===null?C.ac:C.mu,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Alla ({projekt.length})</button>
        {PROJEKT_STATUS_LIST.map(s => {
          const sel = statusFilter === s
          const style = PROJEKT_STATUS_STYLE[s]
          return (
            <button key={s} onClick={() => setStatusFilter(sel ? null : s)} style={{fontSize:12,padding:"5px 11px",borderRadius:14,border:`1px solid ${sel?style.text:C.b}`,background:sel?style.bg:C.bg2,color:sel?style.text:C.mu,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?500:400,whiteSpace:"nowrap"}}>{s} ({statusCounts[s]})</button>
          )
        })}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length === 0 ? (
          <div style={{...card,textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:32,marginBottom:10}}>🔍</div>
            <div style={{color:C.mu,fontSize:14}}>Inga projekt matchar din sökning</div>
          </div>
        ) : filtered.map(p => {
          const totalTimmar = tidsrapporter.filter(tr => tr.projektId === p.id).reduce((sum, tr) => sum + tr.timmar, 0)
          const personerCount = new Set(bokningar.filter(b => b.projektId === p.id).map(b => b.anstalldId)).size
          const procent = p.budget ? Math.min(100, Math.round(totalTimmar / p.budget * 100)) : 0
          const projColor = PROJECT_PALETTE[p.farg % PROJECT_PALETTE.length]
          return (
            <button key={p.id} onClick={() => navigate("projekt-detalj", p)} style={{...card,textAlign:"left",cursor:"pointer",width:"100%",transition:"border-color .15s"}}
              onMouseOver={e => e.currentTarget.style.borderColor = C.b2}
              onMouseOut={e => e.currentTarget.style.borderColor = C.b}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:8}}>
                <div style={{minWidth:0,flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <div style={{width:8,height:8,borderRadius:2,background:projColor.text,flexShrink:0}}/>
                    <span style={{fontSize:11,color:C.mu,fontWeight:500,letterSpacing:".3px"}}>{p.nummer}</span>
                  </div>
                  <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px"}}>{p.namn}</div>
                </div>
                {statusBadge(p.status)}
              </div>
              <div style={{color:C.mu,fontSize:13,marginBottom:3}}>📍 {p.plats}</div>
              <div style={{color:C.mu,fontSize:12,marginBottom:10}}>{p.bestallare}</div>
              {p.budget > 0 && (
                <div style={{marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.mu,marginBottom:4}}>
                    <span>{totalTimmar} / {p.budget} h</span>
                    <span>{procent}%</span>
                  </div>
                  <div style={{height:4,background:C.bg3,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${procent}%`,background:procent>=90?C.da:procent>=70?"#b88a00":C.ok,transition:"width .3s"}}/>
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:10,fontSize:11,color:C.mu,marginTop:8}}>
                <span>👥 {personerCount} {personerCount === 1 ? "person" : "personer"}</span>
                {p.start && p.slut && <span>📅 {p.start} → {p.slut}</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── SkapaProjekt — 2-stegs wizard: 1) projektinfo  2) välj anställda ─
function SkapaProjekt({navigate, onSave, antalProjekt}) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    nummer: `PRJ-2026-${String(antalProjekt + 200).padStart(3,"0")}`,
    namn: "",
    bestallare: "",
    plats: "",
    omfattning: "",
    arbetstider: "",
    arbetsorder: "",
    arbetsledare: "",
    kontaktperson: "",
    uppgifter: "",
    extra: "",
    start: "",
    slut: "",
    budget: "",
    status: "Offert",
    farg: (antalProjekt) % PROJECT_PALETTE.length,
  })
  const [selectedAnstallda, setSelectedAnstallda] = useState([])
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setData(d => ({...d, [k]:v}))
  const valid = () => data.namn.trim() && data.bestallare.trim()

  function toggleAnstalld(id) {
    setSelectedAnstallda(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function nextStep() { if (valid()) setStep(2) }

  function save() {
    if (!valid()) return
    onSave({...data, budget: parseInt(data.budget) || 0}, selectedAnstallda)
    setSaved(true)
  }

  if (saved) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>📁</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Projekt skapat!</h2>
      <p style={{color:C.mu,fontSize:15,marginBottom:4}}>{data.nummer} · {data.namn}</p>
      {selectedAnstallda.length > 0 && (
        <p style={{color:C.ok,fontSize:14,marginTop:8}}>📨 {selectedAnstallda.length} {selectedAnstallda.length === 1 ? "anställd har" : "anställda har"} notifierats</p>
      )}
      <button style={{...btnP,maxWidth:280,marginTop:32}} onClick={() => navigate("projektering")}>Tillbaka till projektlistan</button>
    </div>
  )

  const Section = ({title, children}) => (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase",marginBottom:8,marginTop:8}}>{title}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{children}</div>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => step === 1 ? navigate("projektering") : setStep(1)} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{fontWeight:600,fontSize:15}}>{step === 1 ? "Skapa nytt projekt" : "Välj anställda"}</div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[1,2].map(n => <div key={n} style={{width:24,height:3,borderRadius:2,background:n<=step?C.ac:C.b}}/>)}
        </div>
      </div>

      {step === 1 && (
        <div style={{padding:"16px 20px 24px"}}>
          <Section title="Grundinfo">
            <div><label style={lbl}>Projektnummer</label><input style={inp} value={data.nummer} onChange={e => set("nummer", e.target.value)}/></div>
            <div><label style={lbl}>Projektnamn *</label><input style={inp} value={data.namn} onChange={e => set("namn", e.target.value)} placeholder="t.ex. Spårjustering Falun"/></div>
            <div><label style={lbl}>Beställare *</label><input style={inp} value={data.bestallare} onChange={e => set("bestallare", e.target.value)} placeholder="t.ex. Trafikverket"/></div>
            <div>
              <label style={lbl}>Status</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {PROJEKT_STATUS_LIST.map(s => {
                  const sel = data.status === s
                  const style = PROJEKT_STATUS_STYLE[s]
                  return (
                    <button key={s} onClick={() => set("status", s)} style={{fontSize:12,padding:"7px 11px",borderRadius:8,border:`1px solid ${sel?style.text:C.b}`,background:sel?style.bg:C.bg2,color:sel?style.text:C.mu,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?500:400}}>{s}</button>
                  )
                })}
              </div>
            </div>
          </Section>

          <Section title="Plats & tider">
            <div><label style={lbl}>Arbetsplats / plats</label><input style={inp} value={data.plats} onChange={e => set("plats", e.target.value)} placeholder="t.ex. Härnösand–Kramfors"/></div>
            <div><label style={lbl}>Arbetstider</label><input style={inp} value={data.arbetstider} onChange={e => set("arbetstider", e.target.value)} placeholder="t.ex. Mån–Fre 06:00–16:00"/></div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><label style={lbl}>Startdatum</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.start} onChange={e => set("start", e.target.value)}/></div>
              <div style={{flex:1}}><label style={lbl}>Slutdatum</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.slut} onChange={e => set("slut", e.target.value)}/></div>
            </div>
          </Section>

          <Section title="Arbete">
            <div><label style={lbl}>Huvudsakliga arbetsuppgifter</label><textarea style={{...inp,height:70,resize:"none"}} value={data.uppgifter} onChange={e => set("uppgifter", e.target.value)} placeholder="Beskriv kärnan i arbetet..."/></div>
            <div><label style={lbl}>Omfattning (material, verktyg)</label><textarea style={{...inp,height:70,resize:"none"}} value={data.omfattning} onChange={e => set("omfattning", e.target.value)} placeholder="t.ex. Räls 8 km, ballast 2400 ton, grävmaskin, termitsvets"/></div>
          </Section>

          <Section title="Personal & kontakt">
            <div><label style={lbl}>Arbetsledare</label><input style={inp} value={data.arbetsledare} onChange={e => set("arbetsledare", e.target.value)} placeholder="Namn på ansvarig arbetsledare"/></div>
            <div><label style={lbl}>Arbetsorder</label><input style={inp} value={data.arbetsorder} onChange={e => set("arbetsorder", e.target.value)} placeholder="t.ex. AO-2026-0118"/></div>
            <div><label style={lbl}>Kontaktperson (beställare)</label><input style={inp} value={data.kontaktperson} onChange={e => set("kontaktperson", e.target.value)} placeholder="Namn · telefon"/></div>
          </Section>

          <Section title="Övrigt">
            <div><label style={lbl}>Budget (timmar)</label><input style={inp} type="number" min="0" step="1" value={data.budget} onChange={e => set("budget", e.target.value)} placeholder="t.ex. 1200"/></div>
            <div><label style={lbl}>Extra info / anteckningar</label><textarea style={{...inp,height:80,resize:"none"}} value={data.extra} onChange={e => set("extra", e.target.value)} placeholder="Övriga noteringar..."/></div>
          </Section>

          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button style={{...btnG,flex:1}} onClick={() => navigate("projektering")}>Avbryt</button>
            <button style={{...btnP,flex:1}} onClick={nextStep} disabled={!valid()}>Fortsätt → Välj anställda</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{padding:"16px 20px 24px"}}>
          <div style={{background:"rgba(21,101,192,.06)",border:`1px solid ${C.b}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.mu,lineHeight:1.5,marginBottom:14}}>
            Klicka för att välja anställda till <strong style={{color:C.tx}}>{data.namn}</strong>. Varje vald person får en notis med all projektinfo och måste markera den sedd.
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase"}}>Tillgängliga anställda ({PLANERING_ANSTALLDA.length})</div>
            <span style={{fontSize:12,color:C.ac,fontWeight:500}}>{selectedAnstallda.length} valda</span>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {PLANERING_ANSTALLDA.map(a => {
              const sel = selectedAnstallda.includes(a.id)
              return (
                <button key={a.id} onClick={() => toggleAnstalld(a.id)}
                  style={{display:"flex",alignItems:"center",gap:12,background:sel?"rgba(21,101,192,.06)":C.bg2,border:`1px solid ${sel?C.ac:C.b}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"inherit"}}>
                  <div style={{width:22,height:22,borderRadius:5,border:`2px solid ${sel?C.ac:C.b2}`,background:sel?C.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {sel && <span style={{fontSize:12,color:"#fff",fontWeight:700,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:C.ac,flexShrink:0}}>{a.name.split(" ").map(n => n[0]).join("")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:500,color:C.tx}}>{a.name}</div>
                    <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedAnstallda.length > 0 && (
            <div style={{background:"rgba(46,125,50,.08)",border:"1px solid rgba(46,125,50,.25)",borderRadius:10,padding:"10px 14px",fontSize:13,color:C.ok,marginBottom:14,lineHeight:1.5}}>
              📨 {selectedAnstallda.length} {selectedAnstallda.length === 1 ? "anställd kommer få" : "anställda kommer få"} en notis med all projektinfo att kvittera.
            </div>
          )}

          <div style={{display:"flex",gap:10}}>
            <button style={{...btnG,flex:1}} onClick={() => setStep(1)}>Tillbaka</button>
            <button style={{...btnP,flex:1}} onClick={save}>Spara projekt {selectedAnstallda.length > 0 ? `(${selectedAnstallda.length} st)` : ""}</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ProjektDetalj — fullständig vy av ett projekt ─────────────────────
function ProjektDetalj({projekt, bokningar, tidsrapporter, projektAvvikelser, projektNotiser, navigate}) {
  if (!projekt) return <div style={{padding:30,textAlign:"center"}}>Projekt hittades inte</div>

  const projColor = PROJECT_PALETTE[projekt.farg % PROJECT_PALETTE.length]
  const projBokningar = bokningar.filter(b => b.projektId === projekt.id)
  const projTidsrapporter = tidsrapporter.filter(tr => tr.projektId === projekt.id).sort((a,b) => b.datum.localeCompare(a.datum))
  const projAvvikelser = projektAvvikelser.filter(av => av.projektId === projekt.id)
  const totalTimmar = projTidsrapporter.reduce((sum, tr) => sum + tr.timmar, 0)
  const procent = projekt.budget ? Math.min(100, Math.round(totalTimmar / projekt.budget * 100)) : 0

  // Gruppera bokningar per anställd
  const bokningarPerAnstalld = {}
  projBokningar.forEach(b => {
    if (!bokningarPerAnstalld[b.anstalldId]) bokningarPerAnstalld[b.anstalldId] = []
    bokningarPerAnstalld[b.anstalldId].push(b.vecka)
  })
  const anstalldaPaProjekt = Object.keys(bokningarPerAnstalld).map(id => ({
    a: PLANERING_ANSTALLDA.find(x => x.id === id),
    veckor: bokningarPerAnstalld[id].sort((a,b) => a - b),
  })).filter(x => x.a)

  const InfoRow = ({label, value}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${C.b}`}}>
      <span style={{fontSize:12,color:C.mu,flexShrink:0,minWidth:90}}>{label}</span>
      <span style={{fontSize:13,textAlign:"right",lineHeight:1.5}}>{value || <span style={{color:C.mu,fontStyle:"italic"}}>—</span>}</span>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("projektering")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontSize:11,color:C.mu}}>{projekt.nummer}</div>
          <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{projekt.namn}</div>
        </div>
      </div>

      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
        {/* Hero card */}
        <div style={{background:projColor.bg,border:`1px solid ${projColor.border}`,borderRadius:14,padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:10,height:10,borderRadius:3,background:projColor.text}}/>
              <span style={{fontSize:11,color:projColor.text,fontWeight:600,letterSpacing:".5px"}}>{projekt.nummer}</span>
            </div>
            {statusBadge(projekt.status)}
          </div>
          <div style={{fontSize:17,fontWeight:600,color:projColor.text,marginBottom:4}}>{projekt.namn}</div>
          <div style={{fontSize:13,color:projColor.text,opacity:.85}}>📍 {projekt.plats}</div>
          <div style={{fontSize:13,color:projColor.text,opacity:.85,marginTop:2}}>👤 {projekt.bestallare}</div>
        </div>

        {/* Budget vs rapporterad */}
        {projekt.budget > 0 && (
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase"}}>Budget & rapporterat</div>
              <div style={{fontSize:18,fontWeight:600,color:procent>=90?C.da:procent>=70?"#b88a00":C.ok}}>{procent}%</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.tx,marginBottom:6}}>
              <span><strong>{totalTimmar}</strong> h rapporterat</span>
              <span style={{color:C.mu}}>av {projekt.budget} h budget</span>
            </div>
            <div style={{height:8,background:C.bg3,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${procent}%`,background:procent>=90?C.da:procent>=70?"#b88a00":C.ok,transition:"width .3s"}}/>
            </div>
            {procent >= 90 && <div style={{fontSize:12,color:C.da,marginTop:8}}>⚠ Närmar sig budget — granska tidsrapporter</div>}
          </div>
        )}

        {/* Detaljer */}
        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase",marginBottom:10}}>Projektdetaljer</div>
          <InfoRow label="Startdatum"    value={projekt.start}/>
          <InfoRow label="Slutdatum"     value={projekt.slut}/>
          <InfoRow label="Arbetstider"   value={projekt.arbetstider}/>
          <InfoRow label="Arbetsorder"   value={projekt.arbetsorder}/>
          <InfoRow label="Arbetsledare"  value={projekt.arbetsledare}/>
          <InfoRow label="Kontaktperson" value={projekt.kontaktperson}/>
        </div>

        {projekt.uppgifter && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Arbetsuppgifter</div>
            <div style={{fontSize:14,lineHeight:1.6}}>{projekt.uppgifter}</div>
          </div>
        )}

        {projekt.omfattning && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Omfattning</div>
            <div style={{fontSize:14,lineHeight:1.6}}>{projekt.omfattning}</div>
          </div>
        )}

        {projekt.extra && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Extra info</div>
            <div style={{fontSize:14,lineHeight:1.6}}>{projekt.extra}</div>
          </div>
        )}

        {/* Bokade anställda */}
        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase",marginBottom:12}}>Bokade anställda ({anstalldaPaProjekt.length})</div>
          {anstalldaPaProjekt.length === 0 ? (
            <div style={{fontSize:13,color:C.mu,fontStyle:"italic"}}>Ingen bemanning än — boka i Planeringsvyn</div>
          ) : (
            anstalldaPaProjekt.map(({a, veckor}, i) => (
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:i<anstalldaPaProjekt.length-1?10:0,marginBottom:i<anstalldaPaProjekt.length-1?10:0,borderBottom:i<anstalldaPaProjekt.length-1?`1px solid ${C.b}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{a.name.split(" ").map(n => n[0]).join("")}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:500}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:160}}>
                  {veckor.map(v => (
                    <span key={v} style={{fontSize:10,background:projColor.bg,color:projColor.text,border:`1px solid ${projColor.border}`,padding:"2px 6px",borderRadius:4,fontWeight:500}}>V{v}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notiser kvitterade — vem har sett att de lagts till */}
        {(() => {
          const notiser = (projektNotiser || []).filter(n => n.projektId === projekt.id)
          if (notiser.length === 0) return null
          const seenCount = notiser.filter(n => n.sedd).length
          return (
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase"}}>👁 Notiser kvitterade</div>
                <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:20,color:seenCount===notiser.length?C.ok:C.ac,background:seenCount===notiser.length?"rgba(46,125,50,.12)":"rgba(232,184,75,.15)"}}>{seenCount}/{notiser.length} sett</span>
              </div>
              {notiser.map((n, i) => {
                const a = PLANERING_ANSTALLDA.find(x => x.id === n.anstalldId)
                if (!a) return null
                const last = i === notiser.length - 1
                return (
                  <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:last?0:10,marginBottom:last?0:10,borderBottom:last?"none":`1px solid ${C.b}`}}>
                    <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{n.sedd ? "✅" : "⏳"}</span>
                    <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{a.name.split(" ").map(x => x[0]).join("")}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:500}}>{a.name}</div>
                      <div style={{fontSize:12,color:n.sedd?C.ok:C.mu,marginTop:2}}>{n.sedd ? `Sedd ${n.kvitteradTid}` : "Ej sedd"}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Tidsrapporter */}
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase"}}>Tidsrapporter ({projTidsrapporter.length})</div>
            <span style={{fontSize:12,color:C.tx,fontWeight:500}}>{totalTimmar} h totalt</span>
          </div>
          {projTidsrapporter.length === 0 ? (
            <div style={{fontSize:13,color:C.mu,fontStyle:"italic"}}>Inga tidsrapporter än</div>
          ) : (
            projTidsrapporter.map((tr, i) => {
              const typColor = tr.typ === "Övertid" ? C.da : tr.typ === "Restid" ? "#b88a00" : C.mu
              return (
                <div key={tr.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,paddingBottom:i<projTidsrapporter.length-1?10:0,marginBottom:i<projTidsrapporter.length-1?10:0,borderBottom:i<projTidsrapporter.length-1?`1px solid ${C.b}`:"none"}}>
                  <div style={{minWidth:0,flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <span style={{fontSize:13,fontWeight:500}}>{tr.anstalldNamn}</span>
                      <span style={{fontSize:10,padding:"1px 6px",borderRadius:10,background:typColor==C.mu?C.bg3:typColor==="#b88a00"?"rgba(232,184,75,.15)":"rgba(224,82,82,.12)",color:typColor,fontWeight:500}}>{tr.typ}</span>
                    </div>
                    <div style={{fontSize:11,color:C.mu}}>{tr.datum}{tr.kommentar?` · ${tr.kommentar}`:""}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,flexShrink:0}}>{tr.timmar}h</div>
                </div>
              )
            })
          )}
        </div>

        {/* Avvikelser */}
        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".5px",color:C.mu,textTransform:"uppercase",marginBottom:12}}>Avvikelser ({projAvvikelser.length})</div>
          {projAvvikelser.length === 0 ? (
            <div style={{fontSize:13,color:C.mu,fontStyle:"italic"}}>Inga avvikelser kopplade till projektet</div>
          ) : (
            projAvvikelser.map((av, i) => (
              <div key={av.id} style={{display:"flex",gap:10,paddingBottom:i<projAvvikelser.length-1?10:0,marginBottom:i<projAvvikelser.length-1?10:0,borderBottom:i<projAvvikelser.length-1?`1px solid ${C.b}`:"none",opacity:av.status==="closed"?.6:1}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:av.status==="open"?C.da:C.ok,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,lineHeight:1.5}}>{av.text}</div>
                  <div style={{fontSize:11,color:C.mu,marginTop:3}}>{av.av} · {av.datum} {av.status==="closed"?"· ✓ stängd":""}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ── ProjekteringPlaneringsvy — vecko-kalender alla anställda × veckor ──
function ProjekteringPlaneringsvy({projekt, bokningar, onAddBokning, onRemoveBokning}) {
  const [picker, setPicker] = useState(null) // {mode:"projekt"|"info", ...}
  const findProjekt  = id => projekt.find(p => p.id === id)
  const findAnstalld = id => PLANERING_ANSTALLDA.find(a => a.id === id)
  const colorFor     = p  => PROJECT_PALETTE[p.farg % PROJECT_PALETTE.length]
  const initialer    = n  => n.split(" ").map(x => x[0]).join("")

  function openPickProjekt(anstalldId, vecka) { setPicker({mode:"projekt", anstalldId, vecka}) }
  function openBokningInfo(b, a, p)           { setPicker({mode:"info", bokning:b, anstalld:a, projekt:p}) }
  function handleProjektSelect(projektId)     { onAddBokning({anstalldId:picker.anstalldId, projektId, vecka:picker.vecka}); setPicker(null) }
  function handleRemove()                     { onRemoveBokning(picker.bokning.id); setPicker(null) }

  return (
    <div>
      <div style={{padding:"0 20px 10px"}}>
        <div style={{background:"rgba(21,101,192,.06)",border:`1px solid ${C.b}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.mu,lineHeight:1.5}}>
          Klicka på en tom cell för att boka, en bokad cell för info/ta bort. Färgkodat per projekt.
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
        {PLANERING_ANSTALLDA.map(a => {
          const personBokningar = bokningar.filter(b => b.anstalldId === a.id)
          return (
            <div key={a.id} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"14px 0"}}>
              <div style={{padding:"0 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.ac,flexShrink:0}}>{initialer(a.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
                <span style={{fontSize:11,color:C.mu,flexShrink:0}}>{personBokningar.length} v</span>
              </div>
              <div style={{overflowX:"auto",padding:"0 16px"}}>
                <div style={{display:"flex",gap:4,minWidth:"max-content",paddingBottom:4}}>
                  {WEEKS.map(w => {
                    const b = personBokningar.find(b => b.vecka === w)
                    const p = b ? findProjekt(b.projektId) : null
                    const c = p ? colorFor(p) : null
                    return (
                      <button key={w} onClick={() => b && p ? openBokningInfo(b,a,p) : openPickProjekt(a.id, w)} style={{minWidth:74,flexShrink:0,background:p?c.bg:C.bg3,border:`1px solid ${p?c.border:C.b}`,borderRadius:8,padding:"6px 4px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",minHeight:60,display:"flex",flexDirection:"column",justifyContent:"center",gap:3}}>
                        <div style={{fontSize:10,color:C.mu,fontWeight:500}}>V{w}</div>
                        {p ? (
                          <div style={{fontSize:11,color:c.text,fontWeight:500,lineHeight:1.2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",padding:"0 2px"}}>{p.namn}</div>
                        ) : (
                          <div style={{fontSize:16,color:C.mu,lineHeight:1}}>+</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {picker && (() => {
        const overlay = {position:"fixed",inset:0,background:"rgba(13,31,53,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,padding:0}
        const sheet = {background:C.bg,borderTopLeftRadius:18,borderTopRightRadius:18,padding:"20px 20px 28px",maxWidth:430,width:"100%",maxHeight:"82vh",overflowY:"auto",boxShadow:"0 -10px 40px rgba(0,0,0,.18)"}
        if (picker.mode === "projekt") {
          const a = findAnstalld(picker.anstalldId)
          return (
            <div onClick={() => setPicker(null)} style={overlay}>
              <div onClick={e => e.stopPropagation()} style={sheet}>
                <div style={{textAlign:"center",marginBottom:14}}>
                  <div style={{fontSize:11,color:C.mu,letterSpacing:".5px"}}>BOKA · VECKA {picker.vecka}</div>
                  <div style={{fontSize:18,fontWeight:600,marginTop:4}}>{a?.name}</div>
                  <div style={{fontSize:13,color:C.mu}}>Välj projekt</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                  {projekt.map(p => {
                    const c = colorFor(p)
                    return (
                      <button key={p.id} onClick={() => handleProjektSelect(p.id)} style={{display:"flex",alignItems:"center",gap:12,background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                        <div style={{width:6,height:36,borderRadius:3,background:c.text,flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:600,color:c.text}}>{p.namn}</div>
                          <div style={{fontSize:12,color:C.mu,marginTop:1}}>📍 {p.plats}</div>
                        </div>
                        {statusBadge(p.status)}
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => setPicker(null)} style={btnG}>Avbryt</button>
              </div>
            </div>
          )
        }
        if (picker.mode === "info") {
          const c = picker.projekt ? colorFor(picker.projekt) : null
          return (
            <div onClick={() => setPicker(null)} style={overlay}>
              <div onClick={e => e.stopPropagation()} style={sheet}>
                <div style={{textAlign:"center",marginBottom:18}}>
                  <div style={{fontSize:11,color:C.mu,letterSpacing:".5px"}}>BOKNING · VECKA {picker.bokning.vecka}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:6,background:c.bg,border:`1px solid ${c.border}`,padding:"6px 12px",borderRadius:8}}>
                    <div style={{width:8,height:8,borderRadius:2,background:c.text}}/>
                    <div style={{fontSize:15,fontWeight:600,color:c.text}}>{picker.projekt?.namn}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
                  <div style={card}>
                    <div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Anställd</div>
                    <div style={{fontSize:14,fontWeight:500}}>{picker.anstalld.name}</div>
                    <div style={{fontSize:12,color:C.mu}}>{picker.anstalld.roll}</div>
                  </div>
                  <div style={card}>
                    <div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Plats</div>
                    <div style={{fontSize:14}}>📍 {picker.projekt.plats}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={handleRemove} style={{...btnG,flex:1,borderColor:"rgba(198,40,40,.3)",color:C.da}}>Ta bort bokning</button>
                  <button onClick={() => setPicker(null)} style={{...btnP,flex:1}}>OK</button>
                </div>
              </div>
            </div>
          )
        }
      })()}
    </div>
  )
}

// ── RapporteraTid — arbetarens tidsrapporteringsskärm ─────────────────
function RapporteraTid({user, projekt, navigate, onSave}) {
  const [data, setData] = useState({
    projektId: "",
    datum: "2026-05-25",
    timmar: "",
    typ: "Normal",
    kommentar: "",
  })
  const [saved, setSaved] = useState(false)

  function set(k, v) { setData(d => ({...d, [k]:v})) }
  function save() {
    if (!data.projektId || !data.timmar) return
    onSave({
      projektId: data.projektId,
      anstalldNamn: user.name,
      datum: data.datum,
      timmar: parseFloat(data.timmar),
      typ: data.typ,
      kommentar: data.kommentar,
    })
    setSaved(true)
  }

  if (saved) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>⏱</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Tid rapporterad!</h2>
      <p style={{color:C.mu,fontSize:15}}>{data.timmar} h · {data.typ}</p>
      <div style={{display:"flex",gap:10,maxWidth:320,width:"100%",marginTop:32}}>
        <button style={{...btnG,flex:1}} onClick={() => { setData({projektId:"",datum:"2026-05-25",timmar:"",typ:"Normal",kommentar:""}); setSaved(false) }}>Rapportera fler</button>
        <button style={{...btnP,flex:1}} onClick={() => navigate("dagorder")}>Klar</button>
      </div>
    </div>
  )

  const aktivaProjekt = projekt.filter(p => p.status === "Pågående" || p.status === "Planering")

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("dagorder")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{fontWeight:600,fontSize:15}}>Rapportera tid</div>
      </div>
      <div style={{padding:"18px 20px 24px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={lbl}>Projekt *</label>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:260,overflowY:"auto"}}>
            {aktivaProjekt.map(p => {
              const sel = data.projektId === p.id
              const c = PROJECT_PALETTE[p.farg % PROJECT_PALETTE.length]
              return (
                <button key={p.id} onClick={() => set("projektId", p.id)} style={{display:"flex",alignItems:"center",gap:10,background:sel?c.bg:C.bg2,border:`1px solid ${sel?c.text:C.b}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${sel?c.text:C.b2}`,background:sel?c.text:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {sel && <span style={{fontSize:10,color:"#fff",fontWeight:700,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:500,color:sel?c.text:C.tx}}>{p.namn}</div>
                    <div style={{fontSize:11,color:C.mu}}>{p.plats}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div><label style={lbl}>Datum</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.datum} onChange={e => set("datum", e.target.value)}/></div>

        <div>
          <label style={lbl}>Antal timmar *</label>
          <input style={inp} type="number" min="0" max="24" step="0.5" value={data.timmar} onChange={e => set("timmar", e.target.value)} placeholder="t.ex. 8"/>
        </div>

        <div>
          <label style={lbl}>Typ</label>
          <div style={{display:"flex",gap:6}}>
            {["Normal","Övertid","Restid"].map(t => {
              const sel = data.typ === t
              return (
                <button key={t} onClick={() => set("typ", t)} style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${sel?C.ac:C.b}`,background:sel?"rgba(21,101,192,.08)":C.bg2,color:sel?C.ac:C.mu,fontWeight:sel?500:400,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>{t}</button>
              )
            })}
          </div>
        </div>

        <div><label style={lbl}>Kommentar (valfritt)</label><textarea style={{...inp,height:70,resize:"none"}} placeholder="Förklara övertid, restid eller annan information..." value={data.kommentar} onChange={e => set("kommentar", e.target.value)}/></div>

        <button style={{...btnP,marginTop:6}} onClick={save} disabled={!data.projektId || !data.timmar}>Skicka rapport</button>
      </div>
    </div>
  )
}

// ── Mina arbeten (arbetare / arbetsledare) — grupperat per status ──
function MinaArbeten() {
  const groups = [
    {key:"pagaende", l:"PÅGÅENDE"},
    {key:"kommande", l:"KOMMANDE"},
    {key:"klar",     l:"AVSLUTADE"},
  ]
  const Item = ({j}) => (
    <div style={card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{fontWeight:600,fontSize:15,flex:1,paddingRight:10}}>{j.uppg}</div>
        <Badge status={j.status}/>
      </div>
      <div style={{color:C.mu,fontSize:13,marginBottom:5}}>📍 {j.plats}</div>
      <div style={{color:C.mu,fontSize:13,marginBottom:10}}>🕐 {j.tid}</div>
      <div style={{fontSize:12,color:C.mu,background:"rgba(255,255,255,.04)",padding:"8px 10px",borderRadius:6}}><span style={{color:C.tx}}>Material: </span>{j.mat}</div>
    </div>
  )
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:18}}>Mina arbeten</h1>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:6}}>
        {groups.map(g => {
          const items = ARBETEN.filter(j => j.status === g.key)
          if (items.length === 0) return null
          return (
            <div key={g.key}>
              <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"12px 0 8px"}}>{g.l} ({items.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {items.map(j => <Item key={j.id} j={j}/>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Dagorder ─────────────────────────────────────────────────
function Dagorder({dagorder, andringar, onMarkSeen, navigate, user, projekt, projektNotiser, onMarkProjektNotisSeen}) {
  const d = dagorder
  const unseen = andringar.filter(a => !a.sedd)
  const seenAndringar = andringar.filter(a => a.sedd)

  // Projekt-notiser för inloggad användare — matchas på namn till PLANERING_ANSTALLDA
  const currentAnstalld = user ? PLANERING_ANSTALLDA.find(a => a.name === user.name) : null
  const minaOlasta = (currentAnstalld && projektNotiser && projekt)
    ? projektNotiser
        .filter(n => n.anstalldId === currentAnstalld.id && !n.sedd)
        .map(n => ({notis: n, p: projekt.find(x => x.id === n.projektId)}))
        .filter(x => x.p)
    : []
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Dagorder</h1>
          <span style={{fontSize:12,color:C.mu}}>{d.datum}</span>
        </div>
        <div style={{fontSize:13,color:C.mu,marginBottom:16}}>{d.proj}</div>
      </div>
      {minaOlasta.length > 0 && (
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          {minaOlasta.map(({notis, p}) => (
            <div key={notis.id} style={{background:"rgba(91,156,246,.08)",border:"1px solid rgba(91,156,246,.35)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontSize:11,color:"#3470cf",fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>📁 Tillagd på projekt</div>
                <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,background:PROJEKT_STATUS_STYLE[p.status]?.bg,color:PROJEKT_STATUS_STYLE[p.status]?.text,border:`1px solid ${PROJEKT_STATUS_STYLE[p.status]?.border}`}}>{p.status}</span>
              </div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{p.namn}</div>
              <div style={{fontSize:13,color:C.tx,marginBottom:12,lineHeight:1.5}}>
                Du har blivit tillagd på projekt <strong>{p.namn}</strong>. Läs all info och markera sedd.
              </div>
              <div style={{background:"rgba(255,255,255,.6)",border:`1px solid ${C.b}`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                {[
                  ["Plats",          p.plats],
                  ["Arbetstider",    p.arbetstider],
                  ["Arbetsledare",   p.arbetsledare],
                  ["Kontaktperson",  p.kontaktperson],
                  ["Arbetsuppgifter",p.uppgifter],
                ].map(([label, value], i, arr) => value ? (
                  <div key={label} style={{fontSize:12,marginBottom:i<arr.length-1?6:0,lineHeight:1.5}}>
                    <span style={{color:C.mu,fontWeight:500}}>{label}: </span>
                    <span style={{color:C.tx}}>{value}</span>
                  </div>
                ) : null)}
              </div>
              <button onClick={() => onMarkProjektNotisSeen(notis.id)} style={{...btnP,fontSize:14,padding:"12px"}}>Markera sedd</button>
            </div>
          ))}
        </div>
      )}
      {unseen.length > 0 && (
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          {unseen.map(a => (
            <div key={a.id} style={{background:"rgba(232,184,75,.1)",border:"1px solid rgba(232,184,75,.3)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:11,color:C.ac,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>⚠ Ny ändring</div>
                <div style={{fontSize:11,color:C.mu}}>{a.datum}</div>
              </div>
              <div style={{fontSize:14,lineHeight:1.5}}>{a.text}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <span style={{fontSize:11,color:C.mu}}>Publicerad av {a.av}</span>
                <button onClick={() => onMarkSeen(a.id)} style={{fontSize:12,color:C.ac,background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:500}}>Markera som sedd ✓</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {[["Plats",d.plats],["Uppgift",d.uppg],["Arbetstid",d.tid],["Material",d.mat]].map(([l,v]) => (
          <div key={l} style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</div><div style={{fontSize:14,lineHeight:1.6}}>{v}</div></div>
        ))}
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:10,textTransform:"uppercase",letterSpacing:".5px"}}>Karta</div>
          <div style={{background:C.bg3,borderRadius:8,height:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
            <div style={{textAlign:"center",color:C.mu,fontSize:13}}>📍 {d.coords}</div>
          </div>
          <a href={`https://www.google.com/maps?q=${d.coords}`} target="_blank" rel="noreferrer" style={{...btnP,textDecoration:"none",display:"flex"}}>📍 Öppna i Google Maps</a>
        </div>
        <button onClick={() => navigate && navigate("rapportera-tid")} style={{...btnP,background:C.ok}}>⏱ Rapportera tid</button>
        {seenAndringar.length > 0 && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:10,textTransform:"uppercase",letterSpacing:".5px"}}>Tidigare ändringar</div>
            {seenAndringar.map(a => (
              <div key={a.id} style={{paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${C.b}`,opacity:.7}}>
                <div style={{fontSize:13,lineHeight:1.5}}>{a.text}</div>
                <div style={{fontSize:11,color:C.mu,marginTop:4}}>{a.av} · {a.datum} · ✓ sedd</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Skapa / redigera dagorder (arbetsledare) ─────────────────
function SkapaDagorder({dagorder, navigate, onSave}) {
  const [data, setData] = useState(dagorder)
  const [saved, setSaved] = useState(false)

  function set(k, v) { setData(d => ({...d, [k]:v})) }
  function save() { onSave(data); setSaved(true) }

  if (saved) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>📋</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Dagorder sparad!</h2>
      <p style={{color:C.mu,fontSize:15}}>Hela teamet ser den uppdaterade dagordern.</p>
      <div style={{display:"flex",gap:10,maxWidth:320,width:"100%",marginTop:32}}>
        <button style={{...btnG,flex:1}} onClick={() => navigate("projektkoll")}>Projektkoll</button>
        <button style={{...btnP,flex:1}} onClick={() => navigate("dagorder")}>Visa dagorder</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("projektkoll")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{fontWeight:600,fontSize:15}}>Skapa / redigera dagorder</div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"rgba(21,101,192,.06)",border:`1px solid ${C.b}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.mu,lineHeight:1.5}}>
          Förifyllt med dagens dagorder. Justera fälten och spara — uppdateringen syns direkt hos arbetarna.
        </div>
        <div><label style={lbl}>Projekt</label><input style={inp} value={data.proj} onChange={e=>set("proj",e.target.value)}/></div>
        <div><label style={lbl}>Plats</label><input style={inp} value={data.plats} onChange={e=>set("plats",e.target.value)}/></div>
        <div><label style={lbl}>Uppgift</label><textarea style={{...inp,height:70,resize:"none"}} value={data.uppg} onChange={e=>set("uppg",e.target.value)}/></div>
        <div><label style={lbl}>Arbetstid</label><input style={inp} value={data.tid} onChange={e=>set("tid",e.target.value)}/></div>
        <div><label style={lbl}>Material</label><textarea style={{...inp,height:60,resize:"none"}} value={data.mat} onChange={e=>set("mat",e.target.value)}/></div>
        <div><label style={lbl}>Koordinater (för karta)</label><input style={inp} value={data.coords} onChange={e=>set("coords",e.target.value)} placeholder="t.ex. 62.6324,17.9395"/></div>
        <div><label style={lbl}>Datum</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.datum} onChange={e=>set("datum",e.target.value)}/></div>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button style={{...btnG,flex:1}} onClick={() => navigate("projektkoll")}>Avbryt</button>
          <button style={{...btnP,flex:1}} onClick={save}>Spara dagorder</button>
        </div>
      </div>
    </div>
  )
}

// ── Avvikelser ────────────────────────────────────────────────
function Avvikelser({role, user, avvikelser, onAdd, onStang}) {
  const [text, setText] = useState("")
  const [photo, setPhoto] = useState(null)
  const [km, setKm] = useState("")
  const [gps, setGps] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState(null)

  const open = avvikelser.filter(a=>a.status==="open")
  const closed = avvikelser.filter(a=>a.status==="closed")
  const canClose = role === "arbetsledare" || role === "foretag"

  function handlePhoto(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = ev => setPhoto(ev.target.result)
    r.readAsDataURL(f)
  }

  function fetchGPS() {
    if (!navigator.geolocation) { setGpsError("GPS stöds inte i denna webbläsare"); return }
    setGpsLoading(true); setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({lat: pos.coords.latitude, lng: pos.coords.longitude}); setGpsLoading(false) },
      err => { setGpsError(err.message || "Kunde inte hämta position"); setGpsLoading(false) },
      {enableHighAccuracy: true, timeout: 10000}
    )
  }

  function submit() {
    if(!text.trim()) return
    onAdd({text, photo, km, gps, av:user.name})
    setText(""); setPhoto(null); setKm(""); setGps(null); setGpsError(null)
  }

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:18}}>Avvikelser</h1>
        <div style={{...card,marginBottom:14}}>
          <label style={lbl}>Beskriv avvikelsen</label>
          <textarea style={{...inp,height:80,resize:"none",marginBottom:10}} placeholder="Beskriv avvikelsen" value={text} onChange={e=>setText(e.target.value)}/>
          <label style={lbl}>Km-läge (valfritt)</label>
          <input style={{...inp,marginBottom:10}} placeholder="ex. Km 142+380" value={km} onChange={e=>setKm(e.target.value)}/>
          <label style={lbl}>GPS-position (valfritt)</label>
          {gps ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg3,border:`1px solid ${C.b}`,borderRadius:8,padding:"12px 14px",marginBottom:10}}>
              <span style={{fontSize:13,color:C.tx}}>📍 {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</span>
              <button onClick={()=>setGps(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.mu,fontSize:18,padding:0,lineHeight:1}}>×</button>
            </div>
          ) : (
            <button onClick={fetchGPS} disabled={gpsLoading} style={{...btnG,marginBottom: gpsError ? 6 : 10,cursor: gpsLoading ? "wait" : "pointer"}}>
              {gpsLoading ? "📡 Hämtar position..." : "📍 Hämta min position"}
            </button>
          )}
          {gpsError && <div style={{fontSize:12,color:C.da,marginBottom:10}}>{gpsError}</div>}
          <label style={lbl}>Foto (valfritt)</label>
          {photo ? (
            <div style={{position:"relative",marginBottom:10}}>
              <img src={photo} alt="" style={{width:"100%",borderRadius:8,maxHeight:200,objectFit:"cover",display:"block"}}/>
              <button onClick={() => setPhoto(null)} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,.6)",border:"none",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>×</button>
            </div>
          ) : (
            <label style={{...btnG,marginBottom:10,cursor:"pointer"}}>
              📷 Lägg till foto
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>
            </label>
          )}
          <button style={btnP} onClick={submit}>Rapportera</button>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8}}>
        {open.length>0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"4px 0 6px"}}>ÖPPNA ({open.length})</div>}
        {open.map(a => (
          <div key={a.id} style={{...card,borderColor:"rgba(224,82,82,.22)"}}>
            <div style={{fontSize:14,lineHeight:1.6,marginBottom:a.photo?10:10}}>{a.text}</div>
            {(a.km || a.gps) && (
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                {a.km && <span style={{fontSize:12,background:"rgba(232,184,75,.12)",color:C.ac,padding:"4px 9px",borderRadius:6,border:"1px solid rgba(232,184,75,.2)"}}>📍 {a.km}</span>}
                {a.gps && <span style={{fontSize:12,background:"rgba(232,184,75,.12)",color:C.ac,padding:"4px 9px",borderRadius:6,border:"1px solid rgba(232,184,75,.2)"}}>🛰 {a.gps.lat.toFixed(5)}, {a.gps.lng.toFixed(5)}</span>}
              </div>
            )}
            {a.photo && <img src={a.photo} alt="" style={{width:"100%",borderRadius:8,maxHeight:220,objectFit:"cover",marginBottom:10,display:"block"}}/>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.mu}}>{a.av} · {a.datum}</span>
              {canClose && <button onClick={()=>onStang(a.id)} style={{fontSize:12,background:"rgba(46,125,50,.08)",border:"1px solid rgba(46,125,50,.25)",color:C.ok,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>Stäng avvik</button>}
            </div>
          </div>
        ))}
        {closed.length>0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"10px 0 6px"}}>STÄNGDA ({closed.length})</div>}
        {closed.map(a => (
          <div key={a.id} style={{...card,opacity:.6}}>
            <div style={{fontSize:14,lineHeight:1.5,marginBottom:6}}>{a.text}</div>
            {(a.km || a.gps) && (
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {a.km && <span style={{fontSize:12,color:C.mu,background:C.bg3,padding:"3px 8px",borderRadius:6}}>📍 {a.km}</span>}
                {a.gps && <span style={{fontSize:12,color:C.mu,background:C.bg3,padding:"3px 8px",borderRadius:6}}>🛰 {a.gps.lat.toFixed(5)}, {a.gps.lng.toFixed(5)}</span>}
              </div>
            )}
            {a.photo && <img src={a.photo} alt="" style={{width:"100%",borderRadius:8,maxHeight:160,objectFit:"cover",marginBottom:8,display:"block"}}/>}
            <div style={{fontSize:12,color:C.mu}}>{a.av} · {a.datum}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Projektkoll (arbetsledare) ────────────────────────────────
function Projektkoll({navigate, avvikelser, andringar, onAddAndring, dagorder}) {
  const open = avvikelser.filter(a=>a.status==="open")
  const closed = avvikelser.filter(a=>a.status==="closed")
  const [showAndringForm, setShowAndringForm] = useState(false)
  const [andringText, setAndringText] = useState("")
  const [paminnelseSent, setPaminnelseSent] = useState(null) // namnet på arbetaren påminnelsen just skickats till

  // Senaste ändringen + dess kvittenser styr "Kvitterade ändringar"-sektionen
  const senasteAndring = andringar.length > 0 ? andringar[andringar.length - 1] : null
  const kvitt = senasteAndring?.kvittenser || {}
  const seenCount = Object.values(kvitt).filter(k => k.sedd).length

  // ═══════════════════════════════════════════════════════════════════════
  // TODO — RIKTIG PUSHNOTIS-INTEGRATION
  // ───────────────────────────────────────────────────────────────────────
  // När backend finns på plats, ersätt mock-anropet nedan med ett riktigt
  // API-anrop, t.ex.:
  //
  //   await fetch("/api/push/reminder", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       arbetareId: worker.id,
  //       andringId:  senasteAndring.id,
  //       avsandare:  user.id,
  //     })
  //   })
  //
  // Backend ansvarar för att skicka pushnotisen via FCM (Android) / APNs (iOS)
  // till arbetarens registrerade enheter. Logga utskicket för audit-trail.
  // ═══════════════════════════════════════════════════════════════════════
  function sendPaminnelse(worker) {
    // MOCK: simulerar pushnotis genom att visa en bekräftelsedialog
    setPaminnelseSent(worker.name)
  }

  function submitAndring() {
    if (!andringText.trim()) return
    onAddAndring(andringText)
    setAndringText("")
    setShowAndringForm(false)
  }

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:4}}>Projektkoll</h1>
        <div style={{fontSize:13,color:C.mu,marginBottom:18}}>{dagorder.proj}</div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("skapa-dagorder")} style={{...card,flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",transition:"border-color .15s"}}
            onMouseOver={e=>e.currentTarget.style.borderColor=C.b2}
            onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
            <span style={{fontSize:24}}>📋</span>
            <span style={{fontSize:13,fontWeight:500,color:C.tx}}>Skapa dagorder</span>
          </button>
          <button onClick={()=>setShowAndringForm(s=>!s)} style={{...card,flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",transition:"border-color .15s",borderColor:showAndringForm?C.ac:C.b}}
            onMouseOver={e=>{if(!showAndringForm)e.currentTarget.style.borderColor=C.b2}}
            onMouseOut={e=>{if(!showAndringForm)e.currentTarget.style.borderColor=C.b}}>
            <span style={{fontSize:24}}>🔔</span>
            <span style={{fontSize:13,fontWeight:500,color:C.tx}}>Lägg till ändring</span>
          </button>
        </div>

        {showAndringForm && (
          <div style={{...card,borderColor:"rgba(232,184,75,.3)",background:"rgba(232,184,75,.06)"}}>
            <label style={lbl}>Beskriv ändringen (syns hos arbetare som "ny ändring")</label>
            <textarea style={{...inp,height:80,resize:"none",marginBottom:10}} placeholder="T.ex. säkerhetszon ändrad, ny mötestid..." value={andringText} onChange={e=>setAndringText(e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <button style={{...btnP,flex:1}} onClick={submitAndring}>Publicera ändring</button>
              <button style={{...btnG,flex:1}} onClick={()=>{setShowAndringForm(false);setAndringText("")}}>Avbryt</button>
            </div>
          </div>
        )}

        {andringar.length > 0 && (
          <div style={card}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>SENASTE ÄNDRINGAR ({andringar.length})</div>
            {andringar.map((a,i) => (
              <div key={a.id} style={{display:"flex",gap:10,paddingBottom:i<andringar.length-1?12:0,marginBottom:i<andringar.length-1?12:0,borderBottom:i<andringar.length-1?`1px solid ${C.b}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:a.sedd?C.mu:C.ac,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,lineHeight:1.5}}>{a.text}</div>
                  <div style={{fontSize:11,color:C.mu,marginTop:3}}>{a.av} · {a.datum} {a.sedd ? "· ✓ sedd av teamet" : "· ny"}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {senasteAndring && (
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu}}>👁 KVITTERADE ÄNDRINGAR</div>
              <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:20,color:seenCount===ANSTALLDA.length?C.ok:C.ac,background:seenCount===ANSTALLDA.length?"rgba(46,125,50,.12)":"rgba(232,184,75,.15)"}}>{seenCount}/{ANSTALLDA.length} sett</span>
            </div>
            <div style={{fontSize:12,color:C.mu,marginBottom:14,fontStyle:"italic",lineHeight:1.5}}>
              "{senasteAndring.text}"
            </div>
            {ANSTALLDA.map((a,i) => {
              const k = kvitt[a.id] || {sedd:false}
              const last = i === ANSTALLDA.length - 1
              return (
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:last?0:10,marginBottom:last?0:10,borderBottom:last?"none":`1px solid ${C.b}`}}>
                  <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{k.sedd ? "✅" : "⏳"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:500}}>{a.name}</div>
                    <div style={{fontSize:12,color:k.sedd?C.ok:C.mu,marginTop:2}}>{k.sedd ? `Sedd ${k.tid}` : "Ej sedd"}</div>
                  </div>
                  {!k.sedd && (
                    <button onClick={() => sendPaminnelse(a)} style={{fontSize:12,fontWeight:500,background:C.bg3,border:`1px solid ${C.b2}`,color:C.ac,padding:"7px 12px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>
                      🔔 Skicka påminnelse
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>ÖPPNA AVVIKELSER ({open.length})</div>
          {open.length === 0 && <div style={{fontSize:13,color:C.mu}}>Inga öppna avvikelser 🎉</div>}
          {open.map((a,i) => (
            <div key={a.id} style={{display:"flex",gap:10,paddingBottom:i<open.length-1?12:0,marginBottom:i<open.length-1?12:0,borderBottom:i<open.length-1?`1px solid ${C.b}`:"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:C.da,flexShrink:0,marginTop:5}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,lineHeight:1.5}}>{a.text}</div>
                <div style={{fontSize:11,color:C.mu,marginTop:3}}>{a.av} · {a.datum}</div>
              </div>
            </div>
          ))}
          {open.length > 0 && (
            <button onClick={()=>navigate("avvikelser")} style={{...btnG,marginTop:12,padding:"10px",fontSize:13}}>Hantera avvikelser →</button>
          )}
        </div>

        {closed.length > 0 && (
          <div style={card}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>STÄNGDA AVVIKELSER ({closed.length})</div>
            {closed.map((a,i) => (
              <div key={a.id} style={{display:"flex",gap:10,paddingBottom:i<closed.length-1?10:0,marginBottom:i<closed.length-1?10:0,borderBottom:i<closed.length-1?`1px solid ${C.b}`:"none",opacity:.7}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.ok,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,lineHeight:1.5}}>{a.text}</div>
                  <div style={{fontSize:11,color:C.mu,marginTop:3}}>{a.av} · {a.datum}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>VEM ÄR PÅ PROJEKTET ({ANSTALLDA.length})</div>
          {ANSTALLDA.map((a,i) => (
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<ANSTALLDA.length-1?10:0}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:C.ac,flexShrink:0}}>{a.name.split(" ").map(n=>n[0]).join("")}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:500}}>{a.name}</div>
                <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
              </div>
              <a href={`tel:${a.tel.replace(/\s/g,"")}`} style={{fontSize:12,color:C.ac,textDecoration:"none",padding:"6px 10px",borderRadius:6,border:`1px solid ${C.b}`}}>📞 {a.tel}</a>
            </div>
          ))}
        </div>
      </div>

      {paminnelseSent && (
        <div onClick={() => setPaminnelseSent(null)} style={{position:"fixed",inset:0,background:"rgba(13,31,53,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,zIndex:100}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.bg,borderRadius:16,padding:"28px 24px",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 10px 40px rgba(0,0,0,.18)"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(46,125,50,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px",color:C.ok}}>✓</div>
            <div style={{fontSize:17,fontWeight:600,marginBottom:6}}>Påminnelse skickad</div>
            <div style={{fontSize:14,color:C.mu,marginBottom:20,lineHeight:1.5}}>
              En pushnotis har skickats till <strong style={{color:C.tx}}>{paminnelseSent}</strong>.
            </div>
            <button style={btnP} onClick={() => setPaminnelseSent(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Profil ────────────────────────────────────────────────────
function Profil({user, onLogout}) {
  const showWorkInfo = user.role === "arbetare" || user.role === "arbetsledare"
  const komp = KOMPETENSER[user.role] || []
  const jobb = TIDIGARE_JOBB[user.role] || []

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:24}}>Profil</h1>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(232,184,75,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:600,color:C.ac}}>{user.name[0]}</div>
          <div><div style={{fontWeight:600,fontSize:18}}>{user.name}</div><div style={{fontSize:13,color:C.mu,marginTop:2}}>{user.company}</div></div>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Roll</div><div style={{fontSize:15,textTransform:"capitalize"}}>{user.role}</div></div>
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Företag</div><div style={{fontSize:15}}>{user.company}</div></div>

        {showWorkInfo && komp.length > 0 && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:10,textTransform:"uppercase",letterSpacing:".5px"}}>Kompetenser & certifikat</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {komp.map(k => (
                <span key={k} style={{fontSize:12,background:"rgba(232,184,75,.12)",color:C.ac,padding:"5px 10px",borderRadius:8,border:"1px solid rgba(232,184,75,.2)"}}>{k}</span>
              ))}
            </div>
          </div>
        )}

        {showWorkInfo && jobb.length > 0 && (
          <div style={card}>
            <div style={{fontSize:11,color:C.mu,marginBottom:12,textTransform:"uppercase",letterSpacing:".5px"}}>Tidigare jobb ({jobb.length})</div>
            {jobb.map((j,i) => (
              <div key={i} style={{paddingBottom:i<jobb.length-1?12:0,marginBottom:i<jobb.length-1?12:0,borderBottom:i<jobb.length-1?`1px solid ${C.b}`:"none"}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>{j.proj}</div>
                <div style={{fontSize:12,color:C.mu,marginBottom:2}}>📍 {j.plats} · {j.roll}</div>
                <div style={{fontSize:11,color:C.mu}}>{j.period}</div>
              </div>
            ))}
          </div>
        )}

        <button style={{...btnG,marginTop:8}} onClick={onLogout}>Logga ut</button>
      </div>
    </div>
  )
}

// ── Bottom Nav ─────────────────────────────────────────────────
function BottomNav({role, screen, navigate, ansokningar}) {
  const navMap = {
    foretag:       [{id:"marketplace",e:"🏠",l:"Marketplace"},{id:"skapa-avrop",e:"➕",l:"Nytt avrop"},{id:"mina-avrop",e:"📂",l:"Mina avrop"},{id:"planering",e:"📅",l:"Planering"},{id:"projektering",e:"🏗",l:"Projekt"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
    arbetsledare:  [{id:"dagorder",e:"📋",l:"Dagorder"},{id:"mina-arbeten",e:"💼",l:"Arbeten"},{id:"projektkoll",e:"📊",l:"Projektkoll"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
    arbetare:      [{id:"dagorder",e:"📋",l:"Dagorder"},{id:"mina-arbeten",e:"💼",l:"Arbeten"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
  }
  const items = navMap[role] || navMap.arbetare
  const activeId =
    ["avrop","ansok"].includes(screen) ? "marketplace" :
    ["ansokningar","ansokan"].includes(screen) ? "mina-avrop" :
    screen === "skapa-dagorder" ? "projektkoll" :
    screen

  const openAnsCount = role === "foretag" ? ansokningar.filter(a => a.status === "open").length : 0

  return (
    <div style={{display:"flex",background:C.bg2,borderTop:`1px solid ${C.b}`,padding:"8px 0 16px"}}>
      {items.map(item => {
        const active = item.id === activeId
        const showBadge = item.id === "mina-avrop" && openAnsCount > 0
        return (
          <button key={item.id} onClick={() => navigate(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"6px 0",position:"relative"}}>
            <span style={{fontSize:20,lineHeight:1,filter:active?"none":"grayscale(1) opacity(.5)",position:"relative"}}>
              {item.e}
              {showBadge && (
                <span style={{position:"absolute",top:-4,right:-10,background:C.da,color:"#fff",borderRadius:9,minWidth:16,height:16,fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:`2px solid ${C.bg2}`,lineHeight:1}}>{openAnsCount}</span>
              )}
            </span>
            <span style={{fontSize:10,color:active?C.ac:C.mu,fontWeight:active?500:400}}>{item.l}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────
export default function RallarApp() {
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState("login")
  const [screenData, setScreenData] = useState(null)
  const [ansokningar, setAnsokningar] = useState(INIT_ANSOKNINGAR)
  const [avvikelser, setAvvikelser] = useState(INIT_AVVIKELSER)
  const [andringar, setAndringar] = useState(INIT_ANDRINGAR)
  const [dagorder, setDagorder] = useState(DAGORDER_INIT)
  const [bokningar, setBokningar] = useState(INIT_BOKNINGAR)
  const [projekt, setProjekt] = useState(INIT_PROJEKTERING_PROJEKT)
  const [tidsrapporter, setTidsrapporter] = useState(INIT_TIDSRAPPORTER)
  const [projekteringBokningar, setProjekteringBokningar] = useState(INIT_PROJEKTERING_BOKNINGAR)
  const [projektNotiser, setProjektNotiser] = useState(INIT_PROJEKT_NOTISER)

  function login(role) {
    setUser(DEMO_USERS[role])
    setScreen(DEFAULT_SCREEN[role])
  }

  function navigate(to, data=null) {
    setScreen(to)
    if (data) setScreenData(data)
  }

  // Acceptera = avslå övriga öppna ansökningar på samma avrop automatiskt
  function updateAnsokan(id, newStatus) {
    setAnsokningar(prev => {
      if (newStatus !== "accepted") return prev.map(a => a.id===id ? {...a, status:newStatus} : a)
      const target = prev.find(a => a.id === id)
      if (!target) return prev
      return prev.map(a => {
        if (a.id === id) return {...a, status:"accepted"}
        if (a.avropId === target.avropId && a.status === "open") return {...a, status:"rejected"}
        return a
      })
    })
  }

  function addAvvikelse({text, photo, km, gps, av}) {
    setAvvikelser(prev => [...prev, {id:String(Date.now()), text, photo, km, gps, av, datum:"2026-05-25", status:"open"}])
  }
  function stangAvvikelse(id) {
    setAvvikelser(prev => prev.map(a => a.id===id ? {...a, status:"closed"} : a))
  }

  function markAndringSeen(id) {
    setAndringar(prev => prev.map(a => a.id===id ? {...a, sedd:true} : a))
  }
  function addAndring(text) {
    // Alla arbetare börjar som "ej sedd" på en ny ändring; uppdateras när de markerar som sedd
    const tomKvittenser = ANSTALLDA.reduce((acc, a) => ({...acc, [a.id]: {sedd:false}}), {})
    setAndringar(prev => [...prev, {id:String(Date.now()), text, datum:"2026-05-25", av:user.name, sedd:false, kvittenser:tomKvittenser}])
  }

  function saveDagorder(newD) { setDagorder(newD) }

  // Planering: en person kan bara vara på ett projekt per vecka — boka ersätter befintlig
  function addBokning({anstalldId, projektId, vecka}) {
    setBokningar(prev => {
      const filtered = prev.filter(b => !(b.anstalldId === anstalldId && b.vecka === vecka))
      return [...filtered, {id:String(Date.now())+Math.random().toString(36).slice(2,6), anstalldId, projektId, vecka}]
    })
  }
  function removeBokning(id) { setBokningar(prev => prev.filter(b => b.id !== id)) }

  // Projektering: skapa projekt, rapportera tid, projektets egna bokningar
  function addProjekt(p, valdaAnstallda = []) {
    const id = `pj${Date.now()}`
    setProjekt(prev => [...prev, {...p, id}])
    // Skapa en notis för varje vald anställd. Måste kvitteras med "Markera sedd" innan den försvinner.
    if (valdaAnstallda.length > 0) {
      const nyaNotiser = valdaAnstallda.map((anstalldId, i) => ({
        id: `pn${Date.now()}_${i}`,
        projektId: id,
        anstalldId,
        sedd: false,
        kvitteradTid: null,
      }))
      setProjektNotiser(prev => [...prev, ...nyaNotiser])
    }
  }
  function markProjektNotisSeen(notisId) {
    const now = new Date()
    const tid = `2026-05-25 ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
    setProjektNotiser(prev => prev.map(n => n.id === notisId ? {...n, sedd:true, kvitteradTid:tid} : n))
  }
  function addTidsrapport(tr) {
    setTidsrapporter(prev => [...prev, {...tr, id:`tr${Date.now()}`}])
  }
  function addProjekteringBokning({anstalldId, projektId, vecka}) {
    setProjekteringBokningar(prev => {
      const filtered = prev.filter(b => !(b.anstalldId === anstalldId && b.vecka === vecka))
      return [...filtered, {id:`pbk${Date.now()}`+Math.random().toString(36).slice(2,5), anstalldId, projektId, vecka}]
    })
  }
  function removeProjekteringBokning(id) { setProjekteringBokningar(prev => prev.filter(b => b.id !== id)) }

  const appStyle = {
    background: C.bg,
    color: C.tx,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 16,
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    WebkitFontSmoothing: "antialiased",
  }

  if (!user) return (
    <div style={appStyle}>
      <LoginScreen onLogin={login}/>
    </div>
  )

  const renderScreen = () => {
    switch(screen) {
      case "marketplace":     return <Marketplace navigate={navigate}/>
      case "avrop":           return <AvropDetail avrop={screenData||AVROP[0]} navigate={navigate} role={user.role}/>
      case "skapa-avrop":     return <SkapaAvrop navigate={navigate}/>
      case "mina-avrop":      return <MinaAvrop navigate={navigate} ansokningar={ansokningar}/>
      case "ansokningar":     return <AvropAnsokningar avrop={screenData||MINA_AVROP[0]} ansokningar={ansokningar} navigate={navigate}/>
      case "ansokan":         return <AnsokanDetail ansokan={screenData?.ansokan} avrop={screenData?.avrop} navigate={navigate} onAction={updateAnsokan}/>
      case "planering":       return <Planering bokningar={bokningar} onAdd={addBokning} onRemove={removeBokning}/>
      case "projektering":    return <Projektering projekt={projekt} bokningar={projekteringBokningar} tidsrapporter={tidsrapporter} projektAvvikelser={INIT_PROJEKT_AVVIKELSER} onAddBokning={addProjekteringBokning} onRemoveBokning={removeProjekteringBokning} navigate={navigate}/>
      case "skapa-projekt":   return <SkapaProjekt navigate={navigate} onSave={addProjekt} antalProjekt={projekt.length}/>
      case "projekt-detalj":  return <ProjektDetalj projekt={screenData} bokningar={projekteringBokningar} tidsrapporter={tidsrapporter} projektAvvikelser={INIT_PROJEKT_AVVIKELSER} projektNotiser={projektNotiser} navigate={navigate}/>
      case "rapportera-tid":  return <RapporteraTid user={user} projekt={projekt} navigate={navigate} onSave={addTidsrapport}/>
      case "mina-arbeten":    return <MinaArbeten/>
      case "dagorder":        return <Dagorder dagorder={dagorder} andringar={andringar} onMarkSeen={markAndringSeen} navigate={navigate} user={user} projekt={projekt} projektNotiser={projektNotiser} onMarkProjektNotisSeen={markProjektNotisSeen}/>
      case "skapa-dagorder":  return <SkapaDagorder dagorder={dagorder} navigate={navigate} onSave={saveDagorder}/>
      case "avvikelser":      return <Avvikelser role={user.role} user={user} avvikelser={avvikelser} onAdd={addAvvikelse} onStang={stangAvvikelse}/>
      case "projektkoll":     return <Projektkoll navigate={navigate} avvikelser={avvikelser} andringar={andringar} onAddAndring={addAndring} dagorder={dagorder}/>
      case "profil":          return <Profil user={user} onLogout={() => {setUser(null);setScreen("login")}}/>
      default:                return <Marketplace navigate={navigate}/>
    }
  }

  return (
    <div style={appStyle}>
      <div style={{flex:1}}>{renderScreen()}</div>
      <BottomNav role={user.role} screen={screen} navigate={navigate} ansokningar={ansokningar}/>
    </div>
  )
}
