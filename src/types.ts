export interface UserProfile {
  id: string;
  name: string;
  email: string;
  householdSize: number;
  country: string;
  sustainabilityGoal: "low" | "medium" | "aggressive";
  targetCO2: number; // custom monthly threshold (kg)
}

export type TransportMode = "car" | "motorcycle" | "bus" | "train" | "metro" | "bicycle" | "walking" | "flight";

export interface TransportInput {
  carDistance: number;
  motorcycleDistance: number;
  busDistance: number;
  trainDistance: number;
  metroDistance: number;
  bicycleDistance: number;
  walkingDistance: number;
  flightDistance: number;
}

export interface ElectricityInput {
  monthlyKWh: number;
}

export interface WasteInput {
  plasticKg: number;
  paperKg: number;
  glassKg: number;
  metalKg: number;
  organicKg: number;
  recycledPercentage: number; // 0-100%
}

export interface WaterInput {
  monthlyLiters: number;
}

export interface FlightInput {
  shortTrips: number; // < 3 hours
  mediumTrips: number; // 3 - 6 hours
  longTrips: number; // > 6 hours
}

export interface CalculationLog {
  id: string;
  month: string; // e.g. "2026-06"
  createdAt: string;
  electricity: ElectricityInput;
  transport: TransportInput;
  waste: WasteInput;
  water: WaterInput;
  flights: FlightInput;
  results: CarbonResult;
}

export interface CarbonResult {
  monthlyCO2: number; // kg
  yearlyCO2: number;  // kg
  categoryBreakdown: {
    electricity: number;
    transport: number;
    waste: number;
    water: number;
    flights: number;
  };
  sustainabilityScore: number; // 0 - 100
  diversionRate: number; // waste diversion
  recyclingScore: number; // 0-100
}

export interface SustainabilityAdvice {
  summary: string;
  keyIssues: string[];
  recommendations: {
    title: string;
    description: string;
    carbonReduction: number; // kg CO2 reduced per month
    feasibility: "Easy" | "Medium" | "Hard";
    costEffectiveness: "Low Cost" | "Medium Cost" | "Investment Required";
    category: "energy" | "transport" | "waste" | "lifestyle";
    impactScore: number;
  }[];
  projectedSavings: string[];
  actionPlan: string[];
}
