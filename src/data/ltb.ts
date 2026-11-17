// Static data for the LocalTradeBids preview. Do not edit bid rows by hand.
// Source: Bede's PoC Opportunities sheet (tab "Opportunities"), read 2026-11-17. Public rows only.

export type Trade = {
  slug: string;
  name: string;
  shortName: string;
  lc: string;
  lcShort: string;
  sheetKey: string;
  scope: string;
};
export type County = { slug: string; name: string };
export type State = { slug: string; name: string; code: string; live: boolean };
export type Bid = {
  id: string;
  title: string;
  agency: string;
  county: string;
  countySlug: string;
  trade: string;
  dueDate: string;
  dueDateISO: string;
  sourceUrl: string;
};

export const SAMPLE_BIDS_AS_OF = "2026-11-17";

// Trade names and slugs: five approved 6:40 AM ET, plus Landscaping and
// Painting (Andrew, 7:06 AM ET Nov 17, via Bernard). Seven trades total.
export const TRADES: Trade[] = [
  {
    slug: "roofing",
    name: "Roofing",
    shortName: "Roofing",
    lc: "roofing",
    lcShort: "roofing",
    sheetKey: "roofing",
    scope: "Roofing and re-roofing projects for public agencies. Not design-only or inspection-only contracts, or supply-only purchases.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    shortName: "Electrical",
    lc: "electrical",
    lcShort: "electrical",
    sheetKey: "electrical",
    scope: "Electrical work, including lighting, generators, transformers, switchgear and UPS replacement. Not design-only contracts or supply-only purchases.",
  },
  {
    slug: "plumbing-hvac",
    name: "Plumbing & HVAC",
    shortName: "Plumbing & HVAC",
    lc: "plumbing and HVAC",
    lcShort: "plumbing and HVAC",
    sheetKey: "plumbing_hvac",
    scope: "Plumbing, backflow, HVAC and air-conditioning work, including chillers, cooling towers and mechanical system upgrades.",
  },
  {
    slug: "sitework-heavy-civil",
    name: "Sitework & Heavy Civil",
    shortName: "Sitework & Civil",
    lc: "sitework and heavy civil",
    lcShort: "sitework and civil",
    sheetKey: "sitework_heavy_civil",
    scope: "Site prep, grading, excavation, dredging, paving, roads, bridges, water, sewer and stormwater, demolition and concrete work.",
  },
  {
    slug: "commercial-general-contracting",
    name: "Commercial General Contracting",
    shortName: "Commercial GC",
    lc: "commercial general contracting",
    lcShort: "commercial GC",
    sheetKey: "commercial_gc",
    scope: "New buildings, renovations, building repairs, design-build and construction-manager projects. Not single-family homes or housing rehab.",
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    shortName: "Landscaping",
    lc: "landscaping",
    lcShort: "landscaping",
    sheetKey: "landscaping",
    scope: "Mowing, edging, planting, mulch, lawn care and grounds maintenance. Not landscape architecture or design, or equipment, plant and mulch purchases.",
  },
  {
    slug: "painting",
    name: "Painting",
    shortName: "Painting",
    lc: "painting",
    lcShort: "painting",
    sheetKey: "painting",
    scope: "Interior and exterior painting, plus parking-lot striping. Not road or traffic markings, vehicle painting, paint purchases or pressure washing.",
  },
];

export const FLORIDA_COUNTIES: County[] = [
  {
    "slug": "alachua",
    "name": "Alachua"
  },
  {
    "slug": "baker",
    "name": "Baker"
  },
  {
    "slug": "bay",
    "name": "Bay"
  },
  {
    "slug": "bradford",
    "name": "Bradford"
  },
  {
    "slug": "brevard",
    "name": "Brevard"
  },
  {
    "slug": "broward",
    "name": "Broward"
  },
  {
    "slug": "calhoun",
    "name": "Calhoun"
  },
  {
    "slug": "charlotte",
    "name": "Charlotte"
  },
  {
    "slug": "citrus",
    "name": "Citrus"
  },
  {
    "slug": "clay",
    "name": "Clay"
  },
  {
    "slug": "collier",
    "name": "Collier"
  },
  {
    "slug": "columbia",
    "name": "Columbia"
  },
  {
    "slug": "desoto",
    "name": "DeSoto"
  },
  {
    "slug": "dixie",
    "name": "Dixie"
  },
  {
    "slug": "duval",
    "name": "Duval"
  },
  {
    "slug": "escambia",
    "name": "Escambia"
  },
  {
    "slug": "flagler",
    "name": "Flagler"
  },
  {
    "slug": "franklin",
    "name": "Franklin"
  },
  {
    "slug": "gadsden",
    "name": "Gadsden"
  },
  {
    "slug": "gilchrist",
    "name": "Gilchrist"
  },
  {
    "slug": "glades",
    "name": "Glades"
  },
  {
    "slug": "gulf",
    "name": "Gulf"
  },
  {
    "slug": "hamilton",
    "name": "Hamilton"
  },
  {
    "slug": "hardee",
    "name": "Hardee"
  },
  {
    "slug": "hendry",
    "name": "Hendry"
  },
  {
    "slug": "hernando",
    "name": "Hernando"
  },
  {
    "slug": "highlands",
    "name": "Highlands"
  },
  {
    "slug": "hillsborough",
    "name": "Hillsborough"
  },
  {
    "slug": "holmes",
    "name": "Holmes"
  },
  {
    "slug": "indian-river",
    "name": "Indian River"
  },
  {
    "slug": "jackson",
    "name": "Jackson"
  },
  {
    "slug": "jefferson",
    "name": "Jefferson"
  },
  {
    "slug": "lafayette",
    "name": "Lafayette"
  },
  {
    "slug": "lake",
    "name": "Lake"
  },
  {
    "slug": "lee",
    "name": "Lee"
  },
  {
    "slug": "leon",
    "name": "Leon"
  },
  {
    "slug": "levy",
    "name": "Levy"
  },
  {
    "slug": "liberty",
    "name": "Liberty"
  },
  {
    "slug": "madison",
    "name": "Madison"
  },
  {
    "slug": "manatee",
    "name": "Manatee"
  },
  {
    "slug": "marion",
    "name": "Marion"
  },
  {
    "slug": "martin",
    "name": "Martin"
  },
  {
    "slug": "miami-dade",
    "name": "Miami-Dade"
  },
  {
    "slug": "monroe",
    "name": "Monroe"
  },
  {
    "slug": "nassau",
    "name": "Nassau"
  },
  {
    "slug": "okaloosa",
    "name": "Okaloosa"
  },
  {
    "slug": "okeechobee",
    "name": "Okeechobee"
  },
  {
    "slug": "orange",
    "name": "Orange"
  },
  {
    "slug": "osceola",
    "name": "Osceola"
  },
  {
    "slug": "palm-beach",
    "name": "Palm Beach"
  },
  {
    "slug": "pasco",
    "name": "Pasco"
  },
  {
    "slug": "pinellas",
    "name": "Pinellas"
  },
  {
    "slug": "polk",
    "name": "Polk"
  },
  {
    "slug": "putnam",
    "name": "Putnam"
  },
  {
    "slug": "st-johns",
    "name": "St. Johns"
  },
  {
    "slug": "st-lucie",
    "name": "St. Lucie"
  },
  {
    "slug": "santa-rosa",
    "name": "Santa Rosa"
  },
  {
    "slug": "sarasota",
    "name": "Sarasota"
  },
  {
    "slug": "seminole",
    "name": "Seminole"
  },
  {
    "slug": "sumter",
    "name": "Sumter"
  },
  {
    "slug": "suwannee",
    "name": "Suwannee"
  },
  {
    "slug": "taylor",
    "name": "Taylor"
  },
  {
    "slug": "union",
    "name": "Union"
  },
  {
    "slug": "volusia",
    "name": "Volusia"
  },
  {
    "slug": "wakulla",
    "name": "Wakulla"
  },
  {
    "slug": "walton",
    "name": "Walton"
  },
  {
    "slug": "washington",
    "name": "Washington"
  }
];

export const STATES: State[] = [
  { slug: "alabama", name: "Alabama", code: "AL", live: false },
  { slug: "alaska", name: "Alaska", code: "AK", live: false },
  { slug: "arizona", name: "Arizona", code: "AZ", live: false },
  { slug: "arkansas", name: "Arkansas", code: "AR", live: false },
  { slug: "california", name: "California", code: "CA", live: false },
  { slug: "colorado", name: "Colorado", code: "CO", live: false },
  { slug: "connecticut", name: "Connecticut", code: "CT", live: false },
  { slug: "delaware", name: "Delaware", code: "DE", live: false },
  { slug: "florida", name: "Florida", code: "FL", live: true },
  { slug: "georgia", name: "Georgia", code: "GA", live: false },
  { slug: "hawaii", name: "Hawaii", code: "HI", live: false },
  { slug: "idaho", name: "Idaho", code: "ID", live: false },
  { slug: "illinois", name: "Illinois", code: "IL", live: false },
  { slug: "indiana", name: "Indiana", code: "IN", live: false },
  { slug: "iowa", name: "Iowa", code: "IA", live: false },
  { slug: "kansas", name: "Kansas", code: "KS", live: false },
  { slug: "kentucky", name: "Kentucky", code: "KY", live: false },
  { slug: "louisiana", name: "Louisiana", code: "LA", live: false },
  { slug: "maine", name: "Maine", code: "ME", live: false },
  { slug: "maryland", name: "Maryland", code: "MD", live: false },
  { slug: "massachusetts", name: "Massachusetts", code: "MA", live: false },
  { slug: "michigan", name: "Michigan", code: "MI", live: false },
  { slug: "minnesota", name: "Minnesota", code: "MN", live: false },
  { slug: "mississippi", name: "Mississippi", code: "MS", live: false },
  { slug: "missouri", name: "Missouri", code: "MO", live: false },
  { slug: "montana", name: "Montana", code: "MT", live: false },
  { slug: "nebraska", name: "Nebraska", code: "NE", live: false },
  { slug: "nevada", name: "Nevada", code: "NV", live: false },
  { slug: "new-hampshire", name: "New Hampshire", code: "NH", live: false },
  { slug: "new-jersey", name: "New Jersey", code: "NJ", live: false },
  { slug: "new-mexico", name: "New Mexico", code: "NM", live: false },
  { slug: "new-york", name: "New York", code: "NY", live: false },
  { slug: "north-carolina", name: "North Carolina", code: "NC", live: false },
  { slug: "north-dakota", name: "North Dakota", code: "ND", live: false },
  { slug: "ohio", name: "Ohio", code: "OH", live: false },
  { slug: "oklahoma", name: "Oklahoma", code: "OK", live: false },
  { slug: "oregon", name: "Oregon", code: "OR", live: false },
  { slug: "pennsylvania", name: "Pennsylvania", code: "PA", live: false },
  { slug: "rhode-island", name: "Rhode Island", code: "RI", live: false },
  { slug: "south-carolina", name: "South Carolina", code: "SC", live: false },
  { slug: "south-dakota", name: "South Dakota", code: "SD", live: false },
  { slug: "tennessee", name: "Tennessee", code: "TN", live: false },
  { slug: "texas", name: "Texas", code: "TX", live: false },
  { slug: "utah", name: "Utah", code: "UT", live: false },
  { slug: "vermont", name: "Vermont", code: "VT", live: false },
  { slug: "virginia", name: "Virginia", code: "VA", live: false },
  { slug: "washington", name: "Washington", code: "WA", live: false },
  { slug: "west-virginia", name: "West Virginia", code: "WV", live: false },
  { slug: "wisconsin", name: "Wisconsin", code: "WI", live: false },
  { slug: "wyoming", name: "Wyoming", code: "WY", live: false }
];

// Real public rows copied exactly from the sheet (title, agency, county, due_date, url). dueDateISO is a parsed copy for sorting only.
export type Region = { id: string; number: number; name: string; countySlugs: string[] };

/** Bede region map, sha256 d03cbed3d66f46b11f1c849c7952b31d819ef4f18902f755060f3bf0472c2fd4 */
export const REGIONS: Region[] = [
  { id: "fl-north-central", number: 3, name: "North Central Florida Regional Planning Council", countySlugs: [
    "alachua", "bradford", "columbia", "dixie", "gilchrist", "hamilton", "lafayette", "levy", "madison", "suwannee", "taylor", "union",
  ] },
  { id: "fl-northeast", number: 4, name: "Northeast Florida Regional Council", countySlugs: [
    "baker", "clay", "duval", "flagler", "nassau", "putnam", "st-johns",
  ] },
  { id: "fl-emerald-coast", number: 1, name: "Emerald Coast Regional Council", countySlugs: [
    "bay", "escambia", "holmes", "okaloosa", "santa-rosa", "walton", "washington",
  ] },
  { id: "fl-east-central", number: 6, name: "East Central Florida Regional Planning Council", countySlugs: [
    "brevard", "lake", "marion", "orange", "osceola", "seminole", "sumter", "volusia",
  ] },
  { id: "fl-south", number: 11, name: "South Florida Regional Planning Council", countySlugs: [
    "broward", "miami-dade", "monroe",
  ] },
  { id: "fl-apalachee", number: 2, name: "Apalachee Regional Planning Council", countySlugs: [
    "calhoun", "franklin", "gadsden", "gulf", "jackson", "jefferson", "leon", "liberty", "wakulla",
  ] },
  { id: "fl-southwest", number: 9, name: "Southwest Florida Regional Planning Council", countySlugs: [
    "charlotte", "collier", "glades", "hendry", "lee", "sarasota",
  ] },
  { id: "fl-tampa-bay", number: 8, name: "Tampa Bay Regional Planning Council", countySlugs: [
    "citrus", "hernando", "hillsborough", "manatee", "pasco", "pinellas",
  ] },
  { id: "fl-central", number: 7, name: "Central Florida Regional Planning Council", countySlugs: [
    "desoto", "hardee", "highlands", "okeechobee", "polk",
  ] },
  { id: "fl-treasure-coast", number: 10, name: "Treasure Coast Regional Planning Council", countySlugs: [
    "indian-river", "martin", "palm-beach", "st-lucie",
  ] },
];

