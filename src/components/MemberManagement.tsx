import React, { useState } from "react";
import { Member, Center } from "../types";
import { Users, Search, CreditCard, Calendar, CheckSquare, Plus, Ban, Eye, FileSpreadsheet } from "lucide-react";

interface MemberManagementProps {
  members: Member[];
  onAddMember: (newMember: Member) => void;
  onUpdateMemberStatus: (memberId: string, newStatus: Member["status"]) => void;
  centers: Center[];
}

export default function MemberManagement({
  members,
  onAddMember,
  onUpdateMemberStatus,
  centers,
}: MemberManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [centerFilter, setCenterFilter] = useState("All Centers");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [centerId, setCenterId] = useState(centers[0]?.id || "");
  const [membershipType, setMembershipType] = useState<Member["membershipType"]>("Hot Desk");
  const [status, setStatus] = useState<Member["status"]>("Active");
  const [monthlyRent, setMonthlyRent] = useState(350);
  const [billingCycle, setBillingCycle] = useState<Member["billingCycle"]>("Monthly");
  const [startDate, setStartDate] = useState("2026-05-25");
  const [endDate, setEndDate] = useState("2026-11-25");
  const [allocatedDesksStr, setAllocatedDesksStr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const allocatedDesks = allocatedDesksStr
      ? allocatedDesksStr.split(",").map((s) => s.trim().toUpperCase())
      : ["HD-FL1"];

    const newMember: Member = {
      id: `member-${Date.now()}`,
      name,
      company: company || "Personal",
      email,
      phone,
      centerId,
      membershipType,
      status,
      monthlyRent,
      billingCycle,
      startDate,
      endDate,
      allocatedDesks,
    };

    onAddMember(newMember);
    // Reset form
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setAllocatedDesksStr("");
    setShowAddModal(false);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCenter = centerFilter === "All Centers" || member.centerId === centerFilter;
    const matchesStatus = statusFilter === "All Statuses" || member.status === statusFilter;

    return matchesSearch && matchesCenter && matchesStatus;
  });

  const getStatusBadge = (status: Member["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending Onboarding":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Overdue Billing":
        return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      case "Exiting":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="space-y-6" id="members-registry-section">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Members & Organizations
          </h2>
          <p className="text-sm text-zinc-500">Track active leases, desk occupancy rosters, automated onboarding status, and billing expirations.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Onboard Directly
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-100 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            id="member-search-input"
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100/50 cursor-pointer text-xs rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
            placeholder="Search by name, corporation, or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <select
            id="member-center-filter"
            className="w-full px-3 py-2 bg-zinc-50 rounded-lg text-xs border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
          >
            <option>All Centers</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            id="member-status-filter"
            className="w-full px-3 py-2 bg-zinc-50 rounded-lg text-xs border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending Onboarding</option>
            <option>Overdue Billing</option>
            <option>Exiting</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid of Members Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const associatedCenter = centers.find((c) => c.id === member.centerId);
          return (
            <div
              id={`member-identity-card-${member.id}`}
              key={member.id}
              className="bg-white border border-zinc-100 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-zinc-900 text-sm">{member.name}</h3>
                    <p className="text-xs text-zinc-500 font-sans">{member.company}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(member.status)}`}>
                    {member.status}
                  </span>
                </div>

                {/* Substats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-zinc-600 bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-100 text-left">
                  <div className="space-y-0.5">
                    <div className="text-[9px] uppercase tracking-wider text-zinc-400">Monthly Rent</div>
                    <div className="font-mono text-zinc-800 font-bold">${member.monthlyRent}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] uppercase tracking-wider text-zinc-400">Desk Allocations</div>
                    <div className="font-mono text-zinc-800 text-[10px] font-semibold truncate">
                      {member.allocatedDesks.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-1.5 text-xs text-zinc-500 font-sans">
                  {associatedCenter && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400">🏪</span>
                      <span>{associatedCenter.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">📧</span>
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-zinc-400">📞</span>
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Contract: {member.startDate} to {member.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{member.billingCycle} Fee Structure</span>

                <div className="flex items-center gap-1.5">
                  <select
                    className="p-1 text-[10px] bg-zinc-100 hover:bg-zinc-200 cursor-pointer rounded border-none text-zinc-700 font-bold outline-none"
                    value={member.status}
                    onChange={(e) => onUpdateMemberStatus(member.id, e.target.value as any)}
                  >
                    <option value="Active">Set Active</option>
                    <option value="Pending Onboarding">Set Onboarding</option>
                    <option value="Overdue Billing">Overdue</option>
                    <option value="Exiting">Exiting</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div id="add-member-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full max-w-md shadow-2xl animate-fade-in text-left">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 text-sm">Direct Member Enrollment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Company Trade Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    placeholder="Stark Industries"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    placeholder="jane@stark.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Contact Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    placeholder="+91 99999-55555"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Center Branch *</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={centerId}
                    onChange={(e) => setCenterId(e.target.value)}
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Membership Plan</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={membershipType}
                    onChange={(e) => setMembershipType(e.target.value as any)}
                  >
                    <option value="Hot Desk">Hot Desk</option>
                    <option value="Dedicated Desk">Dedicated Desk</option>
                    <option value="Private Office (Small)">Private Office (Small)</option>
                    <option value="Private Office (Large)">Private Office (Large)</option>
                    <option value="Enterprise Suite">Enterprise Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Rate Card Rent ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Billing Cycle</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as any)}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Enrolled Status</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Onboarding">Onboarding</option>
                    <option value="Overdue Billing">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Lease Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Lease Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Enclosed Desk Identifiers</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono text-zinc-800"
                  placeholder="e.g. O-14, O-15"
                  value={allocatedDesksStr}
                  onChange={(e) => setAllocatedDesksStr(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                >
                  Onboard Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
