import React, { useState } from "react";
import { Invoice, Expense, Member, Center } from "../types";
import { DollarSign, Landmark, Plus, FileText, ArrowUpRight, ArrowDownRight, Printer, AlertTriangle, CheckSquare } from "lucide-react";

interface FinanceERPProps {
  invoices: Invoice[];
  expenses: Expense[];
  members: Member[];
  centers: Center[];
  onAddInvoice: (newInvoice: Invoice) => void;
  onAddExpense: (newExpense: Expense) => void;
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: Invoice["status"]) => void;
}

export default function FinanceERP({
  invoices,
  expenses,
  members,
  centers,
  onAddInvoice,
  onAddExpense,
  onUpdateInvoiceStatus,
}: FinanceERPProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState("All Centers");

  // Invoice creator form states
  const [memberId, setMemberId] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemAmount, setItemAmount] = useState(0);

  // Expense form states
  const [expenseCenterId, setExpenseCenterId] = useState(centers[0]?.id || "");
  const [expenseCategory, setExpenseCategory] = useState<Expense["category"]>("Rent");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  // Filter budgets
  const filteredInvoices = invoices.filter(
    (inv) => selectedCenterId === "All Centers" || inv.centerId === selectedCenterId
  );

  const filteredExpenses = expenses.filter(
    (exp) => selectedCenterId === "All Centers" || exp.centerId === selectedCenterId
  );

  // Aggregate Metrics
  const totalRevenuePaid = filteredInvoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalRevenueOutstanding = filteredInvoices
    .filter((inv) => inv.status === "Sent" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalExpenseCosts = filteredExpenses
    .filter((exp) => exp.status !== "Draft")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netOperationsProfit = totalRevenuePaid - totalExpenseCosts;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !itemDescription || itemAmount <= 0) return;

    const selectedMember = members.find((m) => m.id === memberId);
    if (!selectedMember) return;

    const subtotal = itemAmount;
    const tax = Math.round(subtotal * 0.15 * 100) / 100; // 15% VAT tax
    const total = subtotal + tax;

    const newInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      companyName: selectedMember.company,
      centerId: selectedMember.centerId,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 10 days payment term
      subtotal,
      tax,
      discount: 0,
      total,
      status: "Sent",
      items: [{ description: itemDescription, amount: itemAmount }],
    };

    onAddInvoice(newInvoice);
    setItemDescription("");
    setItemAmount(0);
    setShowInvoiceModal(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0 || !expenseDescription) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      centerId: expenseCenterId,
      category: expenseCategory,
      description: expenseDescription,
      amount: Number(expenseAmount),
      date: new Date().toISOString().slice(0, 10),
      status: "Approved",
    };

    onAddExpense(newExpense);
    setExpenseDescription("");
    setExpenseAmount(0);
    setShowExpenseModal(false);
  };

  return (
    <div className="space-y-6" id="erp-finance-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-600" />
            Financial & ERP Ledger
          </h2>
          <p className="text-sm text-zinc-500">Inspect operational yields, tax deductions, expenditures, and outstanding corporate accounts receivables.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            id="finance-center-selector"
            className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-zinc-200 outline-none focus:ring-1 focus:ring-zinc-400 font-medium text-zinc-700 font-sans"
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
          >
            <option>All Centers</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!memberId && members.length > 0) setMemberId(members[0].id);
              setShowInvoiceModal(true);
            }}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Log Operational Cost
          </button>
        </div>
      </div>

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-100 rounded-xl text-left flex items-start justify-between shadow-xs">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Collected Revenue</div>
            <div className="text-xl font-extrabold text-zinc-950 font-mono">${totalRevenuePaid.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-400">Total May advance checks resolved</div>
          </div>
          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-100 rounded-xl text-left flex items-start justify-between shadow-xs">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Unresolved/Receivable</div>
            <div className="text-xl font-extrabold text-rose-600 font-mono">${totalRevenueOutstanding.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-400">Sent & Overdue contract pipelines</div>
          </div>
          <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-100 rounded-xl text-left flex items-start justify-between shadow-xs">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Operating Expenses</div>
            <div className="text-xl font-extrabold text-zinc-800 font-mono">${totalExpenseCosts.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-400">Land rents, utility Bills & marketing logs</div>
          </div>
          <span className="p-1.5 bg-zinc-50 text-zinc-600 rounded-lg">
            <ArrowDownRight className="w-4 h-4" />
          </span>
        </div>

        <div className="p-4 rounded-xl border text-left flex items-start justify-between shadow-xs bg-zinc-950 text-white border-zinc-900">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Net Yield Profit Balance</div>
            <div className="text-xl font-extrabold font-mono text-emerald-400">${netOperationsProfit.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-400">True Yield (Collected - Operating rents)</div>
          </div>
          <span className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Outstanding invoices ledger list */}
        <div className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-semibold text-zinc-900 text-sm tracking-tight border-b border-zinc-50 pb-2">
            🧾 Corporate Invoices Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.1">Invoice ID</th>
                  <th className="py-2.1">Client Corporate Name</th>
                  <th className="py-2.1">Issued / Due</th>
                  <th className="py-2.1">Status</th>
                  <th className="py-2.1 text-right">Sum / VAT</th>
                  <th className="py-2.1 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredInvoices.map((inv) => (
                  <tr id={`invoice-row-${inv.id}`} key={inv.id} className="hover:bg-zinc-50/50">
                    <td className="py-2.5 font-mono font-bold text-zinc-900">{inv.id}</td>
                    <td className="py-2.5">
                      <div className="font-semibold text-zinc-900">{inv.companyName}</div>
                      <div className="text-[9px] text-zinc-400 font-normal">{inv.memberName}</div>
                    </td>
                    <td className="py-2.5 font-mono text-[10px] text-zinc-500">
                      <div>Issued: {inv.issueDate}</div>
                      <div className="font-semibold text-zinc-600">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        inv.status === "Paid" 
                          ? "bg-emerald-50 text-emerald-700" 
                          : inv.status === "Overdue"
                          ? "bg-rose-50 text-rose-700 animate-pulse"
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-right font-bold text-zinc-900">
                      ${inv.total.toLocaleString()}
                      <div className="text-[9px] text-zinc-400 font-normal font-sans">VAT 15% Included</div>
                    </td>
                    <td className="py-2.5 text-right">
                      <select
                        className="p-1 bg-zinc-100 hover:bg-zinc-200 cursor-pointer text-[9px] font-bold rounded border-none text-zinc-700 outline-none"
                        value={inv.status}
                        onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as any)}
                      >
                        <option value="Paid">Mark Paid</option>
                        <option value="Sent">Mark Sent</option>
                        <option value="Overdue">Mark Overdue</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operating Expenditure Registry */}
        <div className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-semibold text-zinc-900 text-sm tracking-tight border-b border-zinc-50 pb-2">
            💸 Operating Expenditures Registro
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.1">Log Date</th>
                  <th className="py-2.1">Target Center</th>
                  <th className="py-2.1">Expenditure Details</th>
                  <th className="py-2.1">Category</th>
                  <th className="py-2.1 text-right">Sum Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredExpenses.map((exp) => {
                  const correlatedCenter = centers.find((c) => c.id === exp.centerId);
                  return (
                    <tr id={`expense-row-${exp.id}`} key={exp.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 font-mono text-zinc-600">{exp.date}</td>
                      <td className="py-3 text-zinc-500">{correlatedCenter ? correlatedCenter.name : "Global"}</td>
                      <td className="py-3 font-medium text-zinc-900">
                        {exp.description}
                      </td>
                      <td className="py-3 uppercase font-mono tracking-widest text-[9px] text-zinc-500 font-bold">{exp.category}</td>
                      <td className="py-3 font-mono text-right font-bold text-rose-600">-${exp.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice creation popup */}
      {showInvoiceModal && (
        <div id="add-invoice-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full max-w-sm shadow-2xl animate-fade-in text-left">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 text-sm">Issue Corporate Item Invoice</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 font-sans">Select ERP Member Client *</label>
                <select
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700 font-bold"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                >
                  <option value="">-- Choose Member Company --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.company} ({m.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 font-sans">Lease Expense Item description *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none"
                  placeholder="e.g. Monthly Advance Lease Desk DK-14 (May)"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 font-sans">Item sum ($) *</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none font-mono text-zinc-800"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(parseInt(e.target.value) || 0)}
                />
                <p className="text-[9px] text-zinc-400 font-sans mt-1">
                  * Dynamic billing adds standard 15% state taxation ledger automatically before checkout generation.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense create popup */}
      {showExpenseModal && (
        <div id="add-expense-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full max-w-sm shadow-2xl animate-fade-in text-left">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 text-sm">Register Operational Expense Charge</h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Target Center *</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700"
                    value={expenseCenterId}
                    onChange={(e) => setExpenseCenterId(e.target.value)}
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                  >
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Internet">Internet Supply</option>
                    <option value="Salaries">Staff Salaries</option>
                    <option value="Marketing">Marketing Agency</option>
                    <option value="Maintenance">Maintenance Repair</option>
                    <option value="Supplies">Pantry supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Payment expenditure description *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none"
                  placeholder="e.g. Snack box restock and gourmet beans"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Total charge ($) *</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 outline-none font-mono"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition"
                >
                  Log Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
