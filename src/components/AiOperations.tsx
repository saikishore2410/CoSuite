import React, { useState } from "react";
import { Center, Lead, Member, Invoice, Expense } from "../types";
import { Sparkles, Brain, Loader2, Play, FileCheck, CheckCircle2 } from "lucide-react";

interface AiOperationsProps {
  centers: Center[];
  leads: Lead[];
  members: Member[];
  invoices: Invoice[];
  expenses: Expense[];
}

export default function AiOperations({
  centers,
  leads,
  members,
  invoices,
  expenses,
}: AiOperationsProps) {
  const [loading, setLoading] = useState(false);
  const [auditOutput, setAuditOutput] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const performAudit = async (presetPrompt?: string) => {
    setLoading(true);
    setAuditOutput(null);
    setErrorDetails(null);

    try {
      const response = await fetch("/api/gemini/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          centers,
          leads,
          members,
          invoices,
          expenses,
          customFocus: presetPrompt || "Global Multi-Center Optimization"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to contact optimization agent");
      }

      setAuditOutput(data.auditContent);
    } catch (e: any) {
      console.error(e);
      setErrorDetails(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse some basic markdown highlight markings in-lieu of heavy npm markdown sizes
  const parseMarkdownHtml = (text: string) => {
    if (!text) return "";
    
    // Split into lines
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 1
      if (trimmed.startsWith("# ")) {
        return <h1 key={idx} className="text-xl font-bold text-zinc-950 mt-5 mb-2 pb-1 border-b border-zinc-100">{trimmed.slice(2)}</h1>;
      }
      // Heading 2
      if (trimmed.startsWith("## ")) {
        return <h2 key={idx} className="text-lg font-bold text-zinc-900 mt-4 mb-2">{trimmed.slice(3)}</h2>;
      }
      // Heading 3
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-bold text-zinc-800 mt-3 mb-1.5">{trimmed.slice(4)}</h3>;
      }
      // Bullet items
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs text-zinc-600 mb-1 font-sans">
            {line.replace(/^[\s*-]+/, "")}
          </li>
        );
      }
      // Number items
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-xs text-zinc-600 mb-1 font-sans">
            {line.replace(/^\d+\.\s+/, "")}
          </li>
        );
      }
      // Empty line
      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }

      // Strong bold highlights parsing inside standard paragraph text
      const parts = line.split("**");
      if (parts.length > 2) {
        return (
          <p key={idx} className="text-xs text-zinc-600 font-sans leading-relaxed mb-2">
            {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-zinc-900">{p}</strong> : p))}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs text-zinc-600 font-sans leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6" id="ai-auditor-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
            CoSuite Intelligence Auditor
          </h2>
          <p className="text-sm text-zinc-500">Run a neural operations sweep to balance lease yields, analyze CRM conversions, and locate under-performing desks.</p>
        </div>

        <button
          onClick={() => performAudit()}
          disabled={loading}
          className="px-3.5 py-2 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-lg text-xs font-semibold hover:from-indigo-600 hover:to-indigo-500 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          Initiate Smart Workspace Audit
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side Quick prompt lists */}
        <div className="xl:col-span-1 space-y-4 text-left">
          <div className="bg-white border border-zinc-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-zinc-900 text-sm tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Premade Audit Profiles
            </h3>
            <p className="text-xs text-zinc-500 font-sans">Apply contextual criteria to let CoSuite target specific operational inefficiencies across the branches.</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => performAudit("Focus on Chelsea Location Under-occupancy and local marketing channels")}
                disabled={loading}
                className="w-full p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50 hover:border-zinc-300 transition text-left space-y-1 block disabled:opacity-50"
              >
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-indigo-500 inline" />
                  Chelsea Operating Audit
                </div>
                <p className="text-[10px] text-zinc-500 font-sans">Chelsea branch currently records low hot-desk bookings. Produce a pricing fix.</p>
              </button>

              <button
                onClick={() => performAudit("Focus on billing leaks, outstanding accounts, and invoice renewals")}
                disabled={loading}
                className="w-full p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50 hover:border-zinc-300 transition text-left space-y-1 block disabled:opacity-50"
              >
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-indigo-500 inline" />
                  Billing Leakage Audit
                </div>
                <p className="text-[10px] text-zinc-500 font-sans">Examine sent/overdue commercial invoices and spot corporate payment trends.</p>
              </button>

              <button
                onClick={() => performAudit("Focus on high conversion funnel leads and broker cost trends")}
                disabled={loading}
                className="w-full p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50 hover:border-zinc-300 transition text-left space-y-1 block disabled:opacity-50"
              >
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-indigo-500 inline" />
                  CRM Sales Funnel Audit
                </div>
                <p className="text-[10px] text-zinc-500 font-sans">Highlight lead sources (brokers, social media, walk-ins) with highest ROI yield.</p>
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Dynamic Context-Awareness
            </h4>
            <p className="text-[11px] text-indigo-800 leading-relaxed font-sans">
              Unlike static reports, this neural audit evaluates the <strong>live UI database</strong> state. Add or modify branch rentals, convert leads, or log invoices, and hit recalculate to see immediate updated pricing advice.
            </p>
          </div>
        </div>

        {/* Right Audit report container */}
        <div className="xl:col-span-2 bg-white border border-zinc-100 rounded-xl p-6 shadow-xs min-h-[400px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-zinc-800">CoSuite Intelligence Analyzing Datasets...</p>
                <p className="text-xs text-zinc-500 font-sans">Crosschecking operational rents with invoice balances and pipeline deals.</p>
              </div>
            </div>
          ) : auditOutput ? (
            <div className="space-y-4 text-left animate-fade-in" id="ai-report-output">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">WORKSPACE AUDIT COMPLETED</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Live Session Report</span>
              </div>

              <div className="text-zinc-700 placeholder-indigo-100">
                {parseMarkdownHtml(auditOutput)}
              </div>
            </div>
          ) : errorDetails ? (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-3 text-center">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="font-bold text-zinc-950 text-sm">Auditing Connection Interrupted</h4>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  {errorDetails.includes("API_KEY") 
                    ? "The server-side API Key is missing. Kindly populate your GEMINI_API_KEY inside the Secrets Panel." 
                    : errorDetails}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center text-zinc-400 space-y-3">
              <Brain className="w-14 h-14 text-zinc-100" />
              <div className="space-y-1 max-w-sm">
                <p className="text-xs font-bold text-zinc-600">Operations Intelligence Auditor Dormant</p>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Press the <span className="font-semibold text-indigo-700">Initiate Smart Workspace Audit</span> button to prompt Gemini to scan your coworking portfolio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
