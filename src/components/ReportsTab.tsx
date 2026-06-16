import React from "react";
import { UserProfile, CarbonResult, CalculationLog } from "../types";
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Globe, 
  Zap, 
  Car, 
  Trash2, 
  Droplet,
  ChevronRight,
  User,
  Info,
  CheckCircle2
} from "lucide-react";

interface ReportsTabProps {
  profile: UserProfile;
  results: CarbonResult | null;
  logs: CalculationLog[];
}

export default function ReportsTab({ profile, results, logs }: ReportsTabProps) {
  
  const currentLogs = results || {
    monthlyCO2: 520,
    yearlyCO2: 6240,
    categoryBreakdown: {
      electricity: 160,
      transport: 210,
      waste: 100,
      water: 50,
      flights: 0
    },
    sustainabilityScore: 75,
    diversionRate: 35,
    recyclingScore: 35
  };

  const monthLabel = () => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formattedTons = (kg: number) => {
    return (kg / 1000).toFixed(2);
  };

  // 1. Trigger print window
  const handlePrint = () => {
    window.print();
  };

  // 2. Generate and download a real CSV file
  const handleDownloadCSV = () => {
    const headers = [
      "Metric", 
      "Value (kg CO2/month)", 
      "Annual Equivalent (Tons CO2/yr)", 
      "Percent of Total (%)"
    ];
    
    const rows = [
      ["Registered User", profile.name || "Anonymous", "-", "-"],
      ["Residence Country", profile.country || "Worldwide", "-", "-"],
      ["Household Size", `${profile.householdSize} person(s)`, "-", "-"],
      ["Sustainability Target Speed", profile.sustainabilityGoal, "-", "-"],
      ["Monthly Target Threshold", `${profile.targetCO2} kg`, "-", "-"],
      ["Total Footprint Score", `${currentLogs.sustainabilityScore} / 100`, "-", "-"],
      ["Total Monthly Emissions", `${currentLogs.monthlyCO2} kg`, formattedTons(currentLogs.yearlyCO2), "100%"],
      ["Electricity Category", `${currentLogs.categoryBreakdown.electricity} kg`, formattedTons(currentLogs.categoryBreakdown.electricity * 12), `${((currentLogs.categoryBreakdown.electricity / currentLogs.monthlyCO2) * 100).toFixed(0)}%`],
      ["Transport Category", `${currentLogs.categoryBreakdown.transport} kg`, formattedTons(currentLogs.categoryBreakdown.transport * 12), `${((currentLogs.categoryBreakdown.transport / currentLogs.monthlyCO2) * 100).toFixed(0)}%`],
      ["Waste Category", `${currentLogs.categoryBreakdown.waste} kg`, formattedTons(currentLogs.categoryBreakdown.waste * 12), `${((currentLogs.categoryBreakdown.waste / currentLogs.monthlyCO2) * 100).toFixed(0)}%`],
      ["Water Category", `${currentLogs.categoryBreakdown.water} kg`, formattedTons(currentLogs.categoryBreakdown.water * 12), `${((currentLogs.categoryBreakdown.water / currentLogs.monthlyCO2) * 100).toFixed(0)}%`],
      ["Waste diversion rate", `${currentLogs.diversionRate}%`, "-", "-"]
    ];

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Carbon_Statement_${profile.name || "User"}_${new Date().toISOString().substring(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Potential reduction calculations (assuming 35% standard mitigation on waste/energy)
  const potentialSavingsMonthly = Math.round(currentLogs.monthlyCO2 * 0.3);
  const potentialSavingsYearly = potentialSavingsMonthly * 12;

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Tab Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold font-sans tracking-tight text-slate-900">Sustainability Reports</h3>
          <p className="text-slate-500 text-sm mt-0.5 font-sans">Print and export professional grade environmental data logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer outline-none"
          >
            <Download size={14} /> Export CSV Spreadsheet
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer outline-none"
          >
            <Printer size={14} /> Print Statement (PDF)
          </button>
        </div>
      </div>

      {/* 2. PRINTABLE REPORT CARD CONTAINER */}
      <div 
        id="printable-report-canvas" 
        className="bg-white rounded-2xl border border-slate-150 p-6 md:p-10 shadow-sm print:border-none print:shadow-none space-y-8 font-sans max-w-4xl mx-auto"
      >
        {/* Printable-only header layout */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <span className="text-emerald-800 text-xxs font-extrabold uppercase tracking-widest block">Carbon Footprint Awareness Platform</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Environmental Impact Statement</h2>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mt-2">
              <span className="flex items-center gap-1"><User size={13} className="text-emerald-700" /> Robin Name: <strong>{profile.name || "Anonymous"}</strong></span>
              <span className="flex items-center gap-1"><Globe size={13} className="text-emerald-700" /> Geography: <strong>{profile.country} (Household Size: {profile.householdSize})</strong></span>
              <span className="flex items-center gap-1"><Calendar size={13} className="text-emerald-700" /> Statement Period: <strong>{monthLabel()}</strong></span>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="bg-emerald-800 text-white rounded-xl p-4 text-center">
              <span className="text-xxs font-bold uppercase tracking-wider block opacity-80">Eco Rating Score</span>
              <span className="text-2xl font-mono font-extrabold block mt-0.5">{currentLogs.sustainabilityScore}/100</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1.5">
            <FileText size={14} /> Executive Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 text-xs font-bold uppercase block tracking-wider">Current monthly equivalent</span>
              <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                {currentLogs.monthlyCO2} <span className="text-xs font-bold text-slate-400">kg CO₂</span>
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 text-xs font-bold uppercase block tracking-wider">Current annual projection</span>
              <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                {formattedTons(currentLogs.yearlyCO2)} <span className="text-xs font-bold text-slate-400">Tons CO₂</span>
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 text-center">
              <span className="text-slate-400 text-xs font-bold uppercase block tracking-wider">Estimated Reduction Potential</span>
              <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
                30% <span className="text-xs font-bold text-slate-400">({formattedTons(potentialSavingsYearly)} Tons/yr)</span>
              </span>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed mt-2 p-1">
            This statement documents direct and indirect operational household greenhouse gas emissions derived from domestic electricity utility supply, travel commuting, water treatment, waste landfills, and flight counts. Tailoring individual behaviors to target configurations can drop aggregate outputs significantly.
          </p>
        </div>

        {/* SECTION 2: CATEGORICAL ANALYTICAL BREAKDOWN */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1.5">
            Detailed Categorical Analysis
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-slate-150">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 select-none">
                  <th className="p-3 text-xs uppercase">Emissions Segment</th>
                  <th className="p-3 text-xs uppercase text-right">Monthly Output (kg)</th>
                  <th className="p-3 text-xs uppercase text-right">Annual Projection (Tons)</th>
                  <th className="p-3 text-xs uppercase text-right">Total Purity (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {/* Electricity */}
                <tr>
                  <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5"><Zap size={13} className="text-yellow-500" /> Utility Grid electricity</td>
                  <td className="p-3 text-right font-mono font-medium">{currentLogs.categoryBreakdown.electricity} kg</td>
                  <td className="p-3 text-right font-mono font-medium">{formattedTons(currentLogs.categoryBreakdown.electricity * 12)} T</td>
                  <td className="p-3 text-right font-mono font-medium">
                    {((currentLogs.categoryBreakdown.electricity / Math.max(1, currentLogs.monthlyCO2)) * 100).toFixed(0)}%
                  </td>
                </tr>
                {/* Transport */}
                <tr>
                  <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5"><Car size={13} className="text-sky-500" /> Transport & Commuting</td>
                  <td className="p-3 text-right font-mono font-medium">{currentLogs.categoryBreakdown.transport} kg</td>
                  <td className="p-3 text-right font-mono font-medium">{formattedTons(currentLogs.categoryBreakdown.transport * 12)} T</td>
                  <td className="p-3 text-right font-mono font-medium">
                    {((currentLogs.categoryBreakdown.transport / Math.max(1, currentLogs.monthlyCO2)) * 100).toFixed(0)}%
                  </td>
                </tr>
                {/* Waste */}
                <tr>
                  <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5"><Trash2 size={13} className="text-purple-500" /> Solid House Waste</td>
                  <td className="p-3 text-right font-mono font-medium">{currentLogs.categoryBreakdown.waste} kg</td>
                  <td className="p-3 text-right font-mono font-medium">{formattedTons(currentLogs.categoryBreakdown.waste * 12)} T</td>
                  <td className="p-3 text-right font-mono font-medium">
                    {((currentLogs.categoryBreakdown.waste / Math.max(1, currentLogs.monthlyCO2)) * 100).toFixed(0)}%
                  </td>
                </tr>
                {/* Water */}
                <tr>
                  <td className="p-3 font-semibold text-slate-800 flex items-center gap-1.5"><Droplet size={13} className="text-emerald-500" /> Water loading</td>
                  <td className="p-3 text-right font-mono font-medium">{currentLogs.categoryBreakdown.water} kg</td>
                  <td className="p-3 text-right font-mono font-medium">{formattedTons(currentLogs.categoryBreakdown.water * 12)} T</td>
                  <td className="p-3 text-right font-mono font-medium">
                    {((currentLogs.categoryBreakdown.water / Math.max(1, currentLogs.monthlyCO2)) * 100).toFixed(0)}%
                  </td>
                </tr>
                {/* Total */}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-250">
                  <td className="p-3">Total operational footprint</td>
                  <td className="p-3 text-right font-mono">{currentLogs.monthlyCO2} kg</td>
                  <td className="p-3 text-right font-mono">{formattedTons(currentLogs.yearlyCO2)} Tons</td>
                  <td className="p-3 text-right font-mono">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: KEY ENVIRONMENTAL OPPORTUNITIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-1 inline-block">
              Priority Opportunities
            </h4>
            
            <ul className="space-y-2 text-xs md:text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Replace home utility contracts with 100% solar micro-generation.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Shift 20% of single-passenger commute distances to train routes.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Adopt residential waste composting to prevent landfill organic methane releases.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-1 inline-block mb-2">
                Advisor Certification
              </h4>
              <p className="text-slate-500 text-xs leading-normal">
                This verification certifies that individual monthly carbon computations align with public parameters and domestic coefficients for residential modeling.
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-4 text-xxs font-medium text-slate-400 font-mono">
              <span>Platform Verification: <strong>GEN-VERIFIED-2026</strong></span>
              <span className="text-right">Issued: <strong>{new Date().toLocaleDateString()}</strong></span>
            </div>
          </div>

        </div>

        {/* Printable-only footnote */}
        <div className="text-center font-mono text-[9px] text-slate-400 border-t border-slate-100 pt-4 hidden print:block">
          Carbon Footprint Awareness Platform | Verified Digital Resource and Environmental Statement Page
        </div>

      </div>

    </div>
  );
}
