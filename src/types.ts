export interface Center {
  id: string;
  name: string;
  city: string;
  address: string;
  amenities: string[];
  capacity: {
    hotDesks: number;
    dedicatedDesks: number;
    privateOffices: number;
    meetingRooms: number;
  };
  occupancy: {
    hotDesks: number; // current count of occupied hot desks
    dedicatedDesks: number; // occupied dedicated desks
    privateOffices: number; // occupied private offices
  };
  tier: "Premium" | "Standard" | "Budget";
  squareFt: number;
  monthlyRentalCost: number; // operational rent cost
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  centerInterest: string; // Center ID
  source: "Website" | "Walk-in" | "Broker" | "Referral" | "Google Ads" | "Social Media";
  status: "New" | "Contacted" | "Tour Scheduled" | "Tour Completed" | "Proposal Sent" | "Negotiating" | "Won" | "Lost";
  requirementType: "Hot Desk" | "Dedicated Desk" | "Private Office" | "Enterprise Suite";
  size: number; // Pax
  value: number; // Estimated value/month
  notes: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  centerId: string;
  membershipType: "Hot Desk" | "Dedicated Desk" | "Private Office (Small)" | "Private Office (Large)" | "Enterprise Suite";
  status: "Active" | "Pending Onboarding" | "Overdue Billing" | "Exiting" | "Inactive";
  monthlyRent: number;
  billingCycle: "Monthly" | "Quarterly" | "Annually";
  startDate: string;
  endDate: string;
  allocatedDesks: string[]; // e.g. ["HD-4", "O-12"]
}

export interface Booking {
  id: string;
  centerId: string;
  spaceName: string;
  spaceType: "Meeting Room" | "Phone Booth" | "Event Hall" | "Podcast Studio";
  bookerName: string;
  bookerCompany: string;
  memberId?: string; // empty if guest booking
  date: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  cost: number;
  status: "Confirmed" | "Completed" | "Cancelled";
}

export interface Visitor {
  id: string;
  centerId: string;
  name: string;
  email: string;
  phone: string;
  hostName: string;
  hostCompany: string;
  purpose: "Meeting" | "Interview" | "Tour" | "Delivery" | "Trial Day";
  checkInTime: string; // Date ISO string or time string
  checkOutTime?: string;
  status: "Checked In" | "Checked Out" | "Expected";
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  companyName: string;
  centerId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  items: {
    description: string;
    amount: number;
  }[];
}

export interface Expense {
  id: string;
  centerId: string;
  category: "Rent" | "Utilities" | "Internet" | "Salaries" | "Marketing" | "Maintenance" | "Supplies" | "Snacks / Pantry";
  description: string;
  amount: number;
  date: string;
  status: "Draft" | "Approved" | "Paid";
}
