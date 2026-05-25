import { Center, Lead, Member, Booking, Visitor, Invoice, Expense } from "./types";

export const INITIAL_CENTERS: Center[] = [
  {
    id: "blr-koramangala",
    name: "Koramangala Tech Hub",
    city: "Bangalore",
    address: "80 Feet Rd, 4th Block, Koramangala, Bangalore, KA 560034",
    amenities: ["1000 Mbps Fiber", "24/7 Cafeteria", "Podcast Studio", "Makerspace", "Gaming Zone", "Phone Booths"],
    capacity: { hotDesks: 80, dedicatedDesks: 40, privateOffices: 15, meetingRooms: 6 },
    occupancy: { hotDesks: 54, dedicatedDesks: 32, privateOffices: 12 },
    tier: "Standard",
    squareFt: 12000,
    monthlyRentalCost: 8500 // Operator lease out expense
  },
  {
    id: "sfo-soma",
    name: "SoMa Innovation Center",
    city: "San Francisco",
    address: "450 Townsend St, San Francisco, CA 94107",
    amenities: ["Ultra-speed Mesh", "Roof Deck Cafe", "Event Amphitheater", "Wellness Room", "Dog Friendly", "Private Phone Pods"],
    capacity: { hotDesks: 60, dedicatedDesks: 30, privateOffices: 10, meetingRooms: 4 },
    occupancy: { hotDesks: 42, dedicatedDesks: 28, privateOffices: 9 },
    tier: "Premium",
    squareFt: 9500,
    monthlyRentalCost: 18000
  },
  {
    id: "nyc-chelsea",
    name: "Chelsea Creative Lofts",
    city: "New York",
    address: "120 W 24th St, New York, NY 10011",
    amenities: ["Symmetrical Fiber", "Editorial Lounge", "Barista Station", "Production Studio", "Art Gallery Space"],
    capacity: { hotDesks: 50, dedicatedDesks: 25, privateOffices: 8, meetingRooms: 3 },
    occupancy: { hotDesks: 18, dedicatedDesks: 12, privateOffices: 7 },
    tier: "Premium",
    squareFt: 8000,
    monthlyRentalCost: 15500
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Neha Sharma",
    company: "Zeta Insights",
    email: "neha@zetainsights.co",
    phone: "+91 98450 12110",
    centerInterest: "blr-koramangala",
    source: "Website",
    status: "New",
    requirementType: "Private Office",
    size: 6,
    value: 1200,
    notes: "Requires an enclosed office with internal whiteboard walls before end of this month.",
    createdAt: "2026-05-20T10:30:00Z"
  },
  {
    id: "lead-2",
    name: "Jameson Blake",
    company: "Apex Ledger",
    email: "j.blake@apexledger.ms",
    phone: "+1 415 555 0192",
    centerInterest: "sfo-soma",
    source: "Google Ads",
    status: "Tour Scheduled",
    requirementType: "Dedicated Desk",
    size: 3,
    value: 1650,
    notes: "Scheduled tour on Wednesday 2:00 PM. High intent. Looking for a quiet space.",
    createdAt: "2026-05-22T14:15:00Z"
  },
  {
    id: "lead-3",
    name: "Clara Dupont",
    company: "L'Atelier Softwares",
    email: "c.dupont@latelier.io",
    phone: "+1 212 555 0341",
    centerInterest: "nyc-chelsea",
    source: "Broker",
    status: "Negotiating",
    requirementType: "Private Office",
    size: 12,
    value: 6500,
    notes: "Broker offered 10% discount on 12-month commitment. Competing with WeWork.",
    createdAt: "2026-05-18T09:00:00Z"
  },
  {
    id: "lead-4",
    name: "Rohit Krishnan",
    company: "GrowFast Commerce",
    email: "rohit@growfast.co.in",
    phone: "+91 99000 88776",
    centerInterest: "blr-koramangala",
    source: "Referral",
    status: "Proposal Sent",
    requirementType: "Hot Desk",
    size: 5,
    value: 450,
    notes: "Sent standard rate card with referral credits applied. Waiting on response.",
    createdAt: "2026-05-19T11:45:00Z"
  },
  {
    id: "lead-5",
    name: "Sarah Jenkins",
    company: "Lumina Digital",
    email: "s.jenkins@luminadigital.agency",
    phone: "+1 917 555 1255",
    centerInterest: "nyc-chelsea",
    source: "Walk-in",
    status: "Contacted",
    requirementType: "Hot Desk",
    size: 1,
    value: 350,
    notes: "Visited Chelsea, wants flexible hotdesking subscription with standard amenities.",
    createdAt: "2026-05-24T15:30:00Z"
  },
  {
    id: "lead-6",
    name: "Amit Patel",
    company: "DigiVentures",
    email: "amit@digiventures.in",
    phone: "+91 88812 34567",
    centerInterest: "blr-koramangala",
    source: "Social Media",
    status: "Won",
    requirementType: "Private Office",
    size: 4,
    value: 950,
    notes: "Closed deal on 6-month lock-in. Move in checklist dispatched.",
    createdAt: "2026-05-15T16:00:00Z"
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "member-1",
    name: "Vikram Sen",
    company: "Aditya Capital Partners",
    email: "v.sen@adityacap.com",
    phone: "+91 94440 22110",
    centerId: "blr-koramangala",
    membershipType: "Private Office (Small)",
    status: "Active",
    monthlyRent: 950,
    billingCycle: "Monthly",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    allocatedDesks: ["O-11", "O-12"]
  },
  {
    id: "member-2",
    name: "Marissa Mayer",
    company: "Alpha Labs Inc",
    email: "marissa@alphalabs.io",
    phone: "+1 415 555 8899",
    centerId: "sfo-soma",
    membershipType: "Enterprise Suite",
    status: "Active",
    monthlyRent: 8500,
    billingCycle: "Quarterly",
    startDate: "2025-06-01",
    endDate: "2026-08-31",
    allocatedDesks: ["S-1", "S-2", "S-3", "S-4"]
  },
  {
    id: "member-3",
    name: "David Kaplan",
    company: "Metropolitan PR Group",
    email: "kaplan@metropol-pr.com",
    phone: "+1 212 555 0101",
    centerId: "nyc-chelsea",
    membershipType: "Private Office (Large)",
    status: "Active",
    monthlyRent: 5800,
    billingCycle: "Monthly",
    startDate: "2025-11-01",
    endDate: "2026-10-31",
    allocatedDesks: ["PO-7"]
  },
  {
    id: "member-4",
    name: "Karthik Raja",
    company: "Karthik & Devs LLC",
    email: "karthik.r@raja.agency",
    phone: "+91 91100 44550",
    centerId: "blr-koramangala",
    membershipType: "Dedicated Desk",
    status: "Active",
    monthlyRent: 220,
    billingCycle: "Monthly",
    startDate: "2026-02-01",
    endDate: "2026-08-01",
    allocatedDesks: ["DK-14"]
  },
  {
    id: "member-5",
    name: "Elena Rostova",
    company: "Volga Global Ltd",
    email: "e.rostova@volgaglobal.ru",
    phone: "+1 212 555 7711",
    centerId: "nyc-chelsea",
    membershipType: "Hot Desk",
    status: "Overdue Billing",
    monthlyRent: 350,
    billingCycle: "Monthly",
    startDate: "2026-03-01",
    endDate: "2026-06-01",
    allocatedDesks: ["HD-FL1"]
  },
  {
    id: "member-6",
    name: "Aidan O'Connor",
    company: "Eire Interactive",
    email: "aidan@eireinteractive.com",
    phone: "+1 415 555 2200",
    centerId: "sfo-soma",
    membershipType: "Dedicated Desk",
    status: "Pending Onboarding",
    monthlyRent: 550,
    billingCycle: "Monthly",
    startDate: "2026-06-01",
    endDate: "2026-12-01",
    allocatedDesks: ["DK-01", "DK-02"]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    centerId: "blr-koramangala",
    spaceName: "Boardroom Alpha",
    spaceType: "Meeting Room",
    bookerName: "Vikram Sen",
    bookerCompany: "Aditya Capital Partners",
    memberId: "member-1",
    date: "2026-05-25",
    startTime: "10:00",
    endTime: "11:30",
    cost: 45,
    status: "Confirmed"
  },
  {
    id: "book-2",
    centerId: "sfo-soma",
    spaceName: "Horizon Arena",
    spaceType: "Event Hall",
    bookerName: "Marissa Mayer",
    bookerCompany: "Alpha Labs Inc",
    memberId: "member-2",
    date: "2026-05-26",
    startTime: "16:00",
    endTime: "19:00",
    cost: 350,
    status: "Confirmed"
  },
  {
    id: "book-3",
    centerId: "nyc-chelsea",
    spaceName: "Focus Studio 2",
    spaceType: "Phone Booth",
    bookerName: "David Kaplan",
    bookerCompany: "Metropolitan PR Group",
    memberId: "member-3",
    date: "2026-05-25",
    startTime: "13:00",
    endTime: "14:00",
    cost: 15,
    status: "Completed"
  },
  {
    id: "book-4",
    centerId: "blr-koramangala",
    spaceName: "Podcast Studio Base",
    spaceType: "Podcast Studio",
    bookerName: "Rohan D'Souza",
    bookerCompany: "The Daily Decrypt",
    date: "2026-05-25",
    startTime: "15:00",
    endTime: "17:00",
    cost: 80,
    status: "Confirmed"
  }
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: "visitor-1",
    centerId: "blr-koramangala",
    name: "Ramesh Kumar",
    email: "ramesh.k@redcliff.in",
    phone: "+91 97711 55660",
    hostName: "Vikram Sen",
    hostCompany: "Aditya Capital Partners",
    purpose: "Meeting",
    checkInTime: "16:02",
    status: "Checked In"
  },
  {
    id: "visitor-2",
    centerId: "sfo-soma",
    name: "Juliana Santos",
    email: "juliana@ycombinator.com",
    phone: "+1 650 555 4410",
    hostName: "Marissa Mayer",
    hostCompany: "Alpha Labs Inc",
    purpose: "Tour",
    checkInTime: "11:30",
    checkOutTime: "12:15",
    status: "Checked Out"
  },
  {
    id: "visitor-3",
    centerId: "nyc-chelsea",
    name: "Marcus Vance",
    email: "marcus.v@nycartservices.com",
    phone: "+1 201 555 9931",
    hostName: "David Kaplan",
    hostCompany: "Metropolitan PR Group",
    purpose: "Delivery",
    checkInTime: "15:45",
    status: "Checked In"
  },
  {
    id: "visitor-4",
    centerId: "sfo-soma",
    name: "Theodore Miller",
    email: "theo.m@gmail.com",
    phone: "+1 415 555 1290",
    hostName: "Front Desk Staff",
    hostCompany: "Hot Desk Guest",
    purpose: "Trial Day",
    checkInTime: "09:15",
    status: "Checked In"
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-2001",
    memberId: "member-1",
    memberName: "Vikram Sen",
    companyName: "Aditya Capital Partners",
    centerId: "blr-koramangala",
    issueDate: "2026-05-01",
    dueDate: "2026-05-10",
    subtotal: 950,
    tax: 171,
    discount: 0,
    total: 1121,
    status: "Paid",
    items: [
      { description: "Monthly Membership - Private Office Space (May 2026)", amount: 950 }
    ]
  },
  {
    id: "inv-2002",
    memberId: "member-2",
    memberName: "Marissa Mayer",
    companyName: "Alpha Labs Inc",
    centerId: "sfo-soma",
    issueDate: "2026-04-01",
    dueDate: "2026-04-15",
    subtotal: 8500,
    tax: 722,
    discount: 500,
    total: 8722,
    status: "Paid",
    items: [
      { description: "Quarterly Enterprise Suite (Q2 2026 Bundle)", amount: 8500 }
    ]
  },
  {
    id: "inv-2003",
    memberId: "member-4",
    memberName: "Karthik Raja",
    companyName: "Karthik & Devs LLC",
    centerId: "blr-koramangala",
    issueDate: "2026-05-01",
    dueDate: "2026-05-10",
    subtotal: 220,
    tax: 39.6,
    discount: 0,
    total: 259.6,
    status: "Paid",
    items: [
      { description: "Monthly Dedicated Desk #DK-14 (May 2026)", amount: 220 }
    ]
  },
  {
    id: "inv-2004",
    memberId: "member-5",
    memberName: "Elena Rostova",
    companyName: "Volga Global Ltd",
    centerId: "nyc-chelsea",
    issueDate: "2026-05-01",
    dueDate: "2026-05-10",
    subtotal: 350,
    tax: 31.5,
    discount: 0,
    total: 381.5,
    status: "Overdue",
    items: [
      { description: "Monthly Flexible Hot Desk (May 2026)", amount: 350 }
    ]
  },
  {
    id: "inv-2005",
    memberId: "member-3",
    memberName: "David Kaplan",
    companyName: "Metropolitan PR Group",
    centerId: "nyc-chelsea",
    issueDate: "2026-05-01",
    dueDate: "2026-05-10",
    subtotal: 5800,
    tax: 522,
    discount: 200,
    total: 6122,
    status: "Draft",
    items: [
      { description: "Monthly Rent - Private PO-7 Suite (June 2026 Advance)", amount: 5800 }
    ]
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: "exp-1", centerId: "blr-koramangala", category: "Rent", description: "Base lease payment to building owner", amount: 8500, date: "2026-05-01", status: "Paid" },
  { id: "exp-2", centerId: "blr-koramangala", category: "Utilities", description: "Electricity & Central Water bill", amount: 1200, date: "2026-05-08", status: "Paid" },
  { id: "exp-3", centerId: "blr-koramangala", category: "Snacks / Pantry", description: "Coffee beans, tea, milk and pantry restocking", amount: 450, date: "2026-05-15", status: "Approved" },
  { id: "exp-4", centerId: "sfo-soma", category: "Rent", description: "Townsend Real Estate base commercial lease", amount: 18000, date: "2026-05-01", status: "Paid" },
  { id: "exp-5", centerId: "sfo-soma", category: "Marketing", description: "LinkedIn and Google Local Ads for space occupancy", amount: 2500, date: "2026-05-10", status: "Paid" },
  { id: "exp-6", centerId: "sfo-soma", category: "Internet", description: "Symmetrical gigabit active backup circuit", amount: 600, date: "2026-05-03", status: "Paid" },
  { id: "exp-7", centerId: "nyc-chelsea", category: "Rent", description: "120 W 24 Loft lease payment", amount: 15500, date: "2026-05-01", status: "Paid" },
  { id: "exp-8", centerId: "nyc-chelsea", category: "Utilities", description: "Consolidated Edison utility tariff", amount: 1450, date: "2026-05-12", status: "Draft" },
  { id: "exp-9", centerId: "nyc-chelsea", category: "Maintenance", description: "HVAC cooling loop emergency service", amount: 1800, date: "2026-05-20", status: "Approved" }
];
