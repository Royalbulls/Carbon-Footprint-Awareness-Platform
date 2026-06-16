import React, { useState, useEffect } from "react";
import { 
  ElectricityInput, 
  TransportInput, 
  WasteInput, 
  WaterInput, 
  FlightInput,
  CarbonResult 
} from "../types";
import { calculateFootprint } from "../utils";
import { 
  Zap, 
  Car, 
  Trash2, 
  GlassWater, 
  RefreshCw, 
  Scale, 
  HelpCircle,
  TrendingDown,
  Info
} from "lucide-react";

interface CalculatorTabProps {
  onCalculate: (data: {
    electricity: ElectricityInput;
    transport: TransportInput;
    waste: WasteInput;
    water: WaterInput;
    flights: FlightInput;
    results: CarbonResult;
    month: string;
  }) => void;
  initialElectricity?: ElectricityInput;
  initialTransport?: TransportInput;
  initialWaste?: WasteInput;
  initialWater?: WaterInput;
  initialFlights?: FlightInput;
}

type SubCategory = "electricity" | "transport" | "waste" | "water_flights";

export default function CalculatorTab({
  onCalculate,
  initialElectricity,
  initialTransport,
  initialWaste,
  initialWater,
  initialFlights
}: CalculatorTabProps) {
  // Subtab navigation
  const [activeSubTab, setActiveSubTab] = useState<SubCategory>("electricity");

  // State Management
  const [month, setMonth] = useState(() => {
    const d = new Date();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${monthStr}`;
  });

  // 1. Electricity Inputs
  const [monthlyKWh, setMonthlyKWh] = useState(initialElectricity?.monthlyKWh ?? 380);

  // 2. Transport Inputs
  const [carDistance, setCarDistance] = useState(initialTransport?.carDistance ?? 600);
  const [motorcycleDistance, setMotorcycleDistance] = useState(initialTransport?.motorcycleDistance ?? 0);
  const [busDistance, setBusDistance] = useState(initialTransport?.busDistance ?? 80);
  const [trainDistance, setTrainDistance] = useState(initialTransport?.trainDistance ?? 100);
  const [metroDistance, setMetroDistance] = useState(initialTransport?.metroDistance ?? 50);
  const [bicycleDistance, setBicycleDistance] = useState(initialTransport?.bicycleDistance ?? 30);
  const [walkingDistance, setWalkingDistance] = useState(initialTransport?.walkingDistance ?? 20);
  const [flightDistance, setFlightDistance] = useState(initialTransport?.flightDistance ?? 0);

  // 3. Waste Inputs
  const [plasticKg, setPlasticKg] = useState(initialWaste?.plasticKg ?? 12);
  const [paperKg, setPaperKg] = useState(initialWaste?.paperKg ?? 8);
  const [glassKg, setGlassKg] = useState(initialWaste?.glassKg ?? 6);
  const [metalKg, setMetalKg] = useState(initialWaste?.metalKg ?? 4);
  const [organicKg, setOrganicKg] = useState(initialWaste?.organicKg ?? 15);
  const [recycledPercentage, setRecycledPercentage] = useState(initialWaste?.recycledPercentage ?? 35);

  // 4. Water & Flights Inputs
  const [monthlyLiters, setMonthlyLiters] = useState(initialWater?.monthlyLiters ?? 6000);
  const [shortTrips, setShortTrips] = useState(initialFlights?.shortTrips ?? 0);
  const [mediumTrips, setMediumTrips] = useState(initialFlights?.mediumTrips ?? 0);
  const [longTrips, setLongTrips] = useState(initialFlights?.longTrips ?? 0);

  // Local state to display real-time calculated CO2 output
  const [runningTotals, setRunningTotals] = useState<CarbonResult | null>(null);

  // Trigger recalculation on input adjustments
  useEffect(() => {
    const elec: ElectricityInput = { monthlyKWh };
    const trans: TransportInput = { 
      carDistance, motorcycleDistance, busDistance, trainDistance, 
      metroDistance, bicycleDistance, walkingDistance, flightDistance 
    };
    const wst: WasteInput = { plasticKg, paperKg, glassKg, metalKg, organicKg, recycledPercentage };
    const wtr: WaterInput = { monthlyLiters };
    const flt: FlightInput = { shortTrips, mediumTrips, longTrips };

    const calculated = calculateFootprint(elec, trans, wst, wtr, flt);
    setRunningTotals(calculated);
  }, [
    monthlyKWh, carDistance, motorcycleDistance, busDistance, trainDistance,
    metroDistance, bicycleDistance, walkingDistance, flightDistance,
    plasticKg, paperKg, glassKg, metalKg, organicKg, recycledPercentage,
    monthlyLiters, shortTrips, mediumTrips, longTrips
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runningTotals) return;

    onCalculate({
      electricity: { monthlyKWh },
      transport: { 
        carDistance, motorcycleDistance, busDistance, trainDistance, 
        metroDistance, bicycleDistance, walkingDistance, flightDistance 
      },
      waste: { plasticKg, paperKg, glassKg, metalKg, organicKg, recycledPercentage },
      water: { monthlyLiters },
      flights: { shortTrips, mediumTrips, longTrips },
      results: runningTotals,
      month
    });
  };

  const currentMonthDisplay = () => {
    try {
      const [year, m] = month.split("-");
      const date = new Date(Number(year), Number(m) - 1, 1);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return month;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
      {/* Dynamic Input Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Emissions Calculator</h3>
              <p className="text-slate-500 text-sm mt-0.5">Input your utility metrics to track and forecast your environmental footprint.</p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="log-month-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">Tracking Month:</label>
              <input
                id="log-month-select"
                type="month"
                required
                className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 mb-6 overflow-x-auto gap-1">
            <button
              id="calc-subtab-electricity"
              type="button"
              onClick={() => setActiveSubTab("electricity")}
              className={`py-2 px-4 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-1.5 focus:outline-none ${
                activeSubTab === "electricity"
                  ? "border-b-2 border-emerald-700 text-emerald-800 bg-emerald-50/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Zap size={14} /> Electricity
            </button>
            <button
              id="calc-subtab-transport"
              type="button"
              onClick={() => setActiveSubTab("transport")}
              className={`py-2 px-4 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-1.5 focus:outline-none ${
                activeSubTab === "transport"
                  ? "border-b-2 border-emerald-700 text-emerald-800 bg-emerald-50/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Car size={14} /> Commutes
            </button>
            <button
              id="calc-subtab-waste"
              type="button"
              onClick={() => setActiveSubTab("waste")}
              className={`py-2 px-4 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-1.5 focus:outline-none ${
                activeSubTab === "waste"
                  ? "border-b-2 border-emerald-700 text-emerald-800 bg-emerald-50/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Trash2 size={14} /> Waste
            </button>
            <button
              id="calc-subtab-water"
              type="button"
              onClick={() => setActiveSubTab("water_flights")}
              className={`py-2 px-4 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-1.5 focus:outline-none ${
                activeSubTab === "water_flights"
                  ? "border-b-2 border-emerald-700 text-emerald-800 bg-emerald-50/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <GlassWater size={14} /> Water & Trips
            </button>
          </div>

          {/* Subtab Contents */}
          <div className="space-y-6 min-h-[300px]">
            {/* ELECTRICITY TAB */}
            {activeSubTab === "electricity" && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-xl">
                  <div className="flex gap-2 text-emerald-900 text-xs font-semibold leading-relaxed">
                    <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p>Your electricity consumption is scaled against our coefficient of <strong className="font-mono">0.417 kg CO₂ per kWh</strong>.</p>
                      <p className="text-emerald-800 font-normal mt-0.5">Reducing grid energy or harvesting home solar is the fastest way to drop emissions.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <label id="lbl-electricity-KWh" className="font-semibold text-slate-700 flex items-center gap-1 outline-none">
                      Monthly Electricity Usage
                    </label>
                    <span className="font-mono font-bold text-emerald-800 text-base">{monthlyKWh} kWh</span>
                  </div>
                  <input
                    id="input-electricity-KWh"
                    type="range"
                    min="0"
                    max="1500"
                    step="10"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={monthlyKWh}
                    onChange={(e) => setMonthlyKWh(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-slate-400 text-xs font-mono">
                    <span>0 kWh</span>
                    <span>500 kWh</span>
                    <span>1,000 kWh</span>
                    <span>1,500 kWh</span>
                  </div>
                </div>

                {/* Grid energy quick stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <span className="text-slate-400 text-xs font-semibold uppercase block">Carbon Estimate</span>
                    <span className="text-lg font-bold text-slate-800 font-mono mt-1 block">{(monthlyKWh * 0.417).toFixed(1)} kg CO₂</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <span className="text-slate-400 text-xs font-semibold uppercase block">Estimated Utility Cost</span>
                    <span className="text-lg font-bold text-slate-800 font-mono mt-1 block">${(monthlyKWh * 0.16).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* COMMUTES TAB */}
            {activeSubTab === "transport" && (
              <div className="space-y-5">
                <p className="text-slate-500 text-xs">Specify estimated monthly transit distances in kilometers for matching modes of travel.</p>
                
                {/* Car */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-medium text-slate-700 flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 rounded px-2 py-0.5 text-xs font-mono">0.192 CO₂/km</span> Passenger Car Distance
                    </label>
                    <span className="font-mono font-semibold text-slate-800 text-sm">{carDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="50"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={carDistance}
                    onChange={(e) => setCarDistance(Number(e.target.value))}
                  />
                </div>

                {/* Motorcycle */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-medium text-slate-700 flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 rounded px-2 py-0.5 text-xs font-mono">0.113 CO₂/km</span> Motorcycle Distance
                    </label>
                    <span className="font-mono font-semibold text-slate-800 text-sm">{motorcycleDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="20"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={motorcycleDistance}
                    onChange={(e) => setMotorcycleDistance(Number(e.target.value))}
                  />
                </div>

                {/* Bus and Public commute */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Bus commuting distance</label>
                      <span className="font-mono font-semibold text-slate-800">{busDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={busDistance}
                      onChange={(e) => setBusDistance(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Train commuter rail distance</label>
                      <span className="font-mono font-semibold text-slate-800">{trainDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      step="20"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={trainDistance}
                      onChange={(e) => setTrainDistance(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Metro & Flights Override */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Metro / Subway</label>
                      <span className="font-mono font-semibold text-slate-800">{metroDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="800"
                      step="10"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={metroDistance}
                      onChange={(e) => setMetroDistance(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Bicycle commuter</label>
                      <span className="font-mono font-semibold text-slate-800">{bicycleDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={bicycleDistance}
                      onChange={(e) => setBicycleDistance(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Walking / Foot</label>
                      <span className="font-mono font-semibold text-slate-800">{walkingDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={walkingDistance}
                      onChange={(e) => setWalkingDistance(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WASTE TAB */}
            {activeSubTab === "waste" && (
              <div className="space-y-5">
                <p className="text-slate-500 text-xs">Log approximate monthly weights for major home solid waste garbage categories in kilograms.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plastic */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700 flex items-center gap-1.5">
                        Plastic Waste
                      </label>
                      <span className="font-mono font-semibold text-slate-800">{plasticKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="1"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={plasticKg}
                      onChange={(e) => setPlasticKg(Number(e.target.value))}
                    />
                  </div>

                  {/* Paper */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Paper & Cardboard</label>
                      <span className="font-mono font-semibold text-slate-800">{paperKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="1"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={paperKg}
                      onChange={(e) => setPaperKg(Number(e.target.value))}
                    />
                  </div>

                  {/* Glass */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Glass Jars/Bottles</label>
                      <span className="font-mono font-semibold text-slate-800">{glassKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={glassKg}
                      onChange={(e) => setGlassKg(Number(e.target.value))}
                    />
                  </div>

                  {/* Metal */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-700">Cans & Foil Metal</label>
                      <span className="font-mono font-semibold text-slate-800">{metalKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      className="w-full accent-emerald-700 cursor-pointer"
                      value={metalKg}
                      onChange={(e) => setMetalKg(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Organic waste */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-medium text-slate-700">Organic Food Scraps & Green clippings</label>
                    <span className="font-mono font-semibold text-slate-800">{organicKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={organicKg}
                    onChange={(e) => setOrganicKg(Number(e.target.value))}
                  />
                </div>

                {/* Recycling Rate slider */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <RefreshCw size={14} className="text-emerald-700 animate-spin-slow" /> Overall Recycling & Composting Portion
                    </label>
                    <span className="font-mono font-bold text-emerald-800">{recycledPercentage}% recycled</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={recycledPercentage}
                    onChange={(e) => setRecycledPercentage(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-slate-400 text-xxs font-mono">
                    <span>0% (Landfill all)</span>
                    <span>50% (Eco Active)</span>
                    <span>100% (Zero Waste Goal)</span>
                  </div>
                </div>
              </div>
            )}

            {/* WATER & FLIGHTS TAB */}
            {activeSubTab === "water_flights" && (
              <div className="space-y-6">
                <p className="text-slate-500 text-xs">Provide details for monthly water utilities and annual air travel frequencies.</p>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      Monthly Water Consumption
                    </label>
                    <span className="font-mono font-bold text-emerald-800">{monthlyLiters} Liters ({ (monthlyLiters/1000).toFixed(1) } m³)</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="250"
                    className="w-full accent-emerald-700 cursor-pointer"
                    value={monthlyLiters}
                    onChange={(e) => setMonthlyLiters(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-slate-400 text-xxs font-mono">
                    <span>500 L</span>
                    <span>10,000 L</span>
                    <span>20,000 L</span>
                  </div>
                  <p className="text-slate-400 text-xxs leading-normal">Covers hot/cold tap, plumbing, yard sprinklers, cooking. Estimated at 0.00030 kg CO₂ per Liter.</p>
                </div>

                {/* Flights trips */}
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Air Commute Count (Trips/Month)</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Short Flight */}
                    <div className="bg-slate-50 p-4 rounded-xl relative">
                      <label className="text-xs font-semibold text-slate-600 block">Short Trips (&lt; 3h)</label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setShortTrips(Math.max(0, shortTrips - 1))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-sm text-slate-800">{shortTrips}</span>
                        <button
                          type="button"
                          onClick={() => setShortTrips(shortTrips + 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-slate-400 text-xxs font-mono mt-1 block">Est. 800 km each</span>
                    </div>

                    {/* Medium Flight */}
                    <div className="bg-slate-50 p-4 rounded-xl relative">
                      <label className="text-xs font-semibold text-slate-600 block">Medium Trips (3h-6h)</label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setMediumTrips(Math.max(0, mediumTrips - 1))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-sm text-slate-800">{mediumTrips}</span>
                        <button
                          type="button"
                          onClick={() => setMediumTrips(mediumTrips + 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-slate-400 text-xxs font-mono mt-1 block">Est. 2,500 km each</span>
                    </div>

                    {/* Long Flight */}
                    <div className="bg-slate-50 p-4 rounded-xl relative">
                      <label className="text-xs font-semibold text-slate-600 block">Long Trips (&gt; 6h)</label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setLongTrips(Math.max(0, longTrips - 1))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-sm text-slate-800">{longTrips}</span>
                        <button
                          type="button"
                          onClick={() => setLongTrips(longTrips + 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 text-slate-600 select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-slate-400 text-xxs font-mono mt-1 block">Est. 7,500 km each</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculate Trigger */}
        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end">
          <button
            id="calculate-footprint-submit"
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-sm rounded-xl hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-700 outline-none"
          >
            <TrendingDown size={15} /> Log monthly {currentMonthDisplay()} CO₂ emissions
          </button>
        </div>
      </form>

      {/* Dynamic Results Sidebar Summary */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Live Calculations</span>
          <h4 className="text-lg font-bold text-slate-900 mt-1 mb-4">Carbon Estimates</h4>

          {/* Large total and gauge */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 text-center relative shadow-sm">
            <span className="text-slate-400 text-xs font-bold uppercase block">Monthly Total Equivalent</span>
            <span className="text-3xl font-extrabold text-emerald-800 font-mono mt-1.5 block">
              {runningTotals ? runningTotals.monthlyCO2.toLocaleString() : "..."} <span className="text-xs font-bold font-sans text-slate-500">kg CO₂</span>
            </span>

            {/* Score rating marker */}
            <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-slate-50 pt-3">
              <span className="text-xxs font-bold uppercase text-slate-400">Sustainability Rating:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                runningTotals && runningTotals.sustainabilityScore >= 75
                  ? "bg-emerald-100 text-emerald-800"
                  : runningTotals && runningTotals.sustainabilityScore >= 45
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {runningTotals ? `${runningTotals.sustainabilityScore}/100` : "..."}
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="mt-6 space-y-3.5">
            {/* Electricity */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold flex items-center gap-1.5"><Zap size={11} className="text-yellow-500" /> Utility Electricity</span>
                <span className="font-mono font-bold text-slate-700">{runningTotals?.categoryBreakdown?.electricity ?? 0} kg</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full" 
                  style={{ width: `${runningTotals ? Math.min(100, (runningTotals.categoryBreakdown.electricity / Math.max(1, runningTotals.monthlyCO2)) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Commuting distance */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold flex items-center gap-1.5"><Car size={11} className="text-sky-500" /> Commuting Travel</span>
                <span className="font-mono font-bold text-slate-700">{(runningTotals ? runningTotals.categoryBreakdown.transport : 0)} kg</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full" 
                  style={{ width: `${runningTotals ? Math.min(100, (runningTotals.categoryBreakdown.transport / Math.max(1, runningTotals.monthlyCO2)) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Solid waste */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold flex items-center gap-1.5"><Trash2 size={11} className="text-purple-500" /> Landfilled Waste</span>
                <span className="font-mono font-bold text-slate-700">{runningTotals?.categoryBreakdown?.waste ?? 0} kg</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${runningTotals ? Math.min(100, (runningTotals.categoryBreakdown.waste / Math.max(1, runningTotals.monthlyCO2)) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Water and utilities */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold flex items-center gap-1.5"><GlassWater size={11} className="text-emerald-500" /> Water loading</span>
                <span className="font-mono font-bold text-slate-700">{runningTotals?.categoryBreakdown?.water ?? 0} kg</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${runningTotals ? Math.min(100, (runningTotals.categoryBreakdown.water / Math.max(1, runningTotals.monthlyCO2)) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informative quick highlight box */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs text-slate-500 mt-6 leading-relaxed">
          <p className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <Info size={13} className="text-emerald-700" /> Annual Projection
          </p>
          Your current habits correspond to a yearly volume of about{" "}
          <strong className="font-mono text-slate-800">
            {runningTotals ? (runningTotals.yearlyCO2 / 1000).toFixed(1) : "..."} tons CO₂
          </strong>
          . The safe net-zero ceiling is 2.0 tons per person.
        </div>
      </div>
    </div>
  );
}
