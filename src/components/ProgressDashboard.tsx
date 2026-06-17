import React from "react";
import { UserProfile, CalculationLog, CarbonResult } from "../types";
import { generateProjections, getScoredRecommendations } from "../utils";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from "recharts";
import { 
  ChevronRight, 
  Activity, 
  Sparkles, 
  ArrowDownCircle, 
  Target, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Zap,
  Car,
  Trash2,
  Droplet
} from "lucide-react";

interface ProgressDashboardProps {
  profile: UserProfile;
  latestResults: CarbonResult | null;
  logs: CalculationLog[];
  onNavigateToTab: (tab: string) => void;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  electricity: "#047857", // Deep Emerald
  transport: "#0ea5e9",   // Sky Blue
  waste: "#a855f7",       // Purple
  water: "#34d399",       // Soft Mint Green
  flights: "#f59e0b"      // Amber
};

export default function ProgressDashboard({
  profile,
  latestResults,
  logs,
  onNavigateToTab
}: ProgressDashboardProps) {
  
  // Use latest log or fallback to default values
  const results = latestResults || {
    monthlyCO2: 580,
    yearlyCO2: 6960,
    categoryBreakdown: {
      electricity: 180,
      transport: 240,
      waste: 110,
      water: 50,
      flights: 0
    },
    sustainabilityScore: 71,
    diversionRate: 35,
    recyclingScore: 35
  };

  const targetCO2 = profile.targetCO2;
  const currentCO2 = results.monthlyCO2;
  
  // Reduction achieved calculation %
  // If current exceeds target, we say 0% or negative. Let's showcase it positively or realistic
  const reductionValue = targetCO2 - currentCO2;
  const reductionAchieved = targetCO2 > 0 
    ? Math.round((reductionValue / targetCO2) * 100) 
    : 0;

  // Pie chart data formatting
  const breakdownData = [
    { name: "Electricity", value: results.categoryBreakdown.electricity, key: "electricity" },
    { name: "Commutes & Transport", value: results.categoryBreakdown.transport, key: "transport" },
    { name: "Landfill Waste", value: results.categoryBreakdown.waste, key: "waste" },
    { name: "Water & Utilities", value: results.categoryBreakdown.water, key: "water" },
    { name: "Flights & Travel", value: results.categoryBreakdown.flights, key: "flights" }
  ].filter(d => d.value > 0);

  // Goal tracker bar data
  const comparisonData = [
    { name: "Current Footprint", value: currentCO2, fill: currentCO2 > targetCO2 ? "#ef4444" : "#0ea5e9" },
    { name: "Goal Target", value: targetCO2, fill: "#047857" }
  ];

  // Forecast trend projections
  const projectionItems = generateProjections(currentCO2, targetCO2, profile.sustainabilityGoal);

  // Suggested actions sorted by score
  const allRecs = getScoredRecommendations();
  const recommendedActions = allRecs.slice(0, 3);

  // Cumulative Projected Annual Savings (kg) based on top 3 recommendations
  const totalAnnualSavingsKg = recommendedActions.reduce((sum, r) => sum + (r.carbonReduction * 12), 0);
  const totalAnnualSavingsTons = (totalAnnualSavingsKg / 1000).toFixed(2);

  // Rating and color metrics
  const getScoreRating = (score: number) => {
    if (score >= 80) return { label: "Excellent (Eco Guardian)", pyColor: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 60) return { label: "Good (Sustainability Active)", pyColor: "text-amber-750 bg-amber-50 border-amber-200" };
    return { label: "Critical (Carbon Intensive)", pyColor: "text-rose-700 bg-rose-50 border-rose-200" };
  };
  const ratingDetails = getScoreRating(results.sustainabilityScore);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 1. KEY KPI CARD SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* SCORE CARD */}
        <div id="kpi-sustainability-score" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" role="group" aria-labelledby="kpi-score-title">
          <div className="flex justify-between items-start">
            <div>
              <span id="kpi-score-title" className="text-slate-600 text-xs font-bold uppercase block tracking-wider">Carbon Score</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">{results.sustainabilityScore}/100</span>
            </div>
            <span className={`text-xxs font-extrabold px-2.5 py-1 rounded-full border ${ratingDetails.pyColor}`}>
              Score
            </span>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4">
            <p className="text-slate-600 text-xs leading-normal">
              Based on global carbon averages. Keep monthly habits under 350 kg CO₂ to maximize score.
            </p>
          </div>
        </div>

        {/* CURRENT MONTHLY CO2 */}
        <div id="kpi-monthly-emissions" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" role="group" aria-labelledby="kpi-monthly-title">
          <div className="flex justify-between items-start">
            <div>
              <span id="kpi-monthly-title" className="text-slate-600 text-xs font-bold uppercase block tracking-wider">Current Monthly CO₂</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">{currentCO2} <span className="text-xs font-bold text-slate-500">kg</span></span>
            </div>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-700" aria-hidden="true">
              <Activity size={18} />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-600">
            <span>Annual projection:</span>
            <span className="font-mono font-bold text-slate-800">{(results.yearlyCO2 / 1000).toFixed(1)} tons / yr</span>
          </div>
        </div>

        {/* REDUCTION GOAL METRIC */}
        <div id="kpi-reduction-achieved" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" role="group" aria-labelledby="kpi-reduction-title">
          <div className="flex justify-between items-start">
            <div>
              <span id="kpi-reduction-title" className="text-slate-600 text-xs font-bold uppercase block tracking-wider">Goal Reduction</span>
              <span className={`text-3xl font-extrabold font-mono mt-1 block ${reductionAchieved >= 0 ? "text-emerald-800" : "text-rose-700"}`}>
                {reductionAchieved >= 0 ? `+${reductionAchieved}%` : `${reductionAchieved}%`}
              </span>
            </div>
            <div className={`p-2 rounded-xl ${reductionAchieved >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`} aria-hidden="true">
              <Target size={18} />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-xs text-slate-600">
            {reductionAchieved >= 0 ? (
              <p className="flex items-center gap-1 text-emerald-800 font-bold">
                <CheckCircle size={13} aria-hidden="true" /> Slicing target by {reductionValue.toFixed(0)} kg CO₂!
              </p>
            ) : (
              <p className="flex items-center gap-1 text-rose-700 font-bold">
                <ShieldAlert size={13} aria-hidden="true" /> {Math.abs(reductionValue).toFixed(0)} kg CO₂ over target
              </p>
            )}
          </div>
        </div>

        {/* PROJECTED ANNUAL SAVINGS */}
        <div id="kpi-projected-savings" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" role="group" aria-labelledby="kpi-savings-title">
          <div className="flex justify-between items-start">
            <div>
              <span id="kpi-savings-title" className="text-slate-600 text-xs font-bold uppercase block tracking-wider">Projected Savings</span>
              <span className="text-3xl font-extrabold text-emerald-800 font-mono mt-1 block">~{totalAnnualSavingsTons} <span className="text-xs font-bold text-slate-500">Tons</span></span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800" aria-hidden="true">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-xs text-slate-600 flex items-center justify-between">
            <span>By implementing proposed list:</span>
            <span className="font-mono font-bold text-emerald-800">{totalAnnualSavingsKg} kg/yr</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN REDUCTION GOAL TRACKER WIDGET */}
      <section aria-label="Carbon Goal Tracker Detail" className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-emerald-300 text-xxs font-bold uppercase tracking-widest">Active Reduction</span>
            <h3 className="text-xl font-bold font-sans">Carbon Goal Tracker ({profile.sustainabilityGoal.toUpperCase()})</h3>
            <p className="text-emerald-100/90 text-xs max-w-sm">Comparing current utility habits against the custom target parameters defined in your profile configuration.</p>
          </div>

          {/* Goal visual bar scale with proper ARIA attributes */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between text-xs text-emerald-200">
              <span className="font-bold">Current Monthly habit: <strong className="font-mono text-white text-sm">{currentCO2} kg</strong></span>
              <span className="font-bold">Monthly Threshold Target: <strong className="font-mono text-white text-sm">{targetCO2} kg</strong></span>
            </div>
            
            {/* ProgressBar */}
            <div 
              role="progressbar"
              aria-valuenow={currentCO2}
              aria-valuemin={0}
              aria-valuemax={Math.round(targetCO2 * 1.5)}
              aria-label={`Carbon saving progress. Current footprint is ${currentCO2} kilograms, goal cap is ${targetCO2} kilograms.`}
              className="h-4 w-full bg-emerald-950 rounded-full border border-emerald-800/80 p-0.5 overflow-hidden"
            >
              <div 
                className={`h-full rounded-full transition-all duration-500 ${currentCO2 <= targetCO2 ? "bg-emerald-400" : "bg-amber-400"}`}
                style={{ width: `${Math.min(100, (currentCO2 / Math.max(1, targetCO2)) * 100)}%` }}
              />
            </div>
            
            {/* Status explanation line */}
            <div className="flex justify-between items-center text-xxs text-emerald-200 font-mono pt-1">
              <span>0 kg</span>
              <span className="text-white font-bold">{currentCO2 <= targetCO2 ? "✓ Good Pacing! Target Fulfilled" : "⚠ Target Exceeded! Action Recommended"}</span>
              <span>{(targetCO2 * 1.5).toFixed(0)} kg max</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Emission Breakdown Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Emissions Breakdown</h4>
            <p className="text-slate-400 text-xxs mt-0.5">Distribution of greenhouse inputs across major categories.</p>
          </div>

          <div className="h-64 my-4 flex items-center justify-center relative">
            {breakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.key] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => [`${val.toFixed(1)} kg CO₂`, "Emissions"]}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No emissions logged yet.</div>
            )}
            
            {/* Center score display */}
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-xxs font-extrabold text-slate-400 block uppercase">Log Total</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{currentCO2}</span>
              <span className="text-slate-400 text-xxs block">kg CO₂</span>
            </div>
          </div>

          {/* Color Indicators Legend */}
          <div className="space-y-1.5 border-t border-slate-50 pt-3">
            {breakdownData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.key] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-700">
                  {item.value.toFixed(0)} kg ({Math.round((item.value / currentCO2) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Comparison Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Goal Comparison</h4>
            <p className="text-slate-400 text-xxs mt-0.5">Current habit volume side-by-side with profile goal targets.</p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  formatter={(val: number) => [`${val} kg CO₂`, "Limit"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={45}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xxs text-slate-500 leading-normal">
            <span className="font-bold text-slate-700 block mb-0.5">Analysis Rating</span>
            {currentCO2 <= targetCO2 ? (
              <span>Fantastic! You operate <strong className="text-emerald-700">{(targetCO2 - currentCO2).toFixed(0)} kg CO₂ below</strong> your monthly threshold. Keep it up.</span>
            ) : (
              <span>Your habits currently produce <strong className="text-rose-600">{(currentCO2 - targetCO2).toFixed(0)} kg CO₂ extra</strong>. We recommend consulting the AI Advisor for instant reduction plans.</span>
            )}
          </div>
        </div>

        {/* Trend Projections Area Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">12-Month Forecast Trend</h4>
            <p className="text-slate-400 text-xxs mt-0.5">Emissions roadmap assuming adoption of target habits.</p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionItems} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  formatter={(val: number) => [`${val} kg CO₂`, "Projected"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="projected" stroke="#0ea5e9" strokeWidth={2} fill="rgba(14, 165, 233, 0.08)" name="Projected Footprint" />
                <Area type="monotone" dataKey="target" stroke="#047857" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target Cap" />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xxs text-slate-500 leading-normal">
            <span className="font-bold text-slate-700 block mb-0.5">Forecast Method</span>
            Paced compounding model. Slashes carbon metrics incrementally each month to model behavioral transition.
          </div>
        </div>

      </div>

      {/* 4. RECOMMENDED ACTIONS - SUMMARY SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Immediate Action Agenda</h4>
            <p className="text-slate-500 text-xs mt-0.5">High-scoring opportunities curated to achieve maximum reduction impact.</p>
          </div>
          <button
            onClick={() => onNavigateToTab("advisor")}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 transition cursor-pointer"
          >
            Open AI Recommendations <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedActions.map((rec) => (
            <div key={rec.title} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-100/70 hover:bg-emerald-50/5/10 transition flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xxs font-extrabold px-2 py-0.5 rounded uppercase ${
                    rec.category === "energy"
                      ? "bg-amber-100 text-amber-800"
                      : rec.category === "transport"
                      ? "bg-sky-100 text-sky-850"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {rec.category}
                  </span>
                  <span className="text-xxs font-mono text-slate-400 font-bold">Impact Score: {rec.impactScore}</span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm">{rec.title}</h5>
                <p className="text-slate-500 text-xs leading-normal">{rec.description}</p>
              </div>

              <div className="flex justify-between items-center text-xxs font-semibold mt-4 pt-3 border-t border-slate-50 text-slate-400">
                <span>Saving: <strong className="text-emerald-800 font-mono font-bold">-{rec.carbonReduction} kg/mo</strong></span>
                <span>{rec.feasibility} / {rec.costEffectiveness}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
