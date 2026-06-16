import React, { useState, useEffect } from "react";
import { UserProfile, CalculationLog, CarbonResult } from "./types";
import { calculateFootprint } from "./utils";
import UserProfileForm from "./components/UserProfileForm";
import CalculatorTab from "./components/CalculatorTab";
import ProgressDashboard from "./components/ProgressDashboard";
import AiAdvisorTab from "./components/AiAdvisorTab";
import ReportsTab from "./components/ReportsTab";
import EducationalCenter from "./components/EducationalCenter";
import { 
  Leaf, 
  LayoutDashboard, 
  Calculator, 
  Sparkles, 
  FileText, 
  BookOpen, 
  User, 
  Users,
  Globe,
  Plus
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // 1. Initial State: Profile Configuration
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("carbon_user_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: "user-1",
      name: "Robin Green",
      email: "royalbullsandvisory412@gmail.com",
      householdSize: 2,
      country: "US",
      sustainabilityGoal: "medium",
      targetCO2: 500
    };
  });

  // 2. Initial State: History logs
  const [logs, setLogs] = useState<CalculationLog[]>(() => {
    const saved = localStorage.getItem("carbon_calculation_logs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    // Default preloaded log for May 2026 to ensure dashboard immediately looks beautiful & filled
    const defaultElec = { monthlyKWh: 350 };
    const defaultTrans = {
      carDistance: 500,
      motorcycleDistance: 0,
      busDistance: 120,
      trainDistance: 80,
      metroDistance: 40,
      bicycleDistance: 40,
      walkingDistance: 20,
      flightDistance: 0
    };
    const defaultWaste = { plasticKg: 10, paperKg: 8, glassKg: 6, metalKg: 3, organicKg: 12, recycledPercentage: 30 };
    const defaultWater = { monthlyLiters: 5500 };
    const defaultFlights = { shortTrips: 0, mediumTrips: 0, longTrips: 0 };
    const defaultResults = calculateFootprint(defaultElec, defaultTrans, defaultWaste, defaultWater, defaultFlights);

    return [
      {
        id: "log-prefilled",
        month: "2026-05",
        createdAt: new Date(22026, 4, 15).toISOString(),
        electricity: defaultElec,
        transport: defaultTrans,
        waste: defaultWaste,
        water: defaultWater,
        flights: defaultFlights,
        results: defaultResults
      }
    ];
  });

  // Keep latest log as standard active results
  const [latestResults, setLatestResults] = useState<CarbonResult | null>(() => {
    if (logs.length > 0) {
      // Sort to find the latest month
      const sorted = [...logs].sort((a,b) => b.month.localeCompare(a.month));
      return sorted[0].results;
    }
    return null;
  });

  // Synchronize localStorage on states updating
  useEffect(() => {
    localStorage.setItem("carbon_user_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("carbon_calculation_logs", JSON.stringify(logs));
    if (logs.length > 0) {
      const sorted = [...logs].sort((a,b) => b.month.localeCompare(a.month));
      setLatestResults(sorted[0].results);
    } else {
      setLatestResults(null);
    }
  }, [logs]);

  // Handle calculator log submissions
  const handleLogCalculation = (payload: {
    electricity: any;
    transport: any;
    waste: any;
    water: any;
    flights: any;
    results: CarbonResult;
    month: string;
  }) => {
    const existingIndex = logs.findIndex(l => l.month === payload.month);
    
    const newLog: CalculationLog = {
      id: existingIndex !== -1 ? logs[existingIndex].id : `log-${Date.now()}`,
      month: payload.month,
      createdAt: new Date().toISOString(),
      electricity: payload.electricity,
      transport: payload.transport,
      waste: payload.waste,
      water: payload.water,
      flights: payload.flights,
      results: payload.results
    };

    if (existingIndex !== -1) {
      // Overwrite existing month log
      const updated = [...logs];
      updated[existingIndex] = newLog;
      setLogs(updated);
    } else {
      // Add new log
      setLogs([...logs, newLog]);
    }

    // Direct navigate back to dashboard to celebrate success
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans transition-all selection:bg-emerald-200">
      
      {/* 1. TOP INTERACTIVE BRAND NAVBAR */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo Group */}
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-800 text-white p-2 rounded-xl flex items-center justify-center shadow-inner hover:rotate-12 transition">
                <Leaf size={18} className="fill-emerald-100/10" />
              </div>
              <div className="text-left">
                <h1 className="text-sm md:text-base font-black text-slate-900 tracking-tight font-sans">
                  Carbon Awareness Platform
                </h1>
                <p className="text-xxs font-bold text-slate-400 select-none uppercase tracking-wide">
                  Calculate • Reduce • Sustain
                </p>
              </div>
            </div>

            {/* Quick user badge display */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xxs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 border border-emerald-100/40 rounded-full">
                <Globe size={11} /> {profile.country} Base
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 block shrink-0" />
                <Users size={11} /> Size: {profile.householdSize}
              </div>

              <button
                id="header-nav-profile-button"
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/60 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition select-none outline-none"
              >
                <User size={13} /> {profile.name || "Manage"}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. TAB NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-4 py-3 select-none">
            {/* Dashboard tab */}
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 pb-1 px-2 text-xs md:text-sm font-semibold transition whitespace-nowrap outline-none cursor-pointer ${
                activeTab === "dashboard"
                  ? "border-b-2 border-emerald-800 text-emerald-800 font-bold"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard size={15} /> Progress Dashboard
            </button>

            {/* Calculator tab */}
            <button
              id="nav-tab-calculator"
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-1.5 pb-1 px-2 text-xs md:text-sm font-semibold transition whitespace-nowrap outline-none cursor-pointer ${
                activeTab === "calculator"
                  ? "border-b-2 border-emerald-800 text-emerald-800 font-bold"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <Calculator size={15} /> Emissions Calculator
            </button>

            {/* AI Advisor tab */}
            <button
              id="nav-tab-advisor"
              onClick={() => setActiveTab("advisor")}
              className={`flex items-center gap-1.5 pb-1 px-2 text-xs md:text-sm font-semibold transition whitespace-nowrap outline-none cursor-pointer ${
                activeTab === "advisor"
                  ? "border-b-2 border-emerald-800 text-emerald-800 font-bold"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <Sparkles size={15} /> AI Sustainability Advisor
            </button>

            {/* Reports tab */}
            <button
              id="nav-tab-reports"
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-1.5 pb-1 px-2 text-xs md:text-sm font-semibold transition whitespace-nowrap outline-none cursor-pointer ${
                activeTab === "reports"
                  ? "border-b-2 border-emerald-800 text-emerald-800 font-bold"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <FileText size={15} /> Sustainability Reports
            </button>

            {/* Educational center tab */}
            <button
              id="nav-tab-education"
              onClick={() => setActiveTab("education")}
              className={`flex items-center gap-1.5 pb-1 px-2 text-xs md:text-sm font-semibold transition whitespace-nowrap outline-none cursor-pointer ${
                activeTab === "education"
                  ? "border-b-2 border-emerald-800 text-emerald-800 font-bold"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <BookOpen size={15} /> Awareness Education
            </button>
          </div>
        </div>
      </nav>

      {/* 3. CORE ROUTING RENDERING WINDOW */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "dashboard" && (
          <ProgressDashboard 
            profile={profile} 
            latestResults={latestResults} 
            logs={logs} 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
          />
        )}

        {activeTab === "calculator" && (
          <CalculatorTab 
            onCalculate={handleLogCalculation}
            initialElectricity={logs.length > 0 ? logs[logs.length-1].electricity : undefined}
            initialTransport={logs.length > 0 ? logs[logs.length-1].transport : undefined}
            initialWaste={logs.length > 0 ? logs[logs.length-1].waste : undefined}
            initialWater={logs.length > 0 ? logs[logs.length-1].water : undefined}
            initialFlights={logs.length > 0 ? logs[logs.length-1].flights : undefined}
          />
        )}

        {activeTab === "advisor" && (
          <AiAdvisorTab 
            profile={profile} 
            results={latestResults} 
            logs={logs} 
          />
        )}

        {activeTab === "reports" && (
          <ReportsTab 
            profile={profile} 
            results={latestResults} 
            logs={logs} 
          />
        )}

        {activeTab === "education" && (
          <EducationalCenter />
        )}

        {activeTab === "profile" && (
          <UserProfileForm 
            profile={profile} 
            onChange={(updated) => {
              setProfile(updated);
              setActiveTab("dashboard");
            }} 
          />
        )}
      </main>

      {/* 4. ACCESSIBLE BOTTOM FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 select-none print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-400 font-medium font-sans">
            Carbon Footprint Awareness Platform • Made under WCAG 2.1 AA accessibility guidelines
          </p>
          <div className="flex justify-center flex-wrap gap-4 text-xxs font-bold uppercase tracking-wider text-slate-400">
            <span>Privately cached in sandbox</span>
            <span>•</span>
            <span>Real-time math coefficients</span>
            <span>•</span>
            <span>Secure Server-side AI Advisor</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
