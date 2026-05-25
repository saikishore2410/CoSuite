import React, { useState } from "react";
import { Lead, Center } from "../types";
import { UserCheck, PhoneCall, Calendar, FileText, CheckCircle, ArrowRight, ArrowLeft, Plus, Filter, MessageSquare, Trash2 } from "lucide-react";

interface LeadCRMProps {
  leads: Lead[];
  onAddLead: (newLead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: Lead["status"]) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToMember: (lead: Lead) => void;
  centers: Center[];
}

const CRM_STAGES: Lead["status"][] = [
  "New",
  "Contacted",
  "Tour Scheduled",
  "Proposal Sent",
  "Negotiating",
  "Won",
];

export default function LeadCRM({
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onDeleteLead,
  onConvertToMember,
  centers,
}: LeadCRMProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCenterFilter, setSelectedCenterFilter] = useState("All Centers");
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("All Sources");

  // Add form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [centerInterest, setCenterInterest] = useState(centers[0]?.id || "");
  const [source, setSource] = useState<Lead["source"]>("Website");
  const [requirementType, setRequirementType] = useState<Lead["requirementType"]>("Hot Desk");
  const [size, setSize] = useState(1);
  const [value, setValue] = useState(250);
  const [notes, setNotes] = useState("");

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      company: company || "Personal",
      email,
      phone,
      centerInterest,
      source,
      status: "New",
      requirementType,
      size,
      value: Number(value),
      notes,
      createdAt: new Date().toISOString(),
    };

    onAddLead(newLead);
    // Reset state
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setNotes("");
    setShowAddModal(false);
  };

  const getSourceIcon = (source: Lead["source"]) => {
    switch (source) {
      case "Website": return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case "Walk-in": return <UserCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case "Google Ads": return <Filter className="w-3.5 h-3.5 text-orange-500" />;
      case "Broker": return <PhoneCall className="w-3.5 h-3.5 text-purple-500" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />;
    }
  };

  const shiftStatus = (lead: Lead, direction: "forward" | "backward") => {
    const currentIndex = CRM_STAGES.indexOf(lead.status);
    if (direction === "forward" && currentIndex < CRM_STAGES.length - 1) {
      const nextStatus = CRM_STAGES[currentIndex + 1];
      onUpdateLeadStatus(lead.id, nextStatus);
    } else if (direction === "backward" && currentIndex > 0) {
      const prevStatus = CRM_STAGES[currentIndex - 1];
      onUpdateLeadStatus(lead.id, prevStatus);
    } else if (direction === "forward" && lead.status === "Won") {
      // Prompt conversion helper
      onConvertToMember(lead);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const centerMatch = selectedCenterFilter === "All Centers" || lead.centerInterest === selectedCenterFilter;
    const sourceMatch = selectedSourceFilter === "All Sources" || lead.source === selectedSourceFilter;
    return centerMatch && sourceMatch;
  });

  return (
    <div className="space-y-6" id="crm-workspace-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            CRM Lead Funnel
          </h2>
          <p className="text-sm text-zinc-500">Nurture tours, send proposals, negotiate lease durations, and convert deals to active members.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={selectedCenterFilter}
            onChange={(e) => setSelectedCenterFilter(e.target.value)}
          >
            <option>All Centers</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
          >
            <option>All Sources</option>
            <option>Website</option>
            <option>Walk-in</option>
            <option>Broker</option>
            <option>Referral</option>
            <option>Google Ads</option>
            <option>Social Media</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Log New Lead
          </button>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {CRM_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.status === stage);
          const stageTotalValue = stageLeads.reduce((sum, current) => sum + current.value, 0);

          return (
            <div id={`crm-column-${stage.toLowerCase().replace(/\s+/g, "-")}`} key={stage} className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex flex-col min-w-[210px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{stage}</span>
                <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-700 font-mono text-[10px] rounded-full font-bold">
                  {stageLeads.length}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono font-medium">Est Value: ${stageTotalValue.toLocaleString()}/mo</div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {stageLeads.length === 0 ? (
                  <div className="h-24 border border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-[10px] text-zinc-400">
                    No leads at this level
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const targetCenter = centers.find((c) => c.id === lead.centerInterest);
                    return (
                      <div
                        id={`lead-card-${lead.id}`}
                        key={lead.id}
                        className="bg-white p-3 rounded-lg border border-zinc-200/80 shadow-xs space-y-2 group transition hover:border-zinc-400 hover:shadow-xs relative"
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-zinc-900 text-xs truncate max-w-[120px]" title={lead.name}>
                            {lead.name}
                          </div>
                          <span className="text-[9px] font-mono font-medium tracking-tight text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">
                            {lead.requirementType}
                          </span>
                        </div>

                        <div className="text-[10px] text-zinc-500 font-medium">Company: <span className="font-semibold text-zinc-700">{lead.company}</span></div>

                        {targetCenter && (
                          <div className="text-[10px] text-zinc-400 truncate font-sans">
                            🏪 {targetCenter.name}
                          </div>
                        )}

                        <div className="text-[10px] font-mono text-emerald-600 font-bold">Est value: ${lead.value}/mo • {lead.size} Pax</div>

                        {lead.notes && (
                          <p className="text-[10px] text-zinc-500 bg-zinc-50 p-1 rounded font-sans italic truncate" title={lead.notes}>
                            "{lead.notes}"
                          </p>
                        )}

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {getSourceIcon(lead.source)}
                            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">{lead.source}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {lead.status === "Won" ? (
                              <button
                                onClick={() => onConvertToMember(lead)}
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold flex items-center gap-0.5"
                                title="Approve into full member"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Onboard
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => shiftStatus(lead, "backward")}
                                  disabled={lead.status === "New"}
                                  className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded disabled:opacity-40 text-zinc-600 disabled:hover:bg-zinc-100 transition"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => shiftStatus(lead, "forward")}
                                  className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-600 transition"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-zinc-400 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Triggering On Won state */}
      <div className="bg-amber-50 p-4 border border-amber-200 rounded-xl max-w-xl text-left flex gap-3">
        <span className="text-lg">💡</span>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-900">Operator Sales Workflow tip</h4>
          <p className="text-[11px] text-amber-700 leading-relaxed font-sans">
            Move any lead card forward to the <span className="font-semibold text-emerald-800">Won</span> stage. Once won, click the <span className="font-semibold">"Onboard"</span> button on the card to safely convert their CRM profile parameters directly into the ERP members register database.
          </p>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showAddModal && (
        <div id="add-lead-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full max-w-md shadow-2xl animate-fade-in text-left">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 text-sm">Log CRM Pipeline Prospect</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Lead Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    placeholder="e.g. Rachel Green"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Company/Entity</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    placeholder="e.g. Ralph Lauren Corp"
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Business Mobile</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    placeholder="+1 555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Target Center *</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={centerInterest}
                    onChange={(e) => setCenterInterest(e.target.value)}
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Acquisition Channel</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                  >
                    <option value="Website">Website Form</option>
                    <option value="Walk-in">Walk-in Inquiry</option>
                    <option value="Broker">Real Estate Broker</option>
                    <option value="Referral">Member Referral</option>
                    <option value="Google Ads">Google Ads Campaign</option>
                    <option value="Social Media">Social Media Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Lease Target</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700"
                    value={requirementType}
                    onChange={(e) => setRequirementType(e.target.value as any)}
                  >
                    <option value="Hot Desk">Hot Desk</option>
                    <option value="Dedicated Desk">Dedicated Desk</option>
                    <option value="Private Office">Private Office</option>
                    <option value="Enterprise Suite">Enterprise Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Seat Count (Pax)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Value/mo ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Internal Pipeline Notes</label>
                <textarea
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-sans h-16 resize-none"
                  placeholder="Need special lock-in, needs custom branding spaces..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                >
                  Create Deal Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