// BEGIN PUBLIC_PAGES (generated)
// Source: /workspace/gov-contracts-alert/output/public/ltb_public_pages_2026-11-17.json
// sha256 60f66bff13d13878c3f7e22206174cfb0f18188e5e12dcd9e042002cbb059172; as_of 2026-11-17; generated_at 2026-11-17T09:49:06-05:00
// 201 pages, 348 rows. Rule: shown = min(3, max(1, floor(open/2))); pages with open_count=0 are omitted
// Regenerate: python3 /workspace/vincent/ltb-site/capbuild/gen_public_pages.py
// Page key: county slug, trade slug, or county/trade. Missing key = 0 open bids.
// Page: [open_count, shown_count, more_count, rows]. Rows in Bede's order, never re-sorted.
// Row: [title, agency, county, trade, due (YYYY-MM-DD, blank, or verbatim), url, opportunity_id]
export type PublicRow = [string, string, string, string, string, string, string];
export type PublicPage = [number, number, number, PublicRow[]];
export const PUBLIC_PAGES_AS_OF = "2026-11-17";
export const PUBLIC_PAGES: Record<string, PublicPage> = {
  "home": [662,3,659,[["ITB ITB# FAC/270142 HVAC Repairs and Installation - As Needed","City of Ocala","Marion","plumbing-hvac","2026-12-02","https://florida.prorfx.com/Listings.aspx","13b01ccf36308eee"],["RFP-27-068 PUBLIC ANNOUNCEMENT FOR Existing McClure Demolition & Beautification-RFP-27-068","Florida School for the Deaf and the Blind (FSDB)","Statewide","sitework-heavy-civil","2026-12-08","https://vendor.myfloridamarketplace.com/search/bids/detail/17298","931ace294c99a628"],["Ancillary Park Grounds Maintenance & Related Services","Lake County","Lake","landscaping","2026-12-15","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=27-407","7dee0b891f32b882"]]],
  "alachua": [3,1,2,[["Legacy Park Substation Transformer #2","City of Alachua","Alachua","electrical","2026-11-30","https://www.cityofalachua.com/bids.aspx?bidID=9","2f78a6726933b898"]]],
  "bay": [8,3,5,[["Bailey Bridge Rehabilitation Project","City of Lynn Haven","Bay","sitework-heavy-civil","2026-12-15","https://www.cityoflynnhaven.gov/bids.aspx?bidID=168","65dc07d8b1d9c6b1"],["ITB 2026-05 Boat Ramp Expansion & Repairs","City of Mexico Beach","Bay","sitework-heavy-civil","","https://mexicobeachfl.gov/uploads/2026/04/ITB-2026-05-Boat-Ramp-Expansion-Repairs.pdf","72d315ac76add3b9"],["ITB 2026-01_PARKER 2025 ROADWAY RESURFACING_BID SPECS","City of Parker","Bay","sitework-heavy-civil","","https://cityofparker.com/doing-business/bids/","337e411f9f05cc87"]]],
  "bradford": [2,1,1,[["(RFP 09142026 \u2013 2 Roof Replacement Project)","Bradford County","Bradford","roofing","","https://www.bradfordcountyfl.gov/bid-advertisements/","1767a675e53fbcd6"]]],
  "brevard": [7,3,4,[["Beach Renourishment, Kennedy Space Center, Brevard County, Florida","W074 ENDIST JACKSNVLLE","Brevard","sitework-heavy-civil","2026-12-22","https://sam.gov/opp/28bbe35293f346269b569afa69ca53a0/view","7d4c60615b592486"],["Millennium Beach Park Pavilion","City of Indian Harbour Beach","Brevard","commercial-general-contracting","2026-11-20","https://www.indianharbourbeach.org/bids.aspx?bidID=26","4a0eccb90854566c"],["2027-01 Stormwater Pilot Project","City of Cape Canaveral","Brevard","sitework-heavy-civil","","https://www.capecanaveral.gov/bid_detail_T8_R58.php","788911130f8c6658"]]],
  "broward": [30,3,27,[["2026-006 BID Winfield Blvd Pedestrian Sidewalk and Bridge","City of Margate","Broward","sitework-heavy-civil","2026-11-19","https://www.margatefl.com/bids.aspx?bidID=142","b38ec0ff347e1db7"],["ITB 26-03 - SW 36th Court Drainage Improvements","Town of Pembroke Park","Broward","sitework-heavy-civil","","https://www.tppfl.gov/319/Solicitations","3d07e08b5ffca26a"],["Pre-Event Emergency Generator Installation and Traffic Signal Repair","FDOT District 4","Broward","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d4/lettings/2026/apr03/z4153-r0.pdf?sfvrsn=911f0a82_1","4059a04ce400f0ec"]]],
  "charlotte": [14,3,11,[["Port Charlotte Beach Park Boat Ramp Replacement","Charlotte County","Charlotte","sitework-heavy-civil","2026-12-16","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8354","7d7ecce1ae3795a5"],["Generator Inspections, Services and Repairs","Charlotte County Public Schools","Charlotte","electrical","","https://files.smartsites.parentsquare.com/6026/2425-67mp2_award_letter.pdf","00249a557b3125e9"],["RFP #2025-07 Punta Rassa Boat Ramp Armor Mat Remove/Replace","West Coast Inland Navigation District","Charlotte","sitework-heavy-civil","","https://www.wcind.net/rfp/","16ead96397fe630b"]]],
  "citrus": [2,1,1,[["Contractual Maintenance/Mowing of City Cemetery","City of Inverness","Citrus","landscaping","2026-11-23","https://www.inverness.gov/bids.aspx?bidID=14","248dbce1ac60eeb5"]]],
  "collier": [9,3,6,[["RFQ #2026-01 For Construction Services for Roof Repairs and Replacements at Farm Worker's Village (USDA) CCHA's A&B Properties","Collier County Housing Authority","Collier","roofing","","https://www.cchafl.org/procurement-bids-rfps","0a6f202e3459b801"],["Invitation To Bid- Airfield Lighting and Electrical Vault Replacement","Naples Airport Authority (titles only)","Collier","electrical","","https://www.flynaples.com/invitation-to-bid-airfield-lighting-and-electrical-vault-replacement/","6e093ce7f43509ff"],["Landscape and Lawn Maintance RFP 2025-003 Immokalee Fire Control District Read more \u00bb","Immokalee Fire Control District","Collier","landscaping","","https://www.immfire.com/landscape-and-lawn-maintance-rfp-2025-003","61eb4261b2f436c6"]]],
  "columbia": [30,3,27,[["2026-2027 Annual Resurfacing - SE Hillcrest Lane, SW Fedora Way, SW Young Place","Columbia County","Columbia","sitework-heavy-civil","2026-11-24","https://www.columbiacountyfla.com/PurchasingBid.aspx?Id=1767","619e9266f3a15ba0"],["Slope mowing and litter removal to maintain outfall ditches","FDOT District 2","Columbia","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/dec16/e22h1-r0.pdf?sfvrsn=7530d97b_1","2186da112840cad2"],["Edging, sweeping, removing, and disposing of vegetation","FDOT District 2","Columbia","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/dec16/e22b6-r0.pdf?sfvrsn=72d50eb8_1","73e44956dfde42fb"]]],
  "desoto": [1,1,0,[["Request for Proposals: As-Needed Electrical Contractor Services","Peace River Manasota Regional Water Supply Authority","DeSoto","electrical","","https://regionalwater.org/procurement-policy-and-bidding/","1b84cb37c301dc38"]]],
  "duval": [30,3,27,[["Latham Plaza Parking Lot Public-Private Partnership (P3)","City of Jacksonville Beach","Duval","commercial-general-contracting","","https://www.jacksonvillebeach.org/bids.aspx?bidID=104","6bd331c5ccb9c56f"],["TMT CRANE RAIL GROUT REPAIR (FOOT MARKER 360 to 510)","JAXPORT (Jacksonville Port Authority)","Duval","commercial-general-contracting","","https://www.jaxport.com/procurement/active-solicitations/entry/13974/","003581dc74c3091c"],["Portland Cement Concrete","FDOT Contracts Administration","Duval","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/a3oxdpvinks-j6vejyw_cq/T2A37BSN.pdf","283ee27c185b43ef"]]],
  "escambia": [6,3,3,[["27-002 Traffic Signalization & Street Lighting","City of Pensacola","Escambia","electrical","2026-12-09","https://www.cityofpensacola.com/bids.aspx?bidID=654","1429aba240d0d198"],["Invitation To Bid: Port of Pensacola Road and Rail Rehabilitation Capital Improvement Project","Port of Pensacola","Escambia","commercial-general-contracting","","https://www.cityofpensacola.com/3595/Public-Notices-at-Port-of-Pensacola","9fffe99d785a2043"],["Request for Qualifications | RFQ 2-2025/2026 At-Risk Construction Management Services Training Center","Pensacola State College","Escambia/Santa Rosa","commercial-general-contracting","","https://pensacolastate.edu/purchasing/request-for-qualifications-rfq-2-2025-2026-at-risk-construction-management-services-training-center/","fe91d65171ca8d9d"]]],
  "flagler": [4,2,2,[["Request for Qualifications Clearwell Tank Design","City of Flagler Beach","Flagler","commercial-general-contracting","2026-11-30","https://www.cityofflaglerbeach.com/bids.aspx?bidID=158","6f8122c0002d8441"],["ITB-CD-27-05 WILDFIRE UNDERBRUSH MOWING","City of Palm Coast","Flagler","landscaping","","https://www.palmcoast.gov/procurement","8996deb7af39cc7a"]]],
  "franklin": [2,1,1,[["ITB- CIGP 6th Street Eastpoint Widening and Resurfacing","Franklin County BOCC","Franklin","sitework-heavy-civil","","https://www.franklincountyflorida.com/resources/county-bids-awards/","3e04d09eba93d870"]]],
  "gadsden": [1,1,0,[["Intermediate Bridge Replacement","FDOT Contracts Administration","Gadsden","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/8khmnjw18umrbbyi3aeblg/T3981BSN.pdf","02ff61270b37e455"]]],
  "glades": [3,1,2,[["CALLING FOR PROPOSALS \u2013 ADA-COMPLIANT AUTO ENTRANCE CITY HALL","City of Moore Haven","Glades","commercial-general-contracting","","https://moorehaven.org/rfp-itb/","2e03d530ca4da8d4"]]],
  "hendry": [7,3,4,[["ITB 27-005- Invitation to Bid District Wide Facilities Maintenance Renovation & Specialized Trade Services","Hendry County School District","Hendry","commercial-general-contracting","","https://resources.finalsite.net/images/v1794001898/hendryschoolsorg/j6d3evrwowrwdevrkgmu/FinalITB27-0051162026.pdf","cddedcdad976919c"],["ITB 2026-02 City of Clewiston Water System Infrastructure Improvements Project","City of Clewiston","Hendry","sitework-heavy-civil","","https://www.clewiston-fl.gov/bids.aspx?bidID=8","8259f800a162987d"],["RFQ/RFP 2025-01 Design-Build Services for the LaBelle Animal Control Shelter","City of LaBelle","Hendry","commercial-general-contracting","","https://www.citylabelle.com/RFQ 2025-01 Draft Architectural Services LaBelle Animal Control Department Design-Build(65101163.2).docx?t=202510290918390","02ed5a08524d3186"]]],
  "hernando": [2,1,1,[["City of Brooksville Downtown Revitalization Construction","City of Brooksville","Hernando","commercial-general-contracting","2026-12-07","https://www.cityofbrooksville.us/bids.aspx?bidID=51","eb0cc7efb5f33c08"]]],
  "highlands": [2,1,1,[["Drainage / Grading / Resurfacing","FDOT Contracts Administration","Highlands","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/nv4d_w1k30ufo4ewjyzlew/T1933BSN.pdf","45b0b3ca8e90e1bb"]]],
  "hillsborough": [30,3,27,[["Wind Protection Hardening - Fire Station 1 and 2","City of Temple Terrace","Hillsborough","commercial-general-contracting","2026-12-10","https://www.templeterrace.gov/bids.aspx?bidID=56","0f265ef5af19484f"],["IFB-26-00378 Big Bend Road from US 41 to Covington Garden Dr.","Hillsborough County BOCC","Hillsborough","sitework-heavy-civil","","https://hcfl.gov/businesses/doing-business-with-hillsborough/vendors/notice-of-select-upcoming-procurements","89915b9ba15f7d3d"],["US 92/SR 600 - Resurfacing","FDOT District 7","Hillsborough","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/aa8dx5vp3u2_j-xfb_kslg/E7U76.pdf","0d8300b4444a1116"]]],
  "holmes": [1,1,0,[["RFP--DESIGN-BUILD SERVICES REPLACEMENT GENERATOR FOR HDSB & BONIFAY K-8.pdf","Holmes District Schools","Holmes","electrical","","https://www.hdsb.org/?a=Files.Serve&File_id=EEA9216B-187F-4B23-A026-BC421D8262F1","b740c326dfffffc3"]]],
  "indian-river": [5,2,3,[["Fisherman's Landing Shoreline Protection & Parking Improvements (Re-Bid)","City of Sebastian","Indian River","commercial-general-contracting","","https://www.cityofsebastian.org/bids.aspx?bidID=1","37a15f9fae304619"],["Post Disaster Redevelopment Committee","Indian River County","Indian River","commercial-general-contracting","","https://www.ircgov.com/Departments/Budget/Purchasing/services/emergency_services/emergency_management/post_disaster_redevelopment_plan_(pdrp).php","100e03af9d1082ff"]]],
  "lafayette": [1,1,0,[["Minor Bridge Replacement","FDOT Contracts Administration","Lafayette","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/4fuz1fyhfkctnvdpjtusbw/T2809BSN.pdf","177c2b48f74451e7"]]],
  "lake": [30,3,27,[["Ancillary Park Grounds Maintenance & Related Services","Lake County","Lake","landscaping","2026-12-15","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=27-407","7dee0b891f32b882"],["Landscape Install and Establish","FDOT District 5","Lake","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d5/lettings/2026/jul07/e52g6.pdf?sfvrsn=1e259c13_1","106c4458985e752c"],["RFP 2026-02 Fire Hydrant Inspection, Flow Testing, Maintenance & Painting","Town of Montverde","Lake","sitework-heavy-civil","","https://mymontverde.com/wp-content/uploads/2026/08/RFP-2026-02-Fire-Hydrant.pdf","ad8bff4fd4917b72"]]],
  "lee": [3,1,2,[["RFQ 26-011: Design and Construction of FGCU Institute for Sustainability and Community","Florida Gulf Coast University","Lee","commercial-general-contracting","","https://www.fgcu.edu/adminservices/officeofthecontroller/procurementservices/purchasing/solicitations/","4a1e7eb68e793e5c"]]],
  "liberty": [7,3,4,[["Notice to Receive Sealed Bids \u2013 CR 12 SCRAP Phase II","Liberty County","Liberty","commercial-general-contracting","","https://libertyclerk-my.sharepoint.com/:b:/p/ddeloach/IQDiGg_nn01jSbgu_ZRVz45cAXcVpYpZK5vSBpDGgUqBujE?e=o5FPbb","e7852b9ef12d4a6e"],["Bristol Boat Ramp Improvements -Liberty CDBG-DR: Program Management Services","Liberty County","Liberty","sitework-heavy-civil","","https://libertycountyfl.org/uploads/2026/05/Liberty-CDBG-DR-RFP-Advertisement_Admin-002-1.pdf","2cf452be5f087ff0"],["County Road 379 Mary Branch Bridge Repair","Liberty County","Liberty","sitework-heavy-civil","","https://libertycountyfl.org/clerk-to-the-board/bids-rfp-frqs/notice-to-receive-sealed-bids-county-road-379-mary-branch-bridge-repair/","30ef929cda3df697"]]],
  "madison": [1,1,0,[["RFP 2025-04 Bid Notice, Project 2025-AD1 Courthouse Annex Exterior Stair Repair","Madison County","Madison","commercial-general-contracting","","https://madisoncountyfl.com/rfp/","e02449479f50b298"]]],
  "manatee": [1,1,0,[["Invitation to Bid 26-006 Landscape, Arboriculture, & Coastal Maintenance Services","City of Anna Maria","Manatee","landscaping","","https://www.cityofannamaria.com/172/Bids","704cb0d575722bf7"]]],
  "marion": [15,3,12,[["ITB ITB# FAC/270142 HVAC Repairs and Installation - As Needed","City of Ocala","Marion","plumbing-hvac","2026-12-02","https://florida.prorfx.com/Listings.aspx","13b01ccf36308eee"],["Bid 4212JL HVAC Supplies","Marion County Public Schools","Marion","plumbing-hvac","","https://www.marionschools.net/departments/purchasing/i_t_b__r_f_p_opportunities","a1ac6228be233d92"],["Building Renovation (General Contractor's License)","FDOT Contracts Administration","Marion","commercial-general-contracting","","https://ftp.fdot.gov/public/file/xgl0ocnx9koodfaq2qkahg/T9049BSN.pdf","cec943dcefdc4026"]]],
  "miami-dade": [75,3,72,[["Fence Improvements - Portwide","Miami-Dade County","Miami-Dade","commercial-general-contracting","2026-12-04","https://www.miamidade.gov/apps/isd/StratProc/Home/SolicitationDetails?solicitationNumber=MCC%207360%20RPQ%20No%20M2026-009R","33063ed4d0507d01"],["West Bay Harbor Drive Drainage Improvements","Town of Bay Harbor Islands","Miami-Dade","sitework-heavy-civil","2026-12-10","https://www.bayharborislands-fl.gov/bids.aspx?bidID=60","ae26e8bbcab88411"],["DRAINAGE IMPROVEMENTS PROJECT AT SW 65 STREET AND SW 65 TERRACE","City of South Miami","Miami-Dade","sitework-heavy-civil","2026-12-01","https://www.somifl.gov/bids.aspx?bidID=291","07a602119a499865"]]],
  "monroe": [5,2,3,[["MARATHON HIGHWAY CROSSING IMPROVEMENTS, PHASE I","Florida Keys Aqueduct Authority","Monroe","sitework-heavy-civil","2026-11-19","https://www.fkaa.com/bids.aspx?bidID=344","c3760f416f58d821"],["KEYS Bid 17-26 Specifications for Underground Padmount Transformer and Switchgear Inspections","Keys Energy Services","Monroe","electrical","","https://www.keysenergy.com/bid-information","5a3bf674ea5f054f"]]],
  "nassau": [3,1,2,[["Beach Access 9 Boardwalk Construction","City of Fernandina Beach","Nassau","commercial-general-contracting","2026-12-18","https://www.fbfl.us/bids.aspx?bidID=396","fe4befbb0f6af5a0"]]],
  "okaloosa": [3,1,2,[["ITB 26-08 Turkey Creek South Drainage and Parking Improvements","City of Niceville","Okaloosa","sitework-heavy-civil","","https://www.cityofniceville.org/412/Solicitations-Notices","23090f1ab587954c"]]],
  "okeechobee": [31,3,28,[["Invitation to Bid - VPS #5 Group M Septic to Sewer","Okeechobee Utility Authority","Okeechobee","sitework-heavy-civil","","https://www.ouafl.com/legal-notice","009177c7b97426ae"],["Invitation to Bid - VPS #5 Group J Septic to Sewer Project","Okeechobee Utility Authority","Okeechobee","sitework-heavy-civil","","https://www.ouafl.com/legal-notice","0bf77b44ba6c43bb"],["Request for Proposal - SWTP Ozone Rehabilitation","Okeechobee Utility Authority","Okeechobee","commercial-general-contracting","","https://www.ouafl.com/legal-notice","162c76c4d4a754ba"]]],
  "orange": [32,3,29,[["Briley Avenue Septic-To-Sewer","Town of Oakland","Orange","sitework-heavy-civil","2026-11-19","https://oaklandfl.gov/bids.aspx?bidID=35","3eea1b8d95c72baf"],["RFP 2026-EPD-01: Flat Roof Repair","City of Edgewood","Orange","roofing","","https://edgewood-fl.gov/cityhall/page/rfp-2026-epd-01-flat-roof-repair","6b7fb5bed8e2ee79"],["ITB 26-011 Laboratory Services for City Water & Wastewater Facilities","City of Ocoee","Orange","sitework-heavy-civil","","https://www.ocoee.org/1365/ITB-26-011-Laboratory-Services-for-City-","6982447f20c0141a"]]],
  "palm-beach": [34,3,31,[["Town Hall Roof Replacement","City of South Palm Beach","Palm Beach","roofing","2026-11-30","https://www.southpalmbeach.com/bids.aspx?bidID=1","d628bda30e789524"],["RFP 26.01 Paul Kintz Memorial Park Renovation Project No. KNZ 26.01","City of Atlantis","Palm Beach","commercial-general-contracting","","https://atlantisfl.gov/206/Bid-Proposal-Requests","5549246627a8655d"],["Request for Qualifications for HVAC Installation and Maintenance Services PBCHA-RFQ-2026-06","Palm Beach County Housing Authority","Palm Beach","plumbing-hvac","","https://www.pbchafl.org/current-bids-and-solicitations/","1ecd742032eb0a6d"]]],
  "pasco": [22,3,19,[["2609-ST STREET PAVING 2026 PROJECT (Due: May 7,2026 by 2:00p.m.)","City of Dade City","Pasco","sitework-heavy-civil","","https://dadecityfl.gov/our_government/government_business/bids_quotes_auctions.php","24f5ce7a4c1edbce"],["ITB26-021 Sludge Thickener Rake & Plow Structure Refurbishment (PDF, 110KB)","City of New Port Richey","Pasco","commercial-general-contracting","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-021-sludge-thickener-rake-plow-structure-refurbishment-bids-received-signed.pdf","054d5e46f31d2a68"],["Resurfacing / Drainage / Electrical","FDOT Contracts Administration","Pasco","electrical","","https://ftp.fdot.gov/public/file/l-hwlpwv6emlbkwybpvjqw/T7607BSN.pdf","209c0f002c21cd89"]]],
  "pinellas": [10,3,7,[["On-Call Plumbing and Electrical Contractor Services - RFB","City of St. Pete Beach","Pinellas","electrical","2026-12-02","https://www.stpetebeach.org/bids.aspx?bidID=129","ca4c19a95e18d4ac"],["PASS-A-GRILLE-PASS, MAINTENANCE DREDGING, PINELLAS COUNTY, FLORIDA","W074 ENDIST JACKSNVLLE","Pinellas","sitework-heavy-civil","2026-11-20","https://sam.gov/opp/a0dd3e2704ae47b6bd49fcf88c711098/view","8991f101265c4edb"],["IFB 2026-PW-01 Safety Harbor Heights - Palmetto Dr. and Wooddell Dr. Water Main Replacement","City of Safety Harbor","Pinellas","sitework-heavy-civil","","https://www.cityofsafetyharbor.com/607/Solicitations","4d8e436fbe6f6158"]]],
  "polk": [64,3,61,[["F1A11 DISTRICT 1 HQ HVAC IMPROVEMENTS","Florida Department of Transportation (FDOT)","Polk","plumbing-hvac","2026-11-24","https://vendor.myfloridamarketplace.com/search/bids/detail/17108","c38f70e62a82ad4a"],["Bid 27-035 Crushed Concrete Material","Polk County","Polk","sitework-heavy-civil","2026-11-25","https://www.polkfl.gov/bid-form/bid-27-035/","3cd16e7100d4893f"],["Water & Wastewater Utilities Supplies, Parts & Equipment \u2013 Catalog Discount","City of Bartow","Polk","sitework-heavy-civil","2029-05-31","https://www.cityofbartow.net/bids.aspx?bidID=27","809c19634f48ed7c"]]],
  "putnam": [11,3,8,[["Advertisement for Bids - Crescent City New Fire Station - No. 111026","City of Crescent City","Putnam","commercial-general-contracting","","https://crescentcity-fl.com/wp-content/uploads/2026/11/01-Bid-Advertisement-Invitation-Revised-09-Nov-26.pdf","1c80778adb64bcea"],["Lease of Volunteer Fire Station #19","Putnam County BOCC","Putnam","commercial-general-contracting","","https://apps.putnam-fl.com/bocc/callForBidsViewer/","07042d294395bece"],["PLATT DREW RECLAMATION FACILITY HEADWORKS REHABILITATION PROJECT","City of Palatka","Putnam","commercial-general-contracting","","https://www.palatka-fl.gov/bids.aspx?bidID=225","a5addb61b5b6eb46"]]],
  "st-johns": [1,1,0,[["Oceanside Circle Roadway Resiliency/Floodwater Mitigation System","City of St. Augustine Beach","St. Johns","sitework-heavy-civil","2026-12-03","https://www.staugbch.com/bids.aspx?bidID=2","a7f293ac64231caa"]]],
  "st-lucie": [18,3,15,[["Plumbing Contractor Services - ITB 26-14","St. Lucie Public Schools","St. Lucie","plumbing-hvac","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L1BsdW1iaW5nIENvbnRyYWN0b3IgU2VydmljZXMgLSBJVEIgMjYtMTQ%3D&m1dll_index_get=0","110af9a7d745a5db"],["Intermediate Bridge / Drainage / Grading","FDOT Contracts Administration","St. Lucie","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/r6ulezxn_0ol1an16ygkdg/T4767BSN.pdf","bf965fdbd86b7a38"],["Painting Contractor Services - ITB 23-11","St. Lucie Public Schools","St. Lucie","painting","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L1BhaW50aW5nIENvbnRyYWN0b3IgU2VydmljZXMgLSBJVEIgMjMtMTE%3D&m1dll_index_get=0","117339edad939210"]]],
  "santa-rosa": [4,2,2,[["2026.15 Effluent Discharge System Downtown Plant Pump Station","City of Milton","Santa Rosa","sitework-heavy-civil","2026-12-17","https://www.miltonfl.org/bids.aspx?bidID=125","530d3baf087646bd"],["Request for Qualifications | RFQ 2-2025/2026 At-Risk Construction Management Services Training Center","Pensacola State College","Escambia/Santa Rosa","commercial-general-contracting","","https://pensacolastate.edu/purchasing/request-for-qualifications-rfq-2-2025-2026-at-risk-construction-management-services-training-center/","fe91d65171ca8d9d"]]],
  "seminole": [5,2,3,[["2025-007-ITB-CB - Invitation to Bid - Airport Remote Parking Lot Construction","Sanford Airport Authority","Seminole","commercial-general-contracting","","https://flysfb.com/business/procurement/solicitations/","79968d35819b31c0"],["Traffic Signal / Drainage / Resurfacing / Grading / Electrical","FDOT Contracts Administration","Seminole","electrical","","https://ftp.fdot.gov/public/file/3j3cnbxrpuqk9u7cfcp_oq/T5863BSN.pdf","7ee571711ac02ccb"]]],
  "taylor": [4,2,2,[["Hodges Park Rehabilitation at Keaton Beach","Taylor County","Taylor","commercial-general-contracting","","https://www.taylorcountygov.com/bid_detail_T25_R195.php","1f02cabb2fc4daf3"],["USACE Floodplain Mitigation Drainage Project","Taylor County","Taylor","sitework-heavy-civil","","https://www.taylorcountygov.com/bid_detail_T25_R183.php","5e35dac576cc5b89"]]],
  "volusia": [19,3,16,[["RFQ 2026-02 - Town Of Ponce Inlet Collection System Improvements Phase 1, SRF #WW 64141","Town of Ponce Inlet","Volusia","commercial-general-contracting","2026-11-19","https://www.ponce-inlet.org/bids.aspx?bidID=36","9cc1f4cdaf9fc582"],["New Smyrna Beach High - Baseball and Softball Field Lighting - Project No. 2648276","Volusia County Schools","Volusia","electrical","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","152ec65e1a6c3a49"],["RFP 38-26 - Splashpad Renovation and Improvement","City of DeBary","Volusia","commercial-general-contracting","","https://www.debary.org/bids.aspx?bidID=22","31748dcd7907f747"]]],
  "wakulla": [3,1,2,[["ITB 2026-20 REBID Lower Bridge Floating Dock Improvements","Wakulla County","Wakulla","sitework-heavy-civil","","https://www.mywakulla.com/bids_and_procurements/2026_bids_and_procurements.php","551c32ac7a0e9364"]]],
  "walton": [1,1,0,[["Invitation to Bid, Community Center Roof Replacement","City of DeFuniak Springs","Walton","roofing","","https://www.defuniaksprings.net/1230/Bids-RFPs","427f057d476ae4d1"]]],
  "washington": [36,3,33,[["Signalization RepairPrequalification is required to bid on this project.","FDOT District 3","Washington","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/dec10/e3z70.pdf?sfvrsn=8eabcf60_1","75fb8fcbf370c86d"],["East & West Bound Rest Area ImprovementsA Builders License or General Contractors License is required for this project.","FDOT District 3","Washington","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/jun11/e3z24.pdf?sfvrsn=bbeaa8dd_1","0abb29ca85736a53"],["Districtwide Pre-Event Generator and Signal RepairFHWA 1273 and Davis Bacon Wage Rates are applicable for this Contract.","FDOT District 3","Washington","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/nov13/z3045-r0.pdf?sfvrsn=5341ebab_1","0f2b55626db30967"]]],
  "roofing": [20,3,17,[["ITB#C007073 ROOFING PROJECT \u2013 SSA OPERATIONS BUILDING","Central Florida Tourism Oversight District","Statewide","roofing","2026-12-15","https://vendor.myfloridamarketplace.com/search/bids/detail/17469","940a8b86dae70b8c"],["ITB-25-007 Statewide Roof Maintenance, Repair, and Replacement Services","Florida Department of Corrections (FDC)","Statewide","roofing","2026-12-31","https://vendor.myfloridamarketplace.com/search/bids/detail/14026","41568f21469d4b90"],["Town Hall Roof Replacement","City of South Palm Beach","Palm Beach","roofing","2026-11-30","https://www.southpalmbeach.com/bids.aspx?bidID=1","d628bda30e789524"]]],
  "electrical": [76,3,73,[["ITB-26-088 Electrical Maintenenace and Repair Services","Florida Department of Corrections (FDC)","Statewide","electrical","2027-04-30","https://vendor.myfloridamarketplace.com/search/bids/detail/16428","698092c185e33e9c"],["27-002 Traffic Signalization & Street Lighting","City of Pensacola","Escambia","electrical","2026-12-09","https://www.cityofpensacola.com/bids.aspx?bidID=654","1429aba240d0d198"],["Legacy Park Substation Transformer #2","City of Alachua","Alachua","electrical","2026-11-30","https://www.cityofalachua.com/bids.aspx?bidID=9","2f78a6726933b898"]]],
  "plumbing-hvac": [21,3,18,[["ITB ITB# FAC/270142 HVAC Repairs and Installation - As Needed","City of Ocala","Marion","plumbing-hvac","2026-12-02","https://florida.prorfx.com/Listings.aspx","13b01ccf36308eee"],["RFP-27-047 PUBLIC ANNOUNCEMENT FOR HVAC CONTROL UPGRADES (PHASE II) RFP-27-047","Florida School for the Deaf and the Blind (FSDB)","Statewide","plumbing-hvac","2026-12-09","https://vendor.myfloridamarketplace.com/search/bids/detail/17318","62c2a3d160a40884"],["J041--TIERED EVALUATION: Preventive Maintenance and Repair  Services for HVAC Water Chillers and Air Handling Units  (AHU) at the VA Caribbean Healthcare System (VACHS)","248-NETWORK CONTRACT OFFICE 8 (36C248)","Statewide","plumbing-hvac","2027-01-12","https://sam.gov/opp/062dcbc341f14f2d9c35f680dc03588a/view","6a999b381dbf22f8"]]],
  "sitework-heavy-civil": [294,3,291,[["ITB ITB# REC/270181 Fort King Tennis Center Resurfacing","City of Ocala","Marion","sitework-heavy-civil","2026-12-15","https://florida.prorfx.com/Listings.aspx","d4013e492ab1ae6b"],["RFP-27-068 PUBLIC ANNOUNCEMENT FOR Existing McClure Demolition & Beautification-RFP-27-068","Florida School for the Deaf and the Blind (FSDB)","Statewide","sitework-heavy-civil","2026-12-08","https://vendor.myfloridamarketplace.com/search/bids/detail/17298","931ace294c99a628"],["Port Charlotte Beach Park Boat Ramp Replacement","Charlotte County","Charlotte","sitework-heavy-civil","2026-12-16","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8354","7d7ecce1ae3795a5"]]],
  "commercial-general-contracting": [188,3,185,[["Fence Improvements - Portwide","Miami-Dade County","Miami-Dade","commercial-general-contracting","2026-12-04","https://www.miamidade.gov/apps/isd/StratProc/Home/SolicitationDetails?solicitationNumber=MCC%207360%20RPQ%20No%20M2026-009R","33063ed4d0507d01"],["Beach Access 9 Boardwalk Construction","City of Fernandina Beach","Nassau","commercial-general-contracting","2026-12-18","https://www.fbfl.us/bids.aspx?bidID=396","fe4befbb0f6af5a0"],["Fire Station #1 Wind Retrofit & Safe Room","City of Lynn Haven","Bay","commercial-general-contracting","2026-12-11","https://www.cityoflynnhaven.gov/bids.aspx?bidID=167","d0b5ff79b27cb367"]]],
  "painting": [9,3,6,[["ITB-27-075 PUBLIC ANNOUNCEMENT FOR Wartmann Interior Painting Project ITB-27-075","Florida School for the Deaf and the Blind (FSDB)","Statewide","painting","2026-11-24","https://vendor.myfloridamarketplace.com/search/bids/detail/17437","41c20c1e0318c61f"],["CQ 26-442 Administration Building, Jury & Property Appraiser Parking Lots (Striping and Sealcoat)","Polk County","Polk","painting","2026-11-25","https://www.polkfl.gov/bid-form/cq-26-442/","ff1ad7a1dee92980"],["Request for Qualifications for Drywall and Painting Services","Palm Beach County Housing Authority","Palm Beach","painting","","https://www.pbchafl.org/current-bids-and-solicitations/","992877fd3991023e"]]],
  "landscaping": [54,3,51,[["Ancillary Park Grounds Maintenance & Related Services","Lake County","Lake","landscaping","2026-12-15","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=27-407","7dee0b891f32b882"],["ITB -17200 DJJ ITB 26/27 008 Lawn Care Services - Pine Hills","Department of Juvenile Justice (DJJ)","Statewide","landscaping","2026-12-01","https://vendor.myfloridamarketplace.com/search/bids/detail/17200","dc2447987e54ddd8"],["Contractual Maintenance/Mowing of City Cemetery","City of Inverness","Citrus","landscaping","2026-11-23","https://www.inverness.gov/bids.aspx?bidID=14","248dbce1ac60eeb5"]]],
  "alachua/electrical": [3,1,2,[["Legacy Park Substation Transformer #2","City of Alachua","Alachua","electrical","2026-11-30","https://www.cityofalachua.com/bids.aspx?bidID=9","2f78a6726933b898"]]],
  "bay/electrical": [1,1,0,[["RFP 2026 \u2013 07 Purchase & Installation of a 48 kW Deisel Generator","City of Mexico Beach","Bay","electrical","","https://mexicobeachfl.gov/uploads/2026/10/RFP-2026-07-Generator.pdf","f939bfaa0b64b911"]]],
  "bay/sitework-heavy-civil": [6,3,3,[["Bailey Bridge Rehabilitation Project","City of Lynn Haven","Bay","sitework-heavy-civil","2026-12-15","https://www.cityoflynnhaven.gov/bids.aspx?bidID=168","65dc07d8b1d9c6b1"],["ITB 2026-05 Boat Ramp Expansion & Repairs","City of Mexico Beach","Bay","sitework-heavy-civil","","https://mexicobeachfl.gov/uploads/2026/04/ITB-2026-05-Boat-Ramp-Expansion-Repairs.pdf","72d315ac76add3b9"],["ITB 2026-01_PARKER 2025 ROADWAY RESURFACING_BID SPECS","City of Parker","Bay","sitework-heavy-civil","","https://cityofparker.com/doing-business/bids/","337e411f9f05cc87"]]],
  "bay/commercial-general-contracting": [1,1,0,[["Fire Station #1 Wind Retrofit & Safe Room","City of Lynn Haven","Bay","commercial-general-contracting","2026-12-11","https://www.cityoflynnhaven.gov/bids.aspx?bidID=167","d0b5ff79b27cb367"]]],
  "bradford/roofing": [1,1,0,[["(RFP 09142026 \u2013 2 Roof Replacement Project)","Bradford County","Bradford","roofing","","https://www.bradfordcountyfl.gov/bid-advertisements/","1767a675e53fbcd6"]]],
  "bradford/commercial-general-contracting": [1,1,0,[["RFP26-002NursingRemodelBoardPacket_1.pdf","Bradford County School District","Bradford","commercial-general-contracting","","https://www.bradfordschools.org/fs/resource-manager/view/3bfaf48c-ded5-4859-b029-20082d5439e0","9dfad929564723f6"]]],
  "brevard/sitework-heavy-civil": [4,2,2,[["Beach Renourishment, Kennedy Space Center, Brevard County, Florida","W074 ENDIST JACKSNVLLE","Brevard","sitework-heavy-civil","2026-12-22","https://sam.gov/opp/28bbe35293f346269b569afa69ca53a0/view","7d4c60615b592486"],["2027-01 Stormwater Pilot Project","City of Cape Canaveral","Brevard","sitework-heavy-civil","","https://www.capecanaveral.gov/bid_detail_T8_R58.php","788911130f8c6658"]]],
  "brevard/commercial-general-contracting": [3,1,2,[["Millennium Beach Park Pavilion","City of Indian Harbour Beach","Brevard","commercial-general-contracting","2026-11-20","https://www.indianharbourbeach.org/bids.aspx?bidID=26","4a0eccb90854566c"]]],
  "broward/electrical": [8,3,5,[["Pre-Event Emergency Generator Installation and Traffic Signal Repair","FDOT District 4","Broward","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d4/lettings/2026/apr03/z4153-r0.pdf?sfvrsn=911f0a82_1","4059a04ce400f0ec"],["2026-14 51st Year CDBG Mickel Park Electrical Upgrades - Re-Bid","City of Wilton Manors","Broward","electrical","","https://www.wiltonmanors.gov/bids.aspx?bidID=165","9b0683b3d586492e"],["Electrical / CTC / Roadway Signing","FDOT Contracts Administration","Broward","electrical","","https://ftp.fdot.gov/public/file/tewbptrn9ekkbukhckyhjg/T4755BSN.pdf","323dc53994717c05"]]],
  "broward/sitework-heavy-civil": [14,3,11,[["2026-006 BID Winfield Blvd Pedestrian Sidewalk and Bridge","City of Margate","Broward","sitework-heavy-civil","2026-11-19","https://www.margatefl.com/bids.aspx?bidID=142","b38ec0ff347e1db7"],["ITB 26-03 - SW 36th Court Drainage Improvements","Town of Pembroke Park","Broward","sitework-heavy-civil","","https://www.tppfl.gov/319/Solicitations","3d07e08b5ffca26a"],["Drainage Repair","FDOT District 4","Broward","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d4/lettings/2026/jun05/e4y69.pdf?sfvrsn=7c2533ec_1","841f8b5d14642a81"]]],
  "broward/commercial-general-contracting": [8,3,5,[["Pre-Event Cut & Toss","FDOT District 4","Broward","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d4/lettings/2026/apr03/z4150-r0.pdf?sfvrsn=a25e3752_1","4b3cb4aea894c03d"],["Exhibit A Engineered Drawings ITB 2025-12-02 Hillsboro Beach Town Hall Parking Lot Improvements","Town of Hillsboro Beach","Broward","commercial-general-contracting","","https://www.townofhillsborobeach.com/DocumentCenter/View/6524/Exhibit-A-Engineered-Drawings-ITB-2025-12-02--Hillsboro-Beach-Town-Hall-Parking-Lot-Improvements","724c5d91bd941537"],["2026-10 Tidal Valve Program","City of Wilton Manors","Broward","commercial-general-contracting","","https://www.wiltonmanors.gov/bids.aspx?bidID=159","374cf690d0667b54"]]],
  "charlotte/roofing": [1,1,0,[["Roofing and Roof Repairs - Annual Contract","Charlotte County","Charlotte","roofing","2026-11-25","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8350","a388fd2ad8457d53"]]],
  "charlotte/electrical": [4,2,2,[["Highway Lighting off State Highway System","Charlotte County","Charlotte","electrical","2026-12-09","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8348","0f5f9a45c48b694c"],["Generator Inspections, Services and Repairs","Charlotte County Public Schools","Charlotte","electrical","","https://files.smartsites.parentsquare.com/6026/2425-67mp2_award_letter.pdf","00249a557b3125e9"]]],
  "charlotte/sitework-heavy-civil": [5,2,3,[["Port Charlotte Beach Park Boat Ramp Replacement","Charlotte County","Charlotte","sitework-heavy-civil","2026-12-16","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8354","7d7ecce1ae3795a5"],["RFP #2025-07 Punta Rassa Boat Ramp Armor Mat Remove/Replace","West Coast Inland Navigation District","Charlotte","sitework-heavy-civil","","https://www.wcind.net/rfp/","16ead96397fe630b"]]],
  "charlotte/commercial-general-contracting": [3,1,2,[["Live Oak Point- Shoreline Stabilization","Charlotte County","Charlotte","commercial-general-contracting","2026-12-02","https://purchasingbids.charlottecountyfl.gov/ContractsCatalogs/DetailsTabs/8345","dcac885530dd97af"]]],
  "charlotte/painting": [1,1,0,[["Preventative Painting Maintenance","Charlotte County Public Schools","Charlotte","painting","","https://files.smartsites.parentsquare.com/6026/2223-28gb1_award_letter_for_website.pdf","e110167a3ac7c065"]]],
  "citrus/sitework-heavy-civil": [1,1,0,[["Roadway Signing / Pavement Markings","FDOT Contracts Administration","Citrus","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/qyaxo8cugeqejtw_ocpn-q/T7576BSN.pdf","a3393cc947ab9c4f"]]],
  "citrus/landscaping": [1,1,0,[["Contractual Maintenance/Mowing of City Cemetery","City of Inverness","Citrus","landscaping","2026-11-23","https://www.inverness.gov/bids.aspx?bidID=14","248dbce1ac60eeb5"]]],
  "collier/roofing": [2,1,1,[["RFQ #2026-01 For Construction Services for Roof Repairs and Replacements at Farm Worker's Village (USDA) CCHA's A&B Properties","Collier County Housing Authority","Collier","roofing","","https://www.cchafl.org/procurement-bids-rfps","0a6f202e3459b801"]]],
  "collier/electrical": [2,1,1,[["Invitation To Bid- Airfield Lighting and Electrical Vault Replacement","Naples Airport Authority (titles only)","Collier","electrical","","https://www.flynaples.com/invitation-to-bid-airfield-lighting-and-electrical-vault-replacement/","6e093ce7f43509ff"]]],
  "collier/sitework-heavy-civil": [1,1,0,[["Bid Notice RoadRepair- ITB-25-2.pdf","City of Everglades City","Collier","sitework-heavy-civil","","https://www.cityofeverglades.org/_files/ugd/5b01fc_3353cdca92cd47cab85a6141df3c9158.pdf","063f982ce25c015b"]]],
  "collier/commercial-general-contracting": [3,1,2,[["Invitation To Bid- Perimeter Fence Replacement 2025","Naples Airport Authority (titles only)","Collier","commercial-general-contracting","","https://www.flynaples.com/invitation-to-bid-perimeter-fence-replacement-2025/","7fbde35eb2dc4421"]]],
  "collier/landscaping": [1,1,0,[["Landscape and Lawn Maintance RFP 2025-003 Immokalee Fire Control District Read more \u00bb","Immokalee Fire Control District","Collier","landscaping","","https://www.immfire.com/landscape-and-lawn-maintance-rfp-2025-003","61eb4261b2f436c6"]]],
  "columbia/sitework-heavy-civil": [21,3,18,[["2026-2027 Annual Resurfacing - SE Hillcrest Lane, SW Fedora Way, SW Young Place","Columbia County","Columbia","sitework-heavy-civil","2026-11-24","https://www.columbiacountyfla.com/PurchasingBid.aspx?Id=1767","619e9266f3a15ba0"],["Polyurethane Injection at drainage structures, drainage pipes, box culverts, asphalt","FDOT District 2","Columbia","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/jan21/e21s8-r01b705735586d4fe2bc1e20f22caa0c12.pdf?sfvrsn=631d18c5_1","1e36f4ee18e42b4d"],["Furnish, install and establish highway landscaping and fence installation on I-10","FDOT District 2","Columbia","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/jan21/e21u2b1cb5e6cc8fb4e8da2b9c8f8b9c70996.pdf?sfvrsn=b1301077_1","37511156f26b7bcd"]]],
  "columbia/commercial-general-contracting": [2,1,1,[["Hot Plant-Mixed Bituminous Courses","FDOT District 2","Columbia","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/sep16/e21z0.pdf?sfvrsn=ac92ec0c_1","2c01257c3a9d2cb0"]]],
  "columbia/landscaping": [7,3,4,[["Slope mowing and litter removal to maintain outfall ditches","FDOT District 2","Columbia","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/dec16/e22h1-r0.pdf?sfvrsn=7530d97b_1","2186da112840cad2"],["Edging, sweeping, removing, and disposing of vegetation","FDOT District 2","Columbia","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/dec16/e22b6-r0.pdf?sfvrsn=72d50eb8_1","73e44956dfde42fb"],["Slope mowing, intermediate mowing and litter removal","FDOT District 2","Columbia","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d2/lettings/2026/dec16/e22g9-r0.pdf?sfvrsn=a7447a80_1","d0b12109a5a37c36"]]],
  "desoto/electrical": [1,1,0,[["Request for Proposals: As-Needed Electrical Contractor Services","Peace River Manasota Regional Water Supply Authority","DeSoto","electrical","","https://regionalwater.org/procurement-policy-and-bidding/","1b84cb37c301dc38"]]],
  "duval/roofing": [2,1,1,[["TPO ROOF RETROFITS AT TMT AUTO FACILITY","JAXPORT (Jacksonville Port Authority)","Duval","roofing","","https://www.jaxport.com/procurement/active-solicitations/entry/14333/","9122ce06fb297581"]]],
  "duval/electrical": [3,1,2,[["Rebuild Engine and Reconditioning of the generator on crane #10487","JAXPORT (Jacksonville Port Authority)","Duval","electrical","","https://www.jaxport.com/procurement/active-solicitations/entry/13957/","40b21c6a55560e74"]]],
  "duval/plumbing-hvac": [2,1,1,[["PLUMBING MAINTENANCE AND REPAIR SERVICES","JAXPORT (Jacksonville Port Authority)","Duval","plumbing-hvac","","https://www.jaxport.com/procurement/active-solicitations/entry/11402/","e2adf84381c48436"]]],
  "duval/sitework-heavy-civil": [5,2,3,[["WAREHOUSE DEMOLITION AT 1732 TALLEYRAND AVENUE","JAXPORT (Jacksonville Port Authority)","Duval","sitework-heavy-civil","","https://www.jaxport.com/procurement/active-solicitations/entry/12868/","0c43855a92b98ea2"],["Portland Cement Concrete","FDOT Contracts Administration","Duval","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/a3oxdpvinks-j6vejyw_cq/T2A37BSN.pdf","283ee27c185b43ef"]]],
  "duval/commercial-general-contracting": [15,3,12,[["Latham Plaza Parking Lot Public-Private Partnership (P3)","City of Jacksonville Beach","Duval","commercial-general-contracting","","https://www.jacksonvillebeach.org/bids.aspx?bidID=104","6bd331c5ccb9c56f"],["TMT CRANE RAIL GROUT REPAIR (FOOT MARKER 360 to 510)","JAXPORT (Jacksonville Port Authority)","Duval","commercial-general-contracting","","https://www.jaxport.com/procurement/active-solicitations/entry/13974/","003581dc74c3091c"],["WATERMAIN PERMANENT RELOCATION AT BIMT DAVE RAWLS/WILLIAM MILLS INTERSECTION","JAXPORT (Jacksonville Port Authority)","Duval","commercial-general-contracting","","https://www.jaxport.com/procurement/active-solicitations/entry/12549/","0f7acbffb34c6603"]]],
  "duval/painting": [2,1,1,[["Cruise Terminal Striping for Norwegian Cruise Line","JAXPORT (Jacksonville Port Authority)","Duval","painting","","https://www.jaxport.com/procurement/active-solicitations/entry/12585/","8beb0087692009de"]]],
  "duval/landscaping": [1,1,0,[["PCOB LAWNCARE & SPRINKLER MAINTENANCE (100% SEB Set Aside)","JAXPORT (Jacksonville Port Authority)","Duval","landscaping","","https://www.jaxport.com/procurement/active-solicitations/entry/12784/","e8e8fdf93e5365d2"]]],
  "escambia/electrical": [1,1,0,[["27-002 Traffic Signalization & Street Lighting","City of Pensacola","Escambia","electrical","2026-12-09","https://www.cityofpensacola.com/bids.aspx?bidID=654","1429aba240d0d198"]]],
  "escambia/commercial-general-contracting": [5,2,3,[["Invitation To Bid: Port of Pensacola Road and Rail Rehabilitation Capital Improvement Project","Port of Pensacola","Escambia","commercial-general-contracting","","https://www.cityofpensacola.com/3595/Public-Notices-at-Port-of-Pensacola","9fffe99d785a2043"],["Request for Qualifications | RFQ 2-2025/2026 At-Risk Construction Management Services Training Center","Pensacola State College","Escambia/Santa Rosa","commercial-general-contracting","","https://pensacolastate.edu/purchasing/request-for-qualifications-rfq-2-2025-2026-at-risk-construction-management-services-training-center/","fe91d65171ca8d9d"]]],
  "flagler/sitework-heavy-civil": [1,1,0,[["ITB-PW-26-68 CITYWIDE CONCRETE \u2013 4,000 PSI WITH FIBER MESH","City of Palm Coast","Flagler","sitework-heavy-civil","","https://www.palmcoast.gov/procurement","9b5ff0d5f4f95c6e"]]],
  "flagler/commercial-general-contracting": [1,1,0,[["Request for Qualifications Clearwell Tank Design","City of Flagler Beach","Flagler","commercial-general-contracting","2026-11-30","https://www.cityofflaglerbeach.com/bids.aspx?bidID=158","6f8122c0002d8441"]]],
  "flagler/landscaping": [2,1,1,[["ITB-CD-27-05 WILDFIRE UNDERBRUSH MOWING","City of Palm Coast","Flagler","landscaping","","https://www.palmcoast.gov/procurement","8996deb7af39cc7a"]]],
  "franklin/sitework-heavy-civil": [2,1,1,[["ITB- CIGP 6th Street Eastpoint Widening and Resurfacing","Franklin County BOCC","Franklin","sitework-heavy-civil","","https://www.franklincountyflorida.com/resources/county-bids-awards/","3e04d09eba93d870"]]],
  "gadsden/sitework-heavy-civil": [1,1,0,[["Intermediate Bridge Replacement","FDOT Contracts Administration","Gadsden","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/8khmnjw18umrbbyi3aeblg/T3981BSN.pdf","02ff61270b37e455"]]],
  "glades/electrical": [1,1,0,[["CALLING FOR PROPOSALS \u2013 CITY HALL GENERATOR","City of Moore Haven","Glades","electrical","","https://moorehaven.org/rfp-itb/","b3dc023ea4ced69b"]]],
  "glades/sitework-heavy-civil": [1,1,0,[["INVITATION TO BID \u2013 ROAD RESURFACING","City of Moore Haven","Glades","sitework-heavy-civil","","https://moorehaven.org/rfp-itb/","f696ab4649f21402"]]],
  "glades/commercial-general-contracting": [1,1,0,[["CALLING FOR PROPOSALS \u2013 ADA-COMPLIANT AUTO ENTRANCE CITY HALL","City of Moore Haven","Glades","commercial-general-contracting","","https://moorehaven.org/rfp-itb/","2e03d530ca4da8d4"]]],
  "hendry/roofing": [1,1,0,[["ITB 27-0001 - LaBelle High School Re-roof project","Hendry County School District","Hendry","roofing","","https://resources.finalsite.net/images/v1786651929/hendryschoolsorg/lu74cafqpkescgc43258/ITB27-0001-LaBelleHighSchoolRe-roofproject.pdf","f88108d89b0cbc7d"]]],
  "hendry/sitework-heavy-civil": [3,1,2,[["ITB 2026-02 City of Clewiston Water System Infrastructure Improvements Project","City of Clewiston","Hendry","sitework-heavy-civil","","https://www.clewiston-fl.gov/bids.aspx?bidID=8","8259f800a162987d"]]],
  "hendry/commercial-general-contracting": [3,1,2,[["ITB 27-005- Invitation to Bid District Wide Facilities Maintenance Renovation & Specialized Trade Services","Hendry County School District","Hendry","commercial-general-contracting","","https://resources.finalsite.net/images/v1794001898/hendryschoolsorg/j6d3evrwowrwdevrkgmu/FinalITB27-0051162026.pdf","cddedcdad976919c"]]],
  "hernando/sitework-heavy-civil": [1,1,0,[["Resurfacing / Portland Cement Concrete","FDOT Contracts Administration","Hernando","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/_aj1szf69ksch3rji8axia/T7577BSN.pdf","a2ec67f3e0986b71"]]],
  "hernando/commercial-general-contracting": [1,1,0,[["City of Brooksville Downtown Revitalization Construction","City of Brooksville","Hernando","commercial-general-contracting","2026-12-07","https://www.cityofbrooksville.us/bids.aspx?bidID=51","eb0cc7efb5f33c08"]]],
  "highlands/sitework-heavy-civil": [2,1,1,[["Drainage / Grading / Resurfacing","FDOT Contracts Administration","Highlands","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/nv4d_w1k30ufo4ewjyzlew/T1933BSN.pdf","45b0b3ca8e90e1bb"]]],
  "hillsborough/electrical": [2,1,1,[["Pre-Event Emergency Generator Installation and Traffic Signal Repair (Type I)Prequalification required","FDOT District 7","Hillsborough","electrical","","https://ftp.fdot.gov/public/file/c0yospoh_koxyqeeepoeja/Z7105-R0.pdf","9cee74a801b98355"]]],
  "hillsborough/sitework-heavy-civil": [21,3,18,[["IFB-26-00378 Big Bend Road from US 41 to Covington Garden Dr.","Hillsborough County BOCC","Hillsborough","sitework-heavy-civil","","https://hcfl.gov/businesses/doing-business-with-hillsborough/vendors/notice-of-select-upcoming-procurements","89915b9ba15f7d3d"],["US 92/SR 600 - Resurfacing","FDOT District 7","Hillsborough","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/aa8dx5vp3u2_j-xfb_kslg/E7U76.pdf","0d8300b4444a1116"],["Bridge Repair","FDOT Contracts Administration","Hillsborough","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/0mnryzgtpuc6uc4iqo0gmw/T7619BSN.pdf","21ca609742a4626e"]]],
  "hillsborough/commercial-general-contracting": [4,2,2,[["Wind Protection Hardening - Fire Station 1 and 2","City of Temple Terrace","Hillsborough","commercial-general-contracting","2026-12-10","https://www.templeterrace.gov/bids.aspx?bidID=56","0f265ef5af19484f"],["SR 600 (US 92) - Traffic Ops Improvement","FDOT District 7","Hillsborough","commercial-general-contracting","","https://ftp.fdot.gov/public/file/yosqdnqdpkkpjgzddxscug/E7V18.pdf","59ad4bae687df67e"]]],
  "hillsborough/landscaping": [3,1,2,[["Mowing, Litter Removal, and Edging - North and West Quads","FDOT District 7","Hillsborough","landscaping","","https://ftp.fdot.gov/public/file/7v8y4okr3ki4yxfqxox2fa/E7U87-R0.pdf","18aea3156eb25b94"]]],
  "holmes/electrical": [1,1,0,[["RFP--DESIGN-BUILD SERVICES REPLACEMENT GENERATOR FOR HDSB & BONIFAY K-8.pdf","Holmes District Schools","Holmes","electrical","","https://www.hdsb.org/?a=Files.Serve&File_id=EEA9216B-187F-4B23-A026-BC421D8262F1","b740c326dfffffc3"]]],
  "indian-river/sitework-heavy-civil": [2,1,1,[["Road and Bridge Division","Indian River County","Indian River","sitework-heavy-civil","","https://www.ircgov.com/Departments/Budget/Purchasing/services/public_works/road_and_bridge_division.php","4a292920a16d6be3"]]],
  "indian-river/commercial-general-contracting": [3,1,2,[["Fisherman's Landing Shoreline Protection & Parking Improvements (Re-Bid)","City of Sebastian","Indian River","commercial-general-contracting","","https://www.cityofsebastian.org/bids.aspx?bidID=1","37a15f9fae304619"]]],
  "lafayette/sitework-heavy-civil": [1,1,0,[["Minor Bridge Replacement","FDOT Contracts Administration","Lafayette","sitework-heavy-civil","","https://ftp.fdot.gov/public/file/4fuz1fyhfkctnvdpjtusbw/T2809BSN.pdf","177c2b48f74451e7"]]],
  "lake/electrical": [1,1,0,[["Pre-Event Emergency Generator Installation","FDOT District 5","Lake","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d5/lettings/2026/aug04/z5095.pdf?sfvrsn=1ddc8bd3_1","a0005dbd6df91f2a"]]],
  "lake/sitework-heavy-civil": [18,3,15,[["Road, Drainage, and Sidewalk Construction Services","Lake County","Lake","sitework-heavy-civil","2026-12-08","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=27-602","750809dbe2cbbb62"],["BDIPerformance Sidewalk, Inlet Tops and Curb and Gutter Management","FDOT District 5","Lake","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d5/lettings/2026/may05/e50e1.pdf?sfvrsn=f8383ca4_1","288dcdf28fcc0d60"],["RFP 2026-02 Fire Hydrant Inspection, Flow Testing, Maintenance & Painting","Town of Montverde","Lake","sitework-heavy-civil","","https://mymontverde.com/wp-content/uploads/2026/08/RFP-2026-02-Fire-Hydrant.pdf","ad8bff4fd4917b72"]]],
  "lake/commercial-general-contracting": [8,3,5,[["CR 466A from East of Timbertop Lane to East of Poinsettia Avenue Project","Lake County","Lake","commercial-general-contracting","2026-12-03","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=26-710","45d172d0d482858a"],["BDIDriveway Apron & Shoulder Rework","FDOT District 5","Lake","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d5/lettings/2026/apr07/e53e7.pdf?sfvrsn=14a47d9d_1","244924d99f7013a5"],["Mascotte Fl - Midway Avenue Elevated Storage Tank","City of Mascotte","Lake","commercial-general-contracting","","https://www.cityofmascotte.com/bids.aspx?bidID=16","1418b9565925b517"]]],
  "lake/landscaping": [3,1,2,[["Ancillary Park Grounds Maintenance & Related Services","Lake County","Lake","landscaping","2026-12-15","https://c.lakecountyfl.gov/offices/procurement_services/bid_details.aspx?bid_number=27-407","7dee0b891f32b882"]]],
  "lee/electrical": [1,1,0,[["Request for Proposal (RFP) from companies for a new commercial diesel generator for Station 3","Matlacha / Pine Island Fire Control District","Lee","electrical","","https://www.pineislandfire.org/request-for-rfp-rfq","8a0e31b41ffb9ca0"]]],
  "lee/commercial-general-contracting": [2,1,1,[["RFQ 26-011: Design and Construction of FGCU Institute for Sustainability and Community","Florida Gulf Coast University","Lee","commercial-general-contracting","","https://www.fgcu.edu/adminservices/officeofthecontroller/procurementservices/purchasing/solicitations/","4a1e7eb68e793e5c"]]],
  "liberty/electrical": [1,1,0,[["Notice to Receive Sealed Bids \u2013 Veterans Park Ballfield Lighting Repair","Liberty County","Liberty","electrical","","https://libertycountyfl.org/clerk-to-the-board/bids-rfp-frqs/notice-to-receive-sealed-bids-veterans-park-ballfield-lighting-repair/","e9b41bd4d39f13c3"]]],
  "liberty/sitework-heavy-civil": [5,2,3,[["Bristol Boat Ramp Improvements -Liberty CDBG-DR: Program Management Services","Liberty County","Liberty","sitework-heavy-civil","","https://libertycountyfl.org/uploads/2026/05/Liberty-CDBG-DR-RFP-Advertisement_Admin-002-1.pdf","2cf452be5f087ff0"],["County Road 379 Mary Branch Bridge Repair","Liberty County","Liberty","sitework-heavy-civil","","https://libertycountyfl.org/clerk-to-the-board/bids-rfp-frqs/notice-to-receive-sealed-bids-county-road-379-mary-branch-bridge-repair/","30ef929cda3df697"]]],
  "liberty/commercial-general-contracting": [1,1,0,[["Notice to Receive Sealed Bids \u2013 CR 12 SCRAP Phase II","Liberty County","Liberty","commercial-general-contracting","","https://libertyclerk-my.sharepoint.com/:b:/p/ddeloach/IQDiGg_nn01jSbgu_ZRVz45cAXcVpYpZK5vSBpDGgUqBujE?e=o5FPbb","e7852b9ef12d4a6e"]]],
  "madison/commercial-general-contracting": [1,1,0,[["RFP 2025-04 Bid Notice, Project 2025-AD1 Courthouse Annex Exterior Stair Repair","Madison County","Madison","commercial-general-contracting","","https://madisoncountyfl.com/rfp/","e02449479f50b298"]]],
  "manatee/landscaping": [1,1,0,[["Invitation to Bid 26-006 Landscape, Arboriculture, & Coastal Maintenance Services","City of Anna Maria","Manatee","landscaping","","https://www.cityofannamaria.com/172/Bids","704cb0d575722bf7"]]],
  "marion/plumbing-hvac": [2,1,1,[["ITB ITB# FAC/270142 HVAC Repairs and Installation - As Needed","City of Ocala","Marion","plumbing-hvac","2026-12-02","https://florida.prorfx.com/Listings.aspx","13b01ccf36308eee"]]],
  "marion/sitework-heavy-civil": [6,3,3,[["ITB ITB# REC/270181 Fort King Tennis Center Resurfacing","City of Ocala","Marion","sitework-heavy-civil","2026-12-15","https://florida.prorfx.com/Listings.aspx","d4013e492ab1ae6b"],["ITB 270139 Wastewater Tanker Services","City of Ocala","Marion","sitework-heavy-civil","2026-12-08","https://florida.prorfx.com/Listings.aspx","206d311f2fc2f542"],["ITB ITB# AIR/260692 OCF Runway 36 RSA Grading","City of Ocala","Marion","sitework-heavy-civil","","https://florida.prorfx.com/Listings.aspx","39af417e8ca33f79"]]],
  "marion/commercial-general-contracting": [6,3,3,[["ITB ITB# CIP/260015 456984-1-54-01 SR 464 and SE 25th Avenue Intersection Improvements","City of Ocala","Marion","commercial-general-contracting","2026-11-17","https://florida.prorfx.com/Listings.aspx","5d81f685bcf46c86"],["Building Renovation (General Contractor's License)","FDOT Contracts Administration","Marion","commercial-general-contracting","","https://ftp.fdot.gov/public/file/xgl0ocnx9koodfaq2qkahg/T9049BSN.pdf","cec943dcefdc4026"],["ITB 270026 Underground Boring and Conduit Installation Services","City of Ocala","Marion","commercial-general-contracting","2026-11-19","https://florida.prorfx.com/Listings.aspx","13bea70b050f8c9e"]]],
  "marion/landscaping": [1,1,0,[["ITB ITB# WRS/260709 Mowing for Ocala Wetland Recharge Park","City of Ocala","Marion","landscaping","","https://florida.prorfx.com/Listings.aspx","189920910550627c"]]],
  "miami-dade/roofing": [1,1,0,[["RFP 2026-04 Town Hall Roof Replacement","Town of Surfside","Miami-Dade","roofing","","https://www.townofsurfsidefl.gov/docs/default-source/bids-and-rfps/rfp-2026-04/rfp-2026-04-town-hall-roof-replacement.pdf?sfvrsn=9c26e294_1","c822fb87b59837a8"]]],
  "miami-dade/electrical": [6,3,3,[["ITB # 2026-11 Continuing Electrical Maintenance, Repair, Installation, and Emergency Services","Village of Key Biscayne","Miami-Dade","electrical","","https://www.keybiscayne.fl.gov/services/procurement/bid_detail_T32_R448.php","19606f6c6f0f3253"],["Replacement of the SunGuide Transportation Management Center (TMC) Video Wall, and the replacement of one permanent generator at a communications Hub building.","FDOT District 6 (Design-Build)","Miami-Dade","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d6/design-build/e6o72/e6o72scheduleofevents.pdf?sfvrsn=83e2fd38_2","3783938e6e9fab1c"],["Pre-Event - Emergency Lighting Permanent RepairPrequalification is required.","FDOT District 6","Miami-Dade","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d6/lettings/2026/mar26/z6185-r0.pdf?sfvrsn=81d2977b_1","4137955be5467076"]]],
  "miami-dade/plumbing-hvac": [1,1,0,[["RFP 2026-03 Town Hall HVAC Replacement","Town of Surfside","Miami-Dade","plumbing-hvac","","https://www.townofsurfsidefl.gov/docs/default-source/bids-and-rfps/rfp-2026-03/rfp-2026-03-town-hall-hvac-replacement.pdf?sfvrsn=6829e294_1","8cd7f24bb76fd717"]]],
  "miami-dade/sitework-heavy-civil": [34,3,31,[["Bridge Rehabilitation NW 7th Street over CSX R/R - Bridge No. 874229","Miami-Dade County","Miami-Dade","sitework-heavy-civil","2026-12-16","https://www.miamidade.gov/apps/isd/StratProc/Home/SolicitationDetails?solicitationNumber=20240212%20%28MCC%207360%29","0baa24aa8aa71232"],["West Bay Harbor Drive Drainage Improvements","Town of Bay Harbor Islands","Miami-Dade","sitework-heavy-civil","2026-12-10","https://www.bayharborislands-fl.gov/bids.aspx?bidID=60","ae26e8bbcab88411"],["DRAINAGE IMPROVEMENTS PROJECT AT SW 65 STREET AND SW 65 TERRACE","City of South Miami","Miami-Dade","sitework-heavy-civil","2026-12-01","https://www.somifl.gov/bids.aspx?bidID=291","07a602119a499865"]]],
  "miami-dade/commercial-general-contracting": [24,3,21,[["Fence Improvements - Portwide","Miami-Dade County","Miami-Dade","commercial-general-contracting","2026-12-04","https://www.miamidade.gov/apps/isd/StratProc/Home/SolicitationDetails?solicitationNumber=MCC%207360%20RPQ%20No%20M2026-009R","33063ed4d0507d01"],["RFP No.2025-006-02 4CK576403-Draft-AIA A102-Construction Contract","City of North Bay Village","Miami-Dade","commercial-general-contracting","","https://northbayvillage-fl.gov/bids-rfps/","d8a55fbeead115f8"],["ITB 2026-01 - Dune Restoration Project","Town of Surfside","Miami-Dade","commercial-general-contracting","","https://www.townofsurfsidefl.gov/docs/default-source/bids-and-rfps/itb-2026-01/itb-2026-01---dune-restoration-project.pdf?sfvrsn=8b6e294_1","21e83ad379427ffa"]]],
  "miami-dade/landscaping": [9,3,6,[["RFP 2025-01 Landscape and Related Services","Town of Surfside","Miami-Dade","landscaping","","https://www.townofsurfsidefl.gov/docs/default-source/bids-and-rfps/rfp-2025-01/rfp-2025-01-landscape-and-related-services.pdf?sfvrsn=9fdb1c94_3","aa9782e2ac1f440c"],["Landscape PushbuttonPrequalification is not required.Experience in Landscaping Form #850-070-09MUST be submitted with the bid as an attachment.","FDOT District 6","Miami-Dade","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d6/lettings/2026/jan29/e6p78.pdf?sfvrsn=e16befe8_1","6d4f5fedc7fcc5d8"],["Neat Streets Tree Planting Project","City of North Miami","Miami-Dade","landscaping","","https://northmiamifl.gov/bids.aspx?bidID=108","a67f2f39fef05443"]]],
  "monroe/electrical": [2,1,1,[["KEYS Bid 17-26 Specifications for Underground Padmount Transformer and Switchgear Inspections","Keys Energy Services","Monroe","electrical","","https://www.keysenergy.com/bid-information","5a3bf674ea5f054f"]]],
  "monroe/sitework-heavy-civil": [1,1,0,[["MARATHON HIGHWAY CROSSING IMPROVEMENTS, PHASE I","Florida Keys Aqueduct Authority","Monroe","sitework-heavy-civil","2026-11-19","https://www.fkaa.com/bids.aspx?bidID=344","c3760f416f58d821"]]],
  "monroe/commercial-general-contracting": [1,1,0,[["RFP 2026-01 Jet A Fuel Storage Tank Refurbishment & Inspection","Florida Keys Mosquito Control District","Monroe","commercial-general-contracting","","https://www.keysmosquito.org/bid-opportunities","9a7e98af0656c089"]]],
  "monroe/painting": [1,1,0,[["RFP 2024-11 Marathon Building Seal and Paint","Florida Keys Mosquito Control District","Monroe","painting","","https://www.keysmosquito.org/bid-opportunities","ea04f99a5acdc5c5"]]],
  "nassau/sitework-heavy-civil": [2,1,1,[["Asphalt Milling and Paving","City of Fernandina Beach","Nassau","sitework-heavy-civil","2026-11-24","https://www.fbfl.us/bids.aspx?bidID=395","096a66de0fbf6b43"]]],
  "nassau/commercial-general-contracting": [1,1,0,[["Beach Access 9 Boardwalk Construction","City of Fernandina Beach","Nassau","commercial-general-contracting","2026-12-18","https://www.fbfl.us/bids.aspx?bidID=396","fe4befbb0f6af5a0"]]],
  "okaloosa/sitework-heavy-civil": [3,1,2,[["ITB 26-08 Turkey Creek South Drainage and Parking Improvements","City of Niceville","Okaloosa","sitework-heavy-civil","","https://www.cityofniceville.org/412/Solicitations-Notices","23090f1ab587954c"]]],
  "okeechobee/sitework-heavy-civil": [30,3,27,[["Invitation to Bid - VPS #5 Group M Septic to Sewer","Okeechobee Utility Authority","Okeechobee","sitework-heavy-civil","","https://www.ouafl.com/legal-notice","009177c7b97426ae"],["Invitation to Bid - VPS #5 Group J Septic to Sewer Project","Okeechobee Utility Authority","Okeechobee","sitework-heavy-civil","","https://www.ouafl.com/legal-notice","0bf77b44ba6c43bb"],["Invitation to Bid - Improvements to Lift Station NW-15","Okeechobee Utility Authority","Okeechobee","sitework-heavy-civil","","https://www.ouafl.com/legal-notice","230d2240dbff7620"]]],
  "okeechobee/commercial-general-contracting": [1,1,0,[["Request for Proposal - SWTP Ozone Rehabilitation","Okeechobee Utility Authority","Okeechobee","commercial-general-contracting","","https://www.ouafl.com/legal-notice","162c76c4d4a754ba"]]],
  "orange/roofing": [2,1,1,[["RFP 2026-EPD-01: Flat Roof Repair","City of Edgewood","Orange","roofing","","https://edgewood-fl.gov/cityhall/page/rfp-2026-epd-01-flat-roof-repair","6b7fb5bed8e2ee79"]]],
  "orange/electrical": [7,3,4,[["UPS Replacement","Florida's Turnpike Enterprise / FDOT","Orange","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/tp/lettings/2026/aug11/e8x05.pdf?sfvrsn=db449c66_2","07a0f8662ebcb080"],["BDITraffic Signals / Electrical / Resurfacing","FDOT Contracts Administration","Orange","electrical","","https://ftp.fdot.gov/public/file/uw97b7jii0eaebofirc6da/T5894BSN.pdf","57d56c9992288403"],["Resurfacing/Electrical","Florida's Turnpike Enterprise / FDOT","Orange","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/tp/lettings/2026/sep30/e8x25.pdf?sfvrsn=1a92abfd_1","21b52e568fc41b03"]]],
  "orange/plumbing-hvac": [1,1,0,[["Rooftop HVAC Units Replacement","Florida's Turnpike Enterprise / FDOT","Orange","plumbing-hvac","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/tp/lettings/2026/oct20/e8x33.pdf?sfvrsn=d66837c2_1","b40fd16b1933f69a"]]],
  "orange/sitework-heavy-civil": [11,3,8,[["Briley Avenue Septic-To-Sewer","Town of Oakland","Orange","sitework-heavy-civil","2026-11-19","https://oaklandfl.gov/bids.aspx?bidID=35","3eea1b8d95c72baf"],["ITB 26-011 Laboratory Services for City Water & Wastewater Facilities","City of Ocoee","Orange","sitework-heavy-civil","","https://www.ocoee.org/1365/ITB-26-011-Laboratory-Services-for-City-","6982447f20c0141a"],["CONSTRUCTION SERVICES FOR TEACUP SPRINGS SEPTIC TO SEWER CONVERSION","City of Winter Garden","Orange","sitework-heavy-civil","","https://www.cwgdn.com/bids.aspx?bidID=41","a9d3fabba64e9aac"]]],
  "orange/commercial-general-contracting": [10,3,7,[["Construction Services, Fullers Reclaim Jockey Pump and Western Storage Potable Refill Pipe Upgrades","City of Winter Garden","Orange","commercial-general-contracting","","https://wgfl.gov/bids.aspx?bidID=40","27b846d252a7448e"],["ITN 2025-12DCSA Data-Driven Continuous Improvement and Technical Assistance Services for Community","University of Central Florida","Orange","commercial-general-contracting","","https://procurement.ucf.edu/wp-content/uploads/sites/3/2026/04/ITN-2025-12DCSA-Data-Driven-Continuous-Improvement_final.pdf","9915496bddc33265"],["Emergency Pre-Event Sign Repair & Replacement","Florida's Turnpike Enterprise / FDOT","Orange","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/tp/lettings/2026/mar10/z8167-r0.pdf?sfvrsn=1f62cf88_1","1d464a7bdfd31710"]]],
  "orange/landscaping": [1,1,0,[["Mowing & Landscape Service","Florida's Turnpike Enterprise / FDOT","Orange","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/tp/lettings/2026/dec08/e8x40-r0.pdf?sfvrsn=16e181f6_1","f2f442a428277c9e"]]],
  "palm-beach/roofing": [2,1,1,[["Town Hall Roof Replacement","City of South Palm Beach","Palm Beach","roofing","2026-11-30","https://www.southpalmbeach.com/bids.aspx?bidID=1","d628bda30e789524"]]],
  "palm-beach/electrical": [3,1,2,[["Law Enforcement Electric Bicycle (E-Bike) PM, Inspection and Repair Se | ITB 26-27-100MB Closing date","City of West Palm Beach","Palm Beach","electrical","","https://www.wpb.org/Departments/Procurement/Solicitations","0940da5f01cd8303"]]],
  "palm-beach/plumbing-hvac": [3,1,2,[["Request for Qualifications for HVAC Installation and Maintenance Services PBCHA-RFQ-2026-06","Palm Beach County Housing Authority","Palm Beach","plumbing-hvac","","https://www.pbchafl.org/current-bids-and-solicitations/","1ecd742032eb0a6d"]]],
  "palm-beach/sitework-heavy-civil": [10,3,7,[["Dredging Projects","Florida Inland Navigation District","Palm Beach","sitework-heavy-civil","","https://www.aicw.org/business/waterways_dredging_and_land_management/dredging_projects.php","3bdf4f9c19e7a4f0"],["Bid No. 27-003 Parks Court Resurfacing","City of Greenacres","Palm Beach","sitework-heavy-civil","","https://www.greenacresfl.gov/545/Solicitations","bb3292283e86deed"],["Ready Mix Concrete and Pump Mix Concrete, Furnish and Deliver, Term Co Reference number: ITB 26-27-104 MK Closing date December 03, 2026, 03:00 PM The City of West Palm Beach (the \"City\") is accepting a bid from qualified and responsible suppliers to furnish and deliver ready mix and pump mix concre","City of West Palm Beach","Palm Beach","sitework-heavy-civil","","https://www.wpb.org/Bids/ITB-26-27-104-MK","892d4c9d7265c8e5"]]],
  "palm-beach/commercial-general-contracting": [15,3,12,[["RFP 26.01 Paul Kintz Memorial Park Renovation Project No. KNZ 26.01","City of Atlantis","Palm Beach","commercial-general-contracting","","https://atlantisfl.gov/206/Bid-Proposal-Requests","5549246627a8655d"],["RFP 2025CM01 Construction Management Services","Health Care District of Palm Beach County","Palm Beach","commercial-general-contracting","","https://www.hcdpbc.org/resources/purchasing","ec34ab3ee7d79804"],["ITB #27-001-00155 \u2013 IT OFFICES REMODEL","Loxahatchee River Environmental Control District","Palm Beach","commercial-general-contracting","","https://loxahatcheeriver.org/governance/purchasing-bids/","9c4e8ac624982714"]]],
  "palm-beach/painting": [1,1,0,[["Request for Qualifications for Drywall and Painting Services","Palm Beach County Housing Authority","Palm Beach","painting","","https://www.pbchafl.org/current-bids-and-solicitations/","992877fd3991023e"]]],
  "pasco/roofing": [2,1,1,[["ITB26-017 RAC Flat Roof Replacement (PDF, 116KB)","City of New Port Richey","Pasco","roofing","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-017-recreation-and-aquatic-center-flat-roof-replacement-bids-received-signed.pdf","492c517e97c11907"]]],
  "pasco/electrical": [2,1,1,[["Resurfacing / Drainage / Electrical","FDOT Contracts Administration","Pasco","electrical","","https://ftp.fdot.gov/public/file/l-hwlpwv6emlbkwybpvjqw/T7607BSN.pdf","209c0f002c21cd89"]]],
  "pasco/sitework-heavy-civil": [9,3,6,[["2609-ST STREET PAVING 2026 PROJECT (Due: May 7,2026 by 2:00p.m.)","City of Dade City","Pasco","sitework-heavy-civil","","https://dadecityfl.gov/our_government/government_business/bids_quotes_auctions.php","24f5ce7a4c1edbce"],["ITB26-006 Clarifier #3 Rake and Plow Structure Refurbishment (PDF, 120KB)","City of New Port Richey","Pasco","sitework-heavy-civil","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-006-clarifier-3-rake-and-plow-structure-refurbishment-bids-received.pdf","0d400d98cc0e12be"],["2603-SW Pond Avenue Stormwater Pond Rejuvenation Project (Due: December 4, 2025 by 2:30p.m.)","City of Dade City","Pasco","sitework-heavy-civil","","https://dadecityfl.gov/our_government/government_business/bids_quotes_auctions.php","5882a45b5502a460"]]],
  "pasco/commercial-general-contracting": [6,3,3,[["2509-PL 7th STREET IMPROVEMENT PROJECT (Due: April 30,2026 by 2:30p.m.)","City of Dade City","Pasco","commercial-general-contracting","","https://dadecityfl.gov/our_government/government_business/bids_quotes_auctions.php","54510563a74c5d3d"],["ITB26-021 Sludge Thickener Rake & Plow Structure Refurbishment (PDF, 110KB)","City of New Port Richey","Pasco","commercial-general-contracting","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-021-sludge-thickener-rake-plow-structure-refurbishment-bids-received-signed.pdf","054d5e46f31d2a68"],["ITB26-022 2026 Water System Improvements (PDF, 132KB)","City of New Port Richey","Pasco","commercial-general-contracting","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-022-2026-water-system-improvements-bids-received.pdf","61f6264243b7cb63"]]],
  "pasco/landscaping": [3,1,2,[["ITB26-012 Landscape Maintenance Management - US Hwy 19, Center Medians (PDF, 113KB)","City of New Port Richey","Pasco","landscaping","","https://www.cityofnewportrichey.org/files/assets/city/v/1/city-clerk/documents/bids/recent-bid-tabulations/itb26-012-landscape-maintenance-management-us-hwy-19-center-medians-bids-received.pdf","0dd4596bf2a5c87d"]]],
  "pinellas/electrical": [5,2,3,[["On-Call Plumbing and Electrical Contractor Services - RFB","City of St. Pete Beach","Pinellas","electrical","2026-12-02","https://www.stpetebeach.org/bids.aspx?bidID=129","ca4c19a95e18d4ac"],["RFP 2026-LS-01 Holiday Lighting Installation Services (PDF)","City of Safety Harbor","Pinellas","electrical","","https://www.cityofsafetyharbor.com/607/Solicitations","4fde5521857587c5"]]],
  "pinellas/sitework-heavy-civil": [4,2,2,[["PASS-A-GRILLE-PASS, MAINTENANCE DREDGING, PINELLAS COUNTY, FLORIDA","W074 ENDIST JACKSNVLLE","Pinellas","sitework-heavy-civil","2026-11-20","https://sam.gov/opp/a0dd3e2704ae47b6bd49fcf88c711098/view","8991f101265c4edb"],["IFB 2026-PW-01 Safety Harbor Heights - Palmetto Dr. and Wooddell Dr. Water Main Replacement","City of Safety Harbor","Pinellas","sitework-heavy-civil","","https://www.cityofsafetyharbor.com/607/Solicitations","4d8e436fbe6f6158"]]],
  "pinellas/commercial-general-contracting": [1,1,0,[["Teen Center Parking Lot and ROW Improvements","City of Pinellas Park","Pinellas","commercial-general-contracting","","https://pinellaspark.gov/DocumentCenter/View/19772/ITB-27001-Teen-Center-Parking-and-Row-Improvements---draft","507eb38882073ba5"]]],
  "polk/roofing": [1,1,0,[["RFP #18-02 College-Wide Roof Repairs","Polk State College","Polk","roofing","","http://www.polk.edu/wp-content/uploads/RFP-18-02-College-Wide-Roof-Repairs-FINAL.pdf","c26b1dc489c73fb1"]]],
  "polk/electrical": [2,1,1,[["Invitation to Bid: Electrical Contractors (PDF)","City of Auburndale","Polk","electrical","","https://auburndalefl.com/rfps/","185d588517e37e47"]]],
  "polk/plumbing-hvac": [2,1,1,[["F1A11 DISTRICT 1 HQ HVAC IMPROVEMENTS","Florida Department of Transportation (FDOT)","Polk","plumbing-hvac","2026-11-24","https://vendor.myfloridamarketplace.com/search/bids/detail/17108","c38f70e62a82ad4a"]]],
  "polk/sitework-heavy-civil": [29,3,26,[["Bid 27-035 Crushed Concrete Material","Polk County","Polk","sitework-heavy-civil","2026-11-25","https://www.polkfl.gov/bid-form/bid-27-035/","3cd16e7100d4893f"],["Water & Wastewater Utilities Supplies, Parts & Equipment \u2013 Catalog Discount","City of Bartow","Polk","sitework-heavy-civil","2029-05-31","https://www.cityofbartow.net/bids.aspx?bidID=27","809c19634f48ed7c"],["RFP LHA-DEM-2026-01: Demolition, Site Clearing, Debris Removal and Site Restoration Services, Dakota Park","Lakeland Housing Authority","Polk","sitework-heavy-civil","","https://www.lakelandhousing.org/procurement/read/118fedb0-0ea4-405f-908e-b158982f02e9/","374bcce58a8f47a9"]]],
  "polk/commercial-general-contracting": [19,3,16,[["Bid 26-227 North Ridge Trail Phase 1","Polk County","Polk","commercial-general-contracting","2026-12-02","https://www.polkfl.gov/bid-form/bid-26-227/","79ce9c8ba30bd832"],["Fort Fraser Trail Over SR 60- Bike Path/Trail","FDOT District 1","Polk","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d1/lettings/2026/jan15/e1w96.pdf?sfvrsn=9baf0bb0_1","4142415b63c46239"],["Request for Qualifications: Public Works Offices & Facility Improvements","City of Auburndale","Polk","commercial-general-contracting","","https://auburndalefl.com/rfps/","4dd6199922fe862b"]]],
  "polk/painting": [1,1,0,[["CQ 26-442 Administration Building, Jury & Property Appraiser Parking Lots (Striping and Sealcoat)","Polk County","Polk","painting","2026-11-25","https://www.polkfl.gov/bid-form/cq-26-442/","ff1ad7a1dee92980"]]],
  "polk/landscaping": [10,3,7,[["2025 RFP ad - Mowing and Landscaping","City of Frostproof","Polk","landscaping","","https://cityoffrostproof.com/wp-content/uploads/2025/07/2025-RFP-ad-Mowing-and-Landscaping.pdf","6cad733cc48f3bff"],["BDIInstallation and Establishment of LandscapingExperience in Landscaping (Form 850-070-09) required.","FDOT District 1","Polk","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d1/lettings/2026/may21/e1y25.pdf?sfvrsn=44238f82_1","02bf2dc3951a13ef"],["BDIInstallation and Establishment of Landscaping","FDOT District 1","Polk","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d1/lettings/2026/feb19/e1y24.pdf?sfvrsn=2448c897_1","07014bb45af9639a"]]],
  "putnam/electrical": [1,1,0,[["Advertisement For Bids Cdbg 23 Nr Main Street Water Main Replacement & Lift Station Generator Cdbg Contract No. 23db-n13","City of Crescent City","Putnam","electrical","","https://crescentcity-fl.com/wp-content/uploads/2025/10/Adv._for_Bids_-_CDBG_Main_St._WM_Repl._-_Crescent_City.pdf","a5d71a3d043daf57"]]],
  "putnam/sitework-heavy-civil": [6,3,3,[["Guardrail Repairs 2027","Putnam County BOCC","Putnam","sitework-heavy-civil","","https://apps.putnam-fl.com/bocc/callForBidsViewer/","1525b550c7ebb9c8"],["Advertisement For Bids Cherry Street Sewer Extensions City Of Crescent City, Florida","City of Crescent City","Putnam","sitework-heavy-civil","","https://crescentcity-fl.com/wp-content/uploads/2025/10/Adv._for_Bids_-_Cherry_Street_Sewer_Exts._-_Crescent_City.pdf","73d5a8077443da60"],["Road Resurfacing 2026","Putnam County BOCC","Putnam","sitework-heavy-civil","","https://apps.putnam-fl.com/bocc/callForBidsViewer/","3a199f1c9f9b5d73"]]],
  "putnam/commercial-general-contracting": [4,2,2,[["Advertisement for Bids - Crescent City New Fire Station - No. 111026","City of Crescent City","Putnam","commercial-general-contracting","","https://crescentcity-fl.com/wp-content/uploads/2026/11/01-Bid-Advertisement-Invitation-Revised-09-Nov-26.pdf","1c80778adb64bcea"],["Lease of Volunteer Fire Station #19","Putnam County BOCC","Putnam","commercial-general-contracting","","https://apps.putnam-fl.com/bocc/callForBidsViewer/","07042d294395bece"]]],
  "st-johns/sitework-heavy-civil": [1,1,0,[["Oceanside Circle Roadway Resiliency/Floodwater Mitigation System","City of St. Augustine Beach","St. Johns","sitework-heavy-civil","2026-12-03","https://www.staugbch.com/bids.aspx?bidID=2","a7f293ac64231caa"]]],
  "st-lucie/electrical": [2,1,1,[["Electrical Contractor Services - ITB 23-22","St. Lucie Public Schools","St. Lucie","electrical","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L0VsZWN0cmljYWwgQ29udHJhY3RvciBTZXJ2aWNlcyAtIElUQiAyMy0yMg%3D%3D&m1dll_index_get=0","a2870efc1da01013"]]],
  "st-lucie/plumbing-hvac": [3,1,2,[["Plumbing Contractor Services - ITB 26-14","St. Lucie Public Schools","St. Lucie","plumbing-hvac","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L1BsdW1iaW5nIENvbnRyYWN0b3IgU2VydmljZXMgLSBJVEIgMjYtMTQ%3D&m1dll_index_get=0","110af9a7d745a5db"]]],
  "st-lucie/sitework-heavy-civil": [3,1,2,[["Concrete and Concrete Services - ITB 24-13","St. Lucie Public Schools","St. Lucie","sitework-heavy-civil","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L0NvbmNyZXRlIGFuZCBDb25jcmV0ZSBTZXJ2aWNlcyAtIElUQiAyNC0xMw%3D%3D&m1dll_index_get=0","8ed3aab785afa3a6"]]],
  "st-lucie/commercial-general-contracting": [7,3,4,[["General Contractor Services - RFP 25-14","St. Lucie Public Schools","St. Lucie","commercial-general-contracting","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L0dlbmVyYWwgQ29udHJhY3RvciBTZXJ2aWNlcyAtIFJGUCAyNS0xNA%3D%3D&m1dll_index_get=0","197ea2b2f5ac7b9c"],["Construction Management at Risk Services for C.A. Moore Gymnasium - RFQ 26-05","St. Lucie Public Schools","St. Lucie","commercial-general-contracting","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L0NvbnN0cnVjdGlvbiBNYW5hZ2VtZW50IGF0IFJpc2sgU2VydmljZXMgZm9yIEMuQS4gTW9vcmUgR3ltbmFzaXVtICAtIFJGUSAyNi0wNQ%3D%3D&m1dll_index_get=0","1f81fbbed8b12a27"],["General Contractor Services - RFP 23-10","St. Lucie Public Schools","St. Lucie","commercial-general-contracting","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L0dlbmVyYWwgQ29udHJhY3RvciBTZXJ2aWNlcyAtIFJGUCAyMy0xMA%3D%3D&m1dll_index_get=0","3aec9a2235a6d1b6"]]],
  "st-lucie/painting": [2,1,1,[["Painting Contractor Services - ITB 23-11","St. Lucie Public Schools","St. Lucie","painting","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L1BhaW50aW5nIENvbnRyYWN0b3IgU2VydmljZXMgLSBJVEIgMjMtMTE%3D&m1dll_index_get=0","117339edad939210"]]],
  "st-lucie/landscaping": [1,1,0,[["Mowing Services - ITB 26-10","St. Lucie Public Schools","St. Lucie","landscaping","","https://www.stlucie.k12.fl.us/purch/open-contracts/?d=L01vd2luZyBTZXJ2aWNlcyAtIElUQiAyNi0xMA%3D%3D&m1dll_index_get=0","99d461c8cd66e35b"]]],
  "santa-rosa/sitework-heavy-civil": [3,1,2,[["2026.15 Effluent Discharge System Downtown Plant Pump Station","City of Milton","Santa Rosa","sitework-heavy-civil","2026-12-17","https://www.miltonfl.org/bids.aspx?bidID=125","530d3baf087646bd"]]],
  "santa-rosa/commercial-general-contracting": [1,1,0,[["Request for Qualifications | RFQ 2-2025/2026 At-Risk Construction Management Services Training Center","Pensacola State College","Escambia/Santa Rosa","commercial-general-contracting","","https://pensacolastate.edu/purchasing/request-for-qualifications-rfq-2-2025-2026-at-risk-construction-management-services-training-center/","fe91d65171ca8d9d"]]],
  "seminole/electrical": [1,1,0,[["Traffic Signal / Drainage / Resurfacing / Grading / Electrical","FDOT Contracts Administration","Seminole","electrical","","https://ftp.fdot.gov/public/file/3j3cnbxrpuqk9u7cfcp_oq/T5863BSN.pdf","7ee571711ac02ccb"]]],
  "seminole/plumbing-hvac": [1,1,0,[["2025-016-ITB-CB - Invitation to Bid - HVAC Chiller and Water Circulating Pumps Preventative Maintenance, Repairs, and Inspections services","Sanford Airport Authority","Seminole","plumbing-hvac","","https://flysfb.com/business/procurement/solicitations/","cae2f816f089f94a"]]],
  "seminole/commercial-general-contracting": [2,1,1,[["2025-007-ITB-CB - Invitation to Bid - Airport Remote Parking Lot Construction","Sanford Airport Authority","Seminole","commercial-general-contracting","","https://flysfb.com/business/procurement/solicitations/","79968d35819b31c0"]]],
  "seminole/landscaping": [1,1,0,[["2025-003-ITB-CB - Invitation to Bid - Grounds Maintenance Services","Sanford Airport Authority","Seminole","landscaping","","https://flysfb.com/business/procurement/solicitations/","a4e2063f170a242b"]]],
  "taylor/sitework-heavy-civil": [3,1,2,[["USACE Floodplain Mitigation Drainage Project","Taylor County","Taylor","sitework-heavy-civil","","https://www.taylorcountygov.com/bid_detail_T25_R183.php","5e35dac576cc5b89"]]],
  "taylor/commercial-general-contracting": [1,1,0,[["Hodges Park Rehabilitation at Keaton Beach","Taylor County","Taylor","commercial-general-contracting","","https://www.taylorcountygov.com/bid_detail_T25_R195.php","1f02cabb2fc4daf3"]]],
  "volusia/roofing": [2,1,1,[["Seabreeze High - Reroof Bldg. 7 - Project No. 2648242","Volusia County Schools","Volusia","roofing","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","9bd505079cd33244"]]],
  "volusia/electrical": [10,3,7,[["New Smyrna Beach High - Baseball and Softball Field Lighting - Project No. 2648276","Volusia County Schools","Volusia","electrical","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","152ec65e1a6c3a49"],["Transportation Maintenance Deltona - Replace Emergency Generator and MDP - Project No. 2648209","Volusia County Schools","Volusia","electrical","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","2d17e842aba89a40"],["Friendship Elementary - Replace Switchgear Bldg. 4 - Project No. 2648215","Volusia County Schools","Volusia","electrical","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","4e84df715071f903"]]],
  "volusia/plumbing-hvac": [4,2,2,[["Spruce Creek Elementary - Replace 60 Ton Chiller - Project No. 2648251","Volusia County Schools","Volusia","plumbing-hvac","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","35c9cb2f0bbe261b"],["Horizon Elementary - Replace Chiller Bldg. 11 - Project No. 2648221","Volusia County Schools","Volusia","plumbing-hvac","","https://www.vcsedu.org/directory/departments/operation-services/facilities-services/design-construction/bid-documents","79b556ffdb96c9c9"]]],
  "volusia/commercial-general-contracting": [3,1,2,[["RFQ 2026-02 - Town Of Ponce Inlet Collection System Improvements Phase 1, SRF #WW 64141","Town of Ponce Inlet","Volusia","commercial-general-contracting","2026-11-19","https://www.ponce-inlet.org/bids.aspx?bidID=36","9cc1f4cdaf9fc582"]]],
  "wakulla/sitework-heavy-civil": [2,1,1,[["ITB 2026-20 REBID Lower Bridge Floating Dock Improvements","Wakulla County","Wakulla","sitework-heavy-civil","","https://www.mywakulla.com/bids_and_procurements/2026_bids_and_procurements.php","551c32ac7a0e9364"]]],
  "wakulla/commercial-general-contracting": [1,1,0,[["The City of Sopchoppy is issuing this bid notice for construction services","City of Sopchoppy","Wakulla","commercial-general-contracting","","https://www.sopchoppy.org/","02b481c90c9fba1a"]]],
  "walton/roofing": [1,1,0,[["Invitation to Bid, Community Center Roof Replacement","City of DeFuniak Springs","Walton","roofing","","https://www.defuniaksprings.net/1230/Bids-RFPs","427f057d476ae4d1"]]],
  "washington/electrical": [3,1,2,[["Districtwide Pre-Event Generator and Signal RepairFHWA 1273 and Davis Bacon Wage Rates are applicable for this Contract.","FDOT District 3","Washington","electrical","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/nov13/z3045-r0.pdf?sfvrsn=5341ebab_1","0f2b55626db30967"]]],
  "washington/sitework-heavy-civil": [18,3,15,[["Bridge Repair/RehabilitationPrequalification is required to bid on this project.","FDOT District 3","Washington","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/mar12/e3y50.pdf?sfvrsn=4ed01b70_1","226886cdcd37b7d3"],["Remove Replace ConcreteThis contract has a Budgetary Estimate of $150,000.","FDOT District 3","Washington","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/oct8/e3z83-r0a748fd34-cdfe-45cf-a481-806a4c3435dc.pdf?sfvrsn=61a29ead_1","25ec393e9bc12962"],["Concrete RepairThis contract has a budgetary estimate of $350,000.","FDOT District 3","Washington","sitework-heavy-civil","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/jan08/e3z26-r0.pdf?sfvrsn=8ae2792_1","28804f3de0b74a6c"]]],
  "washington/commercial-general-contracting": [7,3,4,[["Signalization RepairPrequalification is required to bid on this project.","FDOT District 3","Washington","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/dec10/e3z70.pdf?sfvrsn=8eabcf60_1","75fb8fcbf370c86d"],["East & West Bound Rest Area ImprovementsA Builders License or General Contractors License is required for this project.","FDOT District 3","Washington","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/jun11/e3z24.pdf?sfvrsn=bbeaa8dd_1","0abb29ca85736a53"],["Fence Replacement","FDOT District 3","Washington","commercial-general-contracting","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/sep10/e3z76.pdf?sfvrsn=181e282b_1","10410e8568c4ca13"]]],
  "washington/landscaping": [8,3,5,[["LandscapingContractor Experience Form (850-070-09), Experience in Landscaping, is required to be submitted with bid.","FDOT District 3","Washington","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/may14/e3z13.pdf?sfvrsn=84cf07ea_1","1a4f13e3bd0f6ace"],["LandscapingContractor Experience in Landscaping (Form 850-070-09)is required to be submitted with your bid.","FDOT District 3","Washington","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/sep10/e3z43.pdf?sfvrsn=6efe818a_1","2b3ad3746b2b2945"],["LandscapeLandscape form 850-070-09 is required to be submitted with bid.","FDOT District 3","Washington","landscaping","","https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/contracts/d3/lettings/2026/aug13/e3y86.pdf?sfvrsn=2f2359b5_1","2fa5082089334a36"]]],
};
// END PUBLIC_PAGES
