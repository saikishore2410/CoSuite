import React, { useState, useEffect } from "react";
import { Center, Lead, Member, Booking, Visitor, Invoice, Expense } from "./types";
import {
  INITIAL_CENTERS,
  INITIAL_LEADS,
  INITIAL_MEMBERS,
  INITIAL_BOOKINGS,
  INITIAL_VISITORS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
} from "./data";
import CenterManagement from "./components/CenterManagement";
import LeadCRM from "./components/LeadCRM";
import MemberManagement from "./components/MemberManagement";
import SpaceBookings from "./components/SpaceBookings";
import VisitorLogs from "./components/VisitorLogs";
import FinanceERP from "./components/FinanceERP";
import AiOperations from "./components/AiOperations";
import {
  Building2,
  UserCheck,
  Users,
  Calendar,
  Smile,
  Landmark,
  Brain,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

type ViewType = "portfolio" | "crm" | "members" | "bookings" | "visitors" | "finance" | "ai";

export default function App() {
  // Global ERP & CRM Databases State
  const [centers, setCenters] = useState<Center[]>(INITIAL_CENTERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  // Active navigation view state
  const [activeView, setActiveView] = useState<ViewType>("portfolio");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  // Auto-select the first center on render
  useEffect(() => {
    if (centers.length > 0 && !selectedCenter) {
      setSelectedCenter(centers[0]);
    }
  }, [centers, selectedCenter]);

  // Recalculate Occupancy rates when members list changes
  useEffect(() => {
    const updatedCenters = centers.map((center) => {
      const branchMembers = members.filter(
        (m) => m.centerId === center.id && (m.status === "Active" || m.status === "Exiting")
      );

      // Distribute count by membership type
      const hotDesksOcc = branchMembers.filter((m) => m.membershipType === "Hot Desk").length;
      const dedicatedDesksOcc = branchMembers.filter((m) => m.membershipType === "Dedicated Desk").length;
      const privateOfficesOcc = branchMembers.filter(
        (m) => m.membershipType.startsWith("Private") || m.membershipType === "Enterprise Suite"
      ).length;

      return {
        ...center,
        occupancy: {
          hotDesks: Math.min(hotDesksOcc, center.capacity.hotDesks),
          dedicatedDesks: Math.min(dedicatedDesksOcc, center.capacity.dedicatedDesks),
          privateOffices: Math.min(privateOfficesOcc, center.capacity.privateOffices),
        },
      };
    });

    // Simple comparison to prevent infinite loop
    const hasChanged = JSON.stringify(updatedCenters) !== JSON.stringify(centers);
    if (hasChanged) {
      setCenters(updatedCenters);
      // keep selectedCenter sync'd
      if (selectedCenter) {
        const matching = updatedCenters.find((c) => c.id === selectedCenter.id);
        if (matching) setSelectedCenter(matching);
      }
    }
  }, [members, centers, selectedCenter]);

  // --- Handlers & Mutators ---

  const handleAddCenter = (newCenter: Center) => {
    setCenters((prev) => [...prev, newCenter]);
    setSelectedCenter(newCenter);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  // ERP CRM Handshake Conversion
  const handleConvertToMember = (lead: Lead) => {
    // 1. Shift Lead Status to Won
    handleUpdateLeadStatus(lead.id, "Won");

    // 2. Create corresponding member lease profile
    const now = new Date();
    const expiry = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000); // 6-month contract

    const convertedMember: Member = {
      id: `member-conv-${Date.now()}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      centerId: lead.centerInterest,
      membershipType: lead.requirementType as any,
      status: "Active",
      monthlyRent: lead.value,
      billingCycle: "Monthly",
      startDate: now.toISOString().slice(0, 10),
      endDate: expiry.toISOString().slice(0, 10),
      allocatedDesks: [lead.requirementType === "Hot Desk" ? "HD-FL" : `DK-CONV-${Math.floor(Math.random() * 90) + 10}`],
    };

    setMembers((prev) => [convertedMember, ...prev]);
    setActiveView("members"); // Route operator directly to members database
  };

  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleUpdateMemberStatus = (memberId: string, newStatus: Member["status"]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" as const } : b))
    );
  };

  const handleCheckInVisitor = (newVisitor: Visitor) => {
    setVisitors((prev) => [newVisitor, ...prev]);
  };

  const handleCheckOutVisitor = (visitorId: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitorId
          ? { ...v, status: "Checked Out" as const, checkOutTime: new Date().toTimeString().slice(0, 5) }
          : v
      )
    );
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: Invoice["status"]) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    );
  };

  // --- High-Level Global Business KPIs ---

  const totalPossibleHotDesks = centers.reduce((sum, c) => sum + c.capacity.hotDesks, 0);
  const totalOccupiedHotDesks = centers.reduce((sum, c) => sum + c.occupancy.hotDesks, 0);
  const globalCapacityPercent = Math.round((totalOccupiedHotDesks / totalPossibleHotDesks) * 100) || 0;

  const totalOutstandingIncome = invoices
    .filter((inv) => inv.status === "Sent" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  const activeLeadsCount = leads.filter((l) => l.status !== "Won" && l.status !== "Lost").length;
  const lobbyGuestCount = visitors.filter((v) => v.status === "Checked In").length;

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans" id="cosuite-master-container">
      {/* Top Professional Command Bar */}
      <header className="bg-zinc-950 text-zinc-100 border-b border-zinc-900 sticky top-0 z-40 shadow-xs px-4 md:px-6 py-4">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 bg-indigo-600 text-white rounded font-display font-black tracking-wide text-sm">CO</span>
              <h1 className="text-lg md:text-xl font-display font-bold tracking-tight text-white">CoSuite</h1>
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">MULTI-CENTER ERP v4.1</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-sans">Unified Coworking CRM Prospect Pipelines & Facility Administration Ledger Panel.</p>
          </div>

          {/* Quick summary stats in header */}
          <div className="flex items-center gap-4 text-left font-mono">
            <div className="border-l border-zinc-800 pl-4">
              <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold font-sans">Global HotDesk Occ</div>
              <div className="text-sm font-extrabold text-indigo-400">{globalCapacityPercent}%</div>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold font-sans">Receivables Out</div>
              <div className="text-sm font-extrabold text-rose-400">${totalOutstandingIncome.toLocaleString()}</div>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold font-sans">Active Pipeline</div>
              <div className="text-sm font-extrabold text-emerald-400">{activeLeadsCount} Leads</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Core Operational Tabs Router */}
        <div className="flex flex-wrap items-center gap-1 bg-white border border-zinc-100 p-1 rounded-xl shadow-xs self-start overflow-x-auto">
          <button
            id="nav-tab-portfolio"
            onClick={() => setActiveView("portfolio")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "portfolio"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Branch portfolio
          </button>

          <button
            id="nav-tab-crm"
            onClick={() => setActiveView("crm")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "crm"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            CRM Lead Funnel
          </button>

          <button
            id="nav-tab-members"
            onClick={() => setActiveView("members")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "members"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Members Registry
          </button>

          <button
            id="nav-tab-bookings"
            onClick={() => setActiveView("bookings")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "bookings"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Room Bookings
          </button>

          <button
            id="nav-tab-visitors"
            onClick={() => setActiveView("visitors")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "visitors"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Smile className="w-4 h-4" />
            Lobby Desk
            {lobbyGuestCount > 0 && (
              <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            )}
          </button>

          <button
            id="nav-tab-finance"
            onClick={() => setActiveView("finance")}
            className={`px-3 py-1.8 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "finance"
                ? "bg-zinc-900 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Landmark className="w-4 h-4" />
            Finance Ledger
          </button>

          <button
            id="nav-tab-ai"
            onClick={() => setActiveView("ai")}
            className={`px-3 py-1.8 text-xs font-bold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === "ai"
                ? "bg-gradient-to-r from-indigo-700 to-indigo-600 text-white shadow-xs"
                : "text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-900"
            }`}
          >
            <Brain className="w-4 h-4" />
            CoSuite Advisor AI
          </button>
        </div>

        {/* Dynamic Mounted Page Views */}
        <div className="min-h-[500px]" id="cosuite-workspace-viewport">
          {activeView === "portfolio" && (
            <CenterManagement
              centers={centers}
              onAddCenter={handleAddCenter}
              selectedCenter={selectedCenter}
              onSelectCenter={setSelectedCenter}
            />
          )}

          {activeView === "crm" && (
            <LeadCRM
              leads={leads}
              onAddLead={handleAddLead}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onDeleteLead={handleDeleteLead}
              onConvertToMember={handleConvertToMember}
              centers={centers}
            />
          )}

          {activeView === "members" && (
            <MemberManagement
              members={members}
              onAddMember={handleAddMember}
              onUpdateMemberStatus={handleUpdateMemberStatus}
              centers={centers}
            />
          )}

          {activeView === "bookings" && (
            <SpaceBookings
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onCancelBooking={handleCancelBooking}
              centers={centers}
            />
          )}

          {activeView === "visitors" && (
            <VisitorLogs
              visitors={visitors}
              members={members}
              onCheckInVisitor={handleCheckInVisitor}
              onCheckOutVisitor={handleCheckOutVisitor}
              centers={centers}
            />
          )}

          {activeView === "finance" && (
            <FinanceERP
              invoices={invoices}
              expenses={expenses}
              members={members}
              centers={centers}
              onAddInvoice={handleAddInvoice}
              onAddExpense={handleAddExpense}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

          {activeView === "ai" && (
            <AiOperations
              centers={centers}
              leads={leads}
              members={members}
              invoices={invoices}
              expenses={expenses}
            />
          )}
        </div>
      </main>

      {/* Footer System Credits */}
      <footer className="mt-12 bg-zinc-100 border-t border-zinc-200/80 p-5 mt-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <div className="text-center md:text-left">
            <p className="font-semibold text-zinc-800">CoSuite Multi-Center Operations Manager</p>
            <p className="font-medium text-zinc-500 mt-0.5">Designed specifically for coworking space directors and real estate asset groups.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-zinc-400 font-medium">
            <span>Client State Isolated</span>
            <span>•</span>
            <span>Gemini Intel Integration Verified</span>
            <span>•</span>
            <span>Secure Enterprise Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
