import React, { useState } from "react";
import { Center } from "../types";
import { Building2, MapPin, Layers, CheckSquare, Plus, DollarSign, Percent } from "lucide-react";

interface CenterManagementProps {
  centers: Center[];
  onAddCenter: (newCenter: Center) => void;
  selectedCenter: Center | null;
  onSelectCenter: (center: Center) => void;
}

export default function CenterManagement({
  centers,
  onAddCenter,
  selectedCenter,
  onSelectCenter,
}: CenterManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("San Francisco");
  const [address, setAddress] = useState("");
  const [tier, setTier] = useState<"Premium" | "Standard" | "Budget">("Standard");
  const [squareFt, setSquareFt] = useState(10000);
  const [monthlyRentalCost, setMonthlyRentalCost] = useState(10000);
  const [hotDesks, setHotDesks] = useState(50);
  const [dedicatedDesks, setDedicatedDesks] = useState(25);
  const [privateOffices, setPrivateOffices] = useState(10);
  const [meetingRooms, setMeetingRooms] = useState(4);

  // Filter state
  const [cityFilter, setCityFilter] = useState("All Cities");

  const cities = ["All Cities", ...Array.from(new Set(centers.map((c) => c.city)))];

  const filteredCenters = cityFilter === "All Cities" 
    ? centers 
    : centers.filter((c) => c.city === cityFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    const newCenter: Center = {
      id: `${city.toLowerCase().replace(/\s+/g, "-")}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      city,
      address,
      amenities: ["1000 Mbps Fiber", "Phone Booths", "Complimentary Tea & Coffee", "Print & Scan Hub"],
      capacity: { hotDesks, dedicatedDesks, privateOffices, meetingRooms },
      occupancy: { hotDesks: 0, dedicatedDesks: 0, privateOffices: 0 },
      tier,
      squareFt,
      monthlyRentalCost,
    };

    onAddCenter(newCenter);
    setName("");
    setAddress("");
    setShowAddModal(false);
  };

  // Helper to compute utility score
  const getCapacityPercent = (used: number, max: number) => {
    if (max === 0) return 0;
    return Math.round((used / max) * 100);
  };

  return (
    <div className="space-y-6" id="center-management-section">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Branch portfolio & Occupancy
          </h2>
          <p className="text-sm text-zinc-500">Manage global branches, track physical capacity limits, and operating lease values.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="city-filter-dropdown"
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-700 font-medium"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <button
            id="add-center-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Branch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Centers List Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCenters.map((center) => {
              const isSelected = selectedCenter?.id === center.id;
              const hotDeskPct = getCapacityPercent(center.occupancy.hotDesks, center.capacity.hotDesks);
              const dedicatedPct = getCapacityPercent(center.occupancy.dedicatedDesks, center.capacity.dedicatedDesks);
              const privatePct = getCapacityPercent(center.occupancy.privateOffices, center.capacity.privateOffices);

              // Overall Average Occupancy
              const totalCap = center.capacity.hotDesks + center.capacity.dedicatedDesks + center.capacity.privateOffices;
              const totalOcc = center.occupancy.hotDesks + center.occupancy.dedicatedDesks + center.occupancy.privateOffices;
              const totalOccPct = getCapacityPercent(totalOcc, totalCap);

              return (
                <div
                  id={`center-card-${center.id}`}
                  key={center.id}
                  onClick={() => onSelectCenter(center)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? "bg-zinc-50 border-zinc-900 ring-1 ring-zinc-900"
                      : "bg-white border-zinc-100 hover:border-zinc-300 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                        center.tier === "Premium" 
                          ? "bg-purple-50 text-purple-700 border border-purple-100" 
                          : center.tier === "Standard"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {center.tier} Class
                      </span>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        {center.squareFt.toLocaleString()} sqft
                      </div>
                    </div>

                    <h3 className="font-semibold text-zinc-900 mt-2 text-sm md:text-base leading-tight">
                      {center.name}
                    </h3>
                    
                    <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span className="truncate">{center.address}</span>
                    </p>
                  </div>

                  {/* Operational indicators */}
                  <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-600 font-medium">Global Occupancy</span>
                      <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] ${
                        totalOccPct > 75 
                          ? "bg-emerald-50 text-emerald-700" 
                          : totalOccPct > 40
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {totalOccPct}%
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          totalOccPct > 75 ? "bg-emerald-500" : totalOccPct > 40 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${totalOccPct}%` }}
                      ></div>
                    </div>

                    {/* Secondary detailed resource bars */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-500">
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Hot Desk</span>
                          <span className="text-zinc-900">{hotDeskPct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${hotDeskPct}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Dedi Desk</span>
                          <span className="text-zinc-900">{dedicatedPct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${dedicatedPct}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Private</span>
                          <span className="text-zinc-900">{privatePct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500" style={{ width: `${privatePct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Center Right Action Rail */}
        <div className="space-y-4">
          {selectedCenter ? (
            <div id="center-detail-rail" className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm tracking-tight flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  {selectedCenter.name}
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">{selectedCenter.city} Branch Office</p>
              </div>

              {/* Stats values */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-50 rounded-lg text-left">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Lease Cost</div>
                  <div className="text-base font-bold text-zinc-900 mt-0.5 flex items-center">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500 inline" />
                    {selectedCenter.monthlyRentalCost.toLocaleString()}
                    <span className="text-[10px] text-zinc-400 font-normal">/mo</span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg text-left">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Capacity</div>
                  <div className="text-base font-bold text-zinc-900 mt-0.5">
                    {selectedCenter.capacity.hotDesks +
                      selectedCenter.capacity.dedicatedDesks +
                      selectedCenter.capacity.privateOffices}{" "}
                    <span className="text-[10px] text-zinc-500 font-normal font-sans">Units</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Features & Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCenter.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] rounded-full hover:bg-zinc-200 cursor-default transition"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Manager checklist */}
              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  Branch Checklist
                </h4>
                <ul className="space-y-2 text-xs text-zinc-600 font-sans">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-0.5 rounded border-zinc-300" defaultChecked />
                    <span>Check primary Wi-Fi load balance limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-0.5 rounded border-zinc-300" defaultChecked />
                    <span>Audit snack pantry supply logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-0.5 rounded border-zinc-300" />
                    <span>Crosscheck CRM pipeline walkthrough schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-0.5 rounded border-zinc-300" />
                    <span>Process high-priority outstanding invoice alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 text-center text-zinc-500 text-xs">
              Select a branch location card to inspect capacities, checklist items, and leasing stats.
            </div>
          )}
        </div>
      </div>

      {/* Add New Center Modal */}
      {showAddModal && (
        <div id="add-center-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full max-w-lg shadow-2xl animate-fade-in text-left">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 text-sm">Deploy New Coworking Location</h3>
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
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    placeholder="e.g. Indiranagar Rise"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">City</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option>San Francisco</option>
                    <option>Bangalore</option>
                    <option>New York</option>
                    <option>London</option>
                    <option>Singapore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Physical Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                  placeholder="Street No, Building, Floor details..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Tier Class</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400"
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                  >
                    <option>Premium</option>
                    <option>Standard</option>
                    <option>Budget</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Area (Sq Ft)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={squareFt}
                    onChange={(e) => setSquareFt(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1">Monthly Cost ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                    value={monthlyRentalCost}
                    onChange={(e) => setMonthlyRentalCost(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-zinc-500">Resource Capacities</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-medium">Hot Desks</label>
                    <input
                      type="number"
                      className="w-full p-1 text-xs bg-white rounded border border-zinc-200 outline-none font-mono text-center"
                      value={hotDesks}
                      onChange={(e) => setHotDesks(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-medium">Dedi Desks</label>
                    <input
                      type="number"
                      className="w-full p-1 text-xs bg-white rounded border border-zinc-200 outline-none font-mono text-center"
                      value={dedicatedDesks}
                      onChange={(e) => setDedicatedDesks(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-medium">Priv Office</label>
                    <input
                      type="number"
                      className="w-full p-1 text-xs bg-white rounded border border-zinc-200 outline-none font-mono text-center"
                      value={privateOffices}
                      onChange={(e) => setPrivateOffices(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-medium">Meet Room</label>
                    <input
                      type="number"
                      className="w-full p-1 text-xs bg-white rounded border border-zinc-200 outline-none font-mono text-center"
                      value={meetingRooms}
                      onChange={(e) => setMeetingRooms(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                >
                  Deploy Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
