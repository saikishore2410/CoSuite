import React, { useState } from "react";
import { Visitor, Member, Center } from "../types";
import { Smile, Clock, UserCheck, Plus, CheckCircle, Search, LogOut } from "lucide-react";

interface VisitorLogsProps {
  visitors: Visitor[];
  members: Member[];
  onCheckInVisitor: (newVisitor: Visitor) => void;
  onCheckOutVisitor: (visitorId: string) => void;
  centers: Center[];
}

export default function VisitorLogs({
  visitors,
  members,
  onCheckInVisitor,
  onCheckOutVisitor,
  centers,
}: VisitorLogsProps) {
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState("");

  // CheckIn form states
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hostId, setHostId] = useState(""); // selected from active members
  const [purpose, setPurpose] = useState<Visitor["purpose"]>("Meeting");

  // Filter local vists
  const currentVisitors = visitors.filter((v) => {
    const centerMatch = v.centerId === selectedCenterId;
    const nameMatch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      v.hostCompany.toLowerCase().includes(searchTerm.toLowerCase());
    return centerMatch && nameMatch;
  });

  const getHostCompanyAndName = (id: string) => {
    if (id === "front-desk") {
      return { hostName: "Front Desk Staff", hostCompany: "Community Reception" };
    }
    const mem = members.find((m) => m.id === id);
    if (mem) {
      return { hostName: mem.name, hostCompany: mem.company };
    }
    return { hostName: "Front Desk Staff", hostCompany: "General Workspace Visitor" };
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const { hostName, hostCompany } = getHostCompanyAndName(hostId);
    const now = new Date();
    const checkInTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newVisitor: Visitor = {
      id: `visitor-${Date.now()}`,
      centerId: selectedCenterId,
      name,
      email,
      phone,
      hostName,
      hostCompany,
      purpose,
      checkInTime,
      status: "Checked In",
    };

    onCheckInVisitor(newVisitor);
    
    // Reset states
    setName("");
    setEmail("");
    setPhone("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6" id="visitors-desk-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Smile className="w-5 h-5 text-indigo-600" />
            Reception Desk & Visitor Logs
          </h2>
          <p className="text-sm text-zinc-500">Track walk-ins, scheduled candidate interviews, courier couriers, and visitor check-outs.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            id="visitor-center-selector"
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={selectedCenterId}
            onChange={(e) => {
              setSelectedCenterId(e.target.value);
              // reset host select dropdown options limiters
              setHostId("");
            }}
          >
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              // Ensure default option values are loaded
              if (!hostId && members.length > 0) {
                const localHosts = members.filter(m => m.centerId === selectedCenterId);
                setHostId(localHosts[0]?.id || "front-desk");
              }
              setShowForm(!showForm);
            }}
            className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Check-In Guest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visitors Log Table */}
        <div className="xl:col-span-2 bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-zinc-900 text-sm tracking-tight">Check-In Ledger</h3>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1 bg-zinc-50 hover:bg-zinc-100/50 text-xs rounded border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                placeholder="Search visitor or host organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.5">Visitor</th>
                  <th className="py-2.5">Host Liaison</th>
                  <th className="py-2.5">Purpose</th>
                  <th className="py-2.5">Check-In</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Duty desk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {currentVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                      No guests checked in at this branch today.
                    </td>
                  </tr>
                ) : (
                  currentVisitors.map((visitor) => (
                    <tr id={`visitor-row-${visitor.id}`} key={visitor.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 font-semibold text-zinc-900">
                        {visitor.name}
                        <div className="text-[9px] text-zinc-400 font-normal">{visitor.email || "No Email"}</div>
                      </td>
                      <td className="py-3 text-zinc-600 font-medium">
                        {visitor.hostName}
                        <div className="text-[9px] text-indigo-600 font-semibold">{visitor.hostCompany}</div>
                      </td>
                      <td className="py-3 font-sans text-zinc-500">{visitor.purpose}</td>
                      <td className="py-3 font-mono text-zinc-600 font-semibold">
                        {visitor.checkInTime}
                        {visitor.checkOutTime && (
                          <span className="text-[10px] text-zinc-400 font-normal block font-sans">
                            Out: {visitor.checkOutTime}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                          visitor.status === "Checked Out" 
                            ? "bg-zinc-100 text-zinc-500" 
                            : "bg-emerald-50 text-emerald-700 animate-pulse"
                        }`}>
                          {visitor.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {visitor.status === "Checked In" && (
                          <button
                            onClick={() => onCheckOutVisitor(visitor.id)}
                            className="px-2 py-1 bg-zinc-100 hover:bg-neutral-900 hover:text-white rounded text-[10px] text-zinc-700 font-semibold transition flex items-center gap-1 ml-auto"
                          >
                            <LogOut className="w-3 h-3" />
                            Log Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right form container check-in entry */}
        <div className="space-y-4">
          {showForm ? (
            <div id="check-in-form-card" className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in text-left">
              <h3 className="font-semibold text-zinc-900 text-sm border-b border-zinc-50 pb-2">
                ✍️ Desk Check-In Desk Form
              </h3>

              <form onSubmit={handleCheckIn} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none"
                    placeholder="e.g. Richard Hendricks"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none font-mono"
                      placeholder="richard@piedpiper.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none font-mono"
                      placeholder="+1 415-555-1111"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Host Liaison Company *</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700 font-semibold"
                    value={hostId}
                    onChange={(e) => setHostId(e.target.value)}
                  >
                    <option value="front-desk">Ad-Hoc / Reception Desk (Community Staff)</option>
                    {members
                      .filter((m) => m.centerId === selectedCenterId && m.status === "Active")
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.company} ({m.name})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Purpose of visit</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as any)}
                  >
                    <option>Meeting</option>
                    <option>Interview</option>
                    <option>Tour</option>
                    <option>Delivery</option>
                    <option>Trial Day</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition shadow-xs"
                >
                  Conclude Check-In
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 text-center text-zinc-500 text-xs text-left space-y-3">
              <Clock className="w-8 h-8 text-indigo-500" />
              <h4 className="font-semibold text-zinc-800">Check-In Guide</h4>
              <p className="font-sans text-[11px] leading-relaxed">
                Click <span className="font-semibold text-indigo-700">Check-In Guest</span> option in the header above to run quick registry. Hosts must reside as authorized members of the current active branch. Checked-in guests will immediately show up in the left lobby ledger panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
