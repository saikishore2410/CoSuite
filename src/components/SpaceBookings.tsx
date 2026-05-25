import React, { useState } from "react";
import { Booking, Center } from "../types";
import { Calendar, Clock, Plus, Trash2, Check, Landmark, ShieldCheck } from "lucide-react";

interface SpaceBookingsProps {
  bookings: Booking[];
  onAddBooking: (newBooking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  centers: Center[];
}

export default function SpaceBookings({
  bookings,
  onAddBooking,
  onCancelBooking,
  centers,
}: SpaceBookingsProps) {
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("2026-05-25");

  // Booking form states
  const [spaceName, setSpaceName] = useState("Boardroom Alpha");
  const [spaceType, setSpaceType] = useState<Booking["spaceType"]>("Meeting Room");
  const [bookerName, setBookerName] = useState("");
  const [bookerCompany, setBookerCompany] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [cost, setCost] = useState(30);

  // Filter local bookings
  const localBookings = bookings.filter(
    (b) => b.centerId === selectedCenterId && b.date === selectedDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookerName) return;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      centerId: selectedCenterId,
      spaceName,
      spaceType,
      bookerName,
      bookerCompany: bookerCompany || "Guest Visitor",
      date: selectedDate,
      startTime,
      endTime,
      cost: Number(cost),
      status: "Confirmed",
    };

    onAddBooking(newBooking);
    setBookerName("");
    setBookerCompany("");
  };

  // Pre-configured resources
  const availableResources = [
    { name: "Boardroom Alpha", type: "Meeting Room" as const, cost: 30 },
    { name: "Zen Conference Hall", type: "Meeting Room" as const, cost: 45 },
    { name: "Focus Pod 1", type: "Phone Booth" as const, cost: 10 },
    { name: "Focus Pod 2", type: "Phone Booth" as const, cost: 10 },
    { name: "Podcast Studio Base", type: "Podcast Studio" as const, cost: 40 },
    { name: "Horizon Arena", type: "Event Hall" as const, cost: 150 },
  ];

  const handleResourceSelect = (resource: typeof availableResources[0]) => {
    setSpaceName(resource.name);
    setSpaceType(resource.type);
    setCost(resource.cost);
  };

  return (
    <div className="space-y-6" id="bookings-manager-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Workspace Room Booking Scheduler
          </h2>
          <p className="text-sm text-zinc-500">Coordinate shared boardroom slots, quiet phone pods, and recording spaces by branch and date.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            id="booking-center-selector"
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700"
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
          >
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            id="booking-date-picker"
            type="date"
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 text-zinc-700 font-medium font-mono outline-none focus:ring-1 focus:ring-zinc-400"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive slot scheduler */}
        <div className="lg:col-span-1 bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-semibold text-zinc-900 text-sm tracking-tight flex items-center gap-2 border-b border-zinc-50 pb-2">
            <Plus className="w-4 h-4 text-zinc-800" />
            Reserve a Shared Room
          </h3>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-zinc-500">1. Select Resource Room</label>
            <div className="grid grid-cols-2 gap-2">
              {availableResources.map((res) => (
                <div
                  key={res.name}
                  onClick={() => handleResourceSelect(res)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                    spaceName === res.name
                      ? "bg-zinc-50 border-zinc-950 font-semibold"
                      : "bg-white border-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <div className="text-[10px] text-zinc-800 font-semibold truncate">{res.name}</div>
                  <div className="text-[8px] text-zinc-400 font-medium">{res.type}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1 font-mono">${res.cost}/hr</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">2. Booker Name *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none"
                placeholder="Name of member or guest..."
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Company Entity</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none"
                placeholder="e.g. Stark Co."
                value={bookerCompany}
                onChange={(e) => setBookerCompany(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 font-mono"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">End Time</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 font-mono"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg flex items-center justify-between font-mono">
              <span className="text-xs text-zinc-600 uppercase font-bold">Total Tariff Estimated:</span>
              <span className="text-sm font-extrabold text-zinc-900">${cost} USD</span>
            </div>

            <button
               type="submit"
               className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition"
            >
              Secure Reservation
            </button>
          </form>
        </div>

        {/* Right list of reservation ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs">
            <h3 className="font-semibold text-zinc-900 text-sm tracking-tight mb-4 border-b border-zinc-50 pb-2">
              📅 Bookings on {selectedDate}
            </h3>

            {localBookings.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 space-y-2">
                <Landmark className="w-12 h-12 text-zinc-200 mx-auto" />
                <p className="text-xs">No reservations scheduled for this branch on this date.</p>
                <p className="text-[11px] text-zinc-400 font-sans">Use the scheduler tool on the left to allocate rooms instantly.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                      <th className="py-2.5">Resource Space</th>
                      <th className="py-2.5">Scheduled slots</th>
                      <th className="py-2.5">Reserver Name</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Fee</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {localBookings.map((booking) => (
                      <tr id={`booking-row-${booking.id}`} key={booking.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 font-semibold text-zinc-900">
                          {booking.spaceName}
                          <div className="text-[9px] text-zinc-400 font-normal">{booking.spaceType}</div>
                        </td>
                        <td className="py-3 font-mono text-zinc-600 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-300" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </td>
                        <td className="py-3 text-zinc-600 font-medium">
                          {booking.bookerName}
                          <div className="text-[9px] text-zinc-400 font-normal">{booking.bookerCompany}</div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                            booking.status === "Cancelled" 
                              ? "bg-rose-50 text-rose-700" 
                              : booking.status === "Completed"
                              ? "bg-zinc-100 text-zinc-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-right font-bold text-zinc-900">${booking.cost}</td>
                        <td className="py-3 text-right">
                          {booking.status !== "Cancelled" && (
                            <button
                              onClick={() => onCancelBooking(booking.id)}
                              className="p-1 hover:bg-rose-50 rounded text-zinc-400 hover:text-rose-600 transition"
                              title="Cancel slot reservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 text-left flex gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-800">Operational Guideline: Overuse Guard</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                Shared Boardroom and Studio charges are credited directly onto corporate monthly ERP balance summaries. Double-booking check blocks are automatically handled by active community front-office desks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
