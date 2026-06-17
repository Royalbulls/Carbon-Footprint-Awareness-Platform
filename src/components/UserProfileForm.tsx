import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Globe, Users, Target, Check, AlertCircle } from "lucide-react";

interface UserProfileFormProps {
  profile: UserProfile;
  onChange: (updatedProfile: UserProfile) => void;
}

const COUNTRIES = [
  { code: "US", name: "United States (Avg: ~1,350 kg/mo)", avg: 1350 },
  { code: "CA", name: "Canada (Avg: ~1,200 kg/mo)", avg: 1200 },
  { code: "AU", name: "Australia (Avg: ~1,250 kg/mo)", avg: 1250 },
  { code: "UK", name: "United Kingdom (Avg: ~480 kg/mo)", avg: 480 },
  { code: "DE", name: "Germany (Avg: ~650 kg/mo)", avg: 650 },
  { code: "FR", name: "France (Avg: ~380 kg/mo)", avg: 380 },
  { code: "IN", name: "India (Avg: ~140 kg/mo)", avg: 140 },
  { code: "BR", name: "Brazil (Avg: ~180 kg/mo)", avg: 180 },
  { code: "OTHER", name: "Other / Worldwide Average (~390 kg/mo)", avg: 390 }
];

export default function UserProfileForm({ profile, onChange }: UserProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [country, setCountry] = useState(profile.country);
  const [householdSize, setHouseholdSize] = useState(profile.householdSize);
  const [sustainabilityGoal, setSustainabilityGoal] = useState<"low" | "medium" | "aggressive">(profile.sustainabilityGoal);
  const [targetCO2, setTargetCO2] = useState(profile.targetCO2);
  const [saved, setSaved] = useState(false);

  const handleGoalChange = (goal: "low" | "medium" | "aggressive") => {
    setSustainabilityGoal(goal);
    // Set realistic default thresholds in kg/month based on goals
    let defaultTarget = 600;
    if (goal === "low") defaultTarget = 900;
    if (goal === "aggressive") defaultTarget = 350;
    setTargetCO2(defaultTarget);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      id: profile.id,
      name,
      email: profile.email,
      householdSize,
      country,
      sustainabilityGoal,
      targetCO2
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div id="user-profile-card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-800">
      <div className="bg-emerald-800 p-6 text-white">
        <h3 className="text-xl font-semibold font-sans tracking-tight">Sustainability Profile</h3>
        <p className="text-emerald-100 text-sm mt-1">Configure your household baselines and target emission thresholds to drive custom scoring models.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div className="space-y-1">
            <label htmlFor="profile-name-input" className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-emerald-700" aria-hidden="true" /> Full Name / Alias
            </label>
            <input
              id="profile-name-input"
              type="text"
              required
              aria-describedby="profile-name-desc"
              className="w-full text-sm border border-slate-300 bg-white outline-none rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition"
              placeholder="e.g. Robin Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p id="profile-name-desc" className="text-slate-550 text-xs mt-1">Customizes display greetings throughout the platform interface.</p>
          </div>

          {/* Country Selection */}
          <div className="space-y-1">
            <label htmlFor="profile-country-select" className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={13} className="text-emerald-700" aria-hidden="true" /> Primary Country of Residence
            </label>
            <select
              id="profile-country-select"
              aria-describedby="profile-country-desc"
              className="w-full text-sm border border-slate-300 bg-white outline-none rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <p id="profile-country-desc" className="text-slate-550 text-xs mt-1">Configures carbon emission coefficient factors for your territory.</p>
          </div>

          {/* Household size */}
          <div className="space-y-1">
            <label htmlFor="profile-household-range" className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={13} className="text-emerald-700" aria-hidden="true" /> Household Cohabitants
            </label>
            <div className="flex items-center gap-4 py-2">
              <input
                id="profile-household-range"
                type="range"
                min="1"
                max="10"
                step="1"
                aria-describedby="profile-household-desc"
                aria-label="Household size cohabitants slider"
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={householdSize}
                aria-valuetext={householdSize === 1 ? "1 person (Single)" : `${householdSize} persons`}
                className="w-full h-2 accent-emerald-800 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
              />
              <span className="text-sm font-bold bg-slate-100 rounded-md px-3 py-1 text-slate-800 whitespace-nowrap">
                {householdSize === 1 ? "1 (Single)" : `${householdSize} persons`}
              </span>
            </div>
            <p id="profile-household-desc" className="text-slate-550 text-xs text-left">We share electricity, heating, and landfill burdens across the entire household size.</p>
          </div>

          {/* Target custom Monthly emissions */}
          <div className="space-y-1">
            <label htmlFor="profile-target-input" className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
              <Target size={13} className="text-emerald-700" aria-hidden="true" /> Custom Monthly Target CO₂ (kg)
            </label>
            <div className="relative">
              <input
                id="profile-target-input"
                type="number"
                min="50"
                max="5000"
                aria-describedby="profile-target-desc"
                className="w-full text-sm border border-slate-300 bg-white outline-none rounded-lg py-2.5 pl-3 pr-16 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition font-mono font-medium"
                value={targetCO2}
                onChange={(e) => setTargetCO2(Number(e.target.value))}
              />
              <span className="absolute right-3 top-2.5 text-slate-600 text-xs font-mono select-none">kg CO2</span>
            </div>
            <p id="profile-target-desc" className="text-slate-550 text-xs">Standard threshold used in progress trackers and goal-attainment forecasts.</p>
          </div>
        </div>

        {/* Sustainability Goal Selector Buttons */}
        <div className="space-y-2 mt-2">
          <label className="text-xs font-bold text-slate-750 uppercase tracking-wider block">
            Carbon Reduction Rigor / Pace
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="group" aria-label="Reduction pace selector">
            {/* Low Goal */}
            <button
              id="goal-btn-low"
              type="button"
              onClick={() => handleGoalChange("low")}
              aria-pressed={sustainabilityGoal === "low"}
              aria-label="Set sustainability goal to Low Reduction, drops baseline by 1 percent monthly"
              className={`text-left p-4 rounded-xl border text-sm transition focus:ring-2 focus:ring-emerald-700 outline-none cursor-pointer ${
                sustainabilityGoal === "low"
                  ? "border-emerald-850 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-800"
                  : "border-slate-300 hover:border-slate-400 text-slate-700 bg-white"
              }`}
            >
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                Low Reduction
                {sustainabilityGoal === "low" && <Check size={14} aria-hidden="true" />}
              </div>
              <p className="text-slate-650 text-xs mt-1">Easiest pacing. Drops baseline by 1% monthly. Focuses on simple, zero-cost adjustments.</p>
            </button>

            {/* Medium Goal */}
            <button
              id="goal-btn-medium"
              type="button"
              onClick={() => handleGoalChange("medium")}
              aria-pressed={sustainabilityGoal === "medium"}
              aria-label="Set sustainability goal to Moderate Reduction, drops baseline by 2.5 percent monthly"
              className={`text-left p-4 rounded-xl border text-sm transition focus:ring-2 focus:ring-emerald-700 outline-none cursor-pointer ${
                sustainabilityGoal === "medium"
                  ? "border-emerald-850 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-800"
                  : "border-slate-300 hover:border-slate-400 text-slate-700 bg-white"
              }`}
            >
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                Moderate reduction
                {sustainabilityGoal === "medium" && <Check size={14} aria-hidden="true" />}
              </div>
              <p className="text-slate-655 text-xs mt-1">Standard target. Reduces baseline footprint by 2.5% monthly. Pragmatic balanced actions.</p>
            </button>

            {/* Aggressive Goal */}
            <button
              id="goal-btn-aggressive"
              type="button"
              onClick={() => handleGoalChange("aggressive")}
              aria-pressed={sustainabilityGoal === "aggressive"}
              aria-label="Set sustainability goal to Aggressive, drops baseline by 4 percent monthly and targets Net Zero"
              className={`text-left p-4 rounded-xl border text-sm transition focus:ring-2 focus:ring-emerald-700 outline-none cursor-pointer ${
                sustainabilityGoal === "aggressive"
                  ? "border-emerald-850 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-800"
                  : "border-slate-300 hover:border-slate-400 text-slate-700 bg-white"
              }`}
            >
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                Aggressive (Net-Zero Leader)
                {sustainabilityGoal === "aggressive" && <Check size={14} aria-hidden="true" />}
              </div>
              <p className="text-slate-655 text-xs mt-1">Highest dedication. Decreases emissions by 4.0% monthly. Adopts major investments like solar energy.</p>
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-150">
          <div className="flex items-start gap-2 text-slate-600 text-xs max-w-md">
            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>Your profile data is kept strictly private and cached only in your local browser sandbox.</p>
          </div>

          <button
            id="profile-save-button"
            type="submit"
            aria-label="Save current sustainability preferences to local cache"
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            {saved ? "Profile Preferences Saved!" : "Save Profile Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
