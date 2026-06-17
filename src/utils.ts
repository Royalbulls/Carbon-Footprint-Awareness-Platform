import { 
  CarbonResult, 
  ElectricityInput, 
  TransportInput, 
  WasteInput, 
  WaterInput, 
  FlightInput,
  CalculationLog,
  UserProfile,
  SustainabilityAdvice
} from "./types";

// Emission Factors (kg CO2 per unit)
export const EMISSION_FACTORS = {
  electricityKWh: 0.417, // 0.417 kg CO2 / kWh
  transport: {
    car: 0.192,        // kg CO2 / km
    motorcycle: 0.113, // kg CO2 / km
    bus: 0.105,        // kg CO2 / km
    train: 0.041,      // kg CO2 / km
    metro: 0.033,      // kg CO2 / km
    bicycle: 0,
    walking: 0,
    flight: 0.255      // kg CO2 / km
  },
  waste: {
    plasticKg: 1.9,    // kg CO2 / kg
    paperKg: 0.5,      // kg CO2 / kg
    glassKg: 0.3,      // kg CO2 / kg
    metalKg: 1.2,      // kg CO2 / kg
    organicKg: 0.8     // kg CO2 / kg
  },
  waterLiter: 0.00030  // 0.3 kg CO2 per cubic meter (1000L)
};

// Calculate Carbon Footprint
export function calculateFootprint(
  electricity: ElectricityInput,
  transport: TransportInput,
  waste: WasteInput,
  water: WaterInput,
  flights: FlightInput
): CarbonResult {
  // 1. Electricity emissions
  const electricityEmissions = electricity.monthlyKWh * EMISSION_FACTORS.electricityKWh;

  // 2. Flight trip conversions to distance
  const flightDist = (flights.shortTrips * 800) + (flights.mediumTrips * 2500) + (flights.longTrips * 7500);
  const totalFlightDistanceComp = Math.max(transport.flightDistance, flightDist);
  
  // 3. Transport emissions
  const carEmissions = transport.carDistance * EMISSION_FACTORS.transport.car;
  const devEmissions = transport.motorcycleDistance * EMISSION_FACTORS.transport.motorcycle;
  const busEmissions = transport.busDistance * EMISSION_FACTORS.transport.bus;
  const trainEmissions = transport.trainDistance * EMISSION_FACTORS.transport.train;
  const metroEmissions = transport.metroDistance * EMISSION_FACTORS.transport.metro;
  const flightEmissions = totalFlightDistanceComp * EMISSION_FACTORS.transport.flight;

  const transportEmissions = carEmissions + devEmissions + busEmissions + trainEmissions + metroEmissions + flightEmissions;

  // 4. Waste emissions incorporating recycling rate
  const recyclingRate = waste.recycledPercentage / 100;
  
  // Landfilled portion has higher emissions, recycling saves about 80% for inorganic, 70% for organic (composting)
  const plasticRaw = waste.plasticKg * EMISSION_FACTORS.waste.plasticKg;
  const paperRaw = waste.paperKg * EMISSION_FACTORS.waste.paperKg;
  const glassRaw = waste.glassKg * EMISSION_FACTORS.waste.glassKg;
  const metalRaw = waste.metalKg * EMISSION_FACTORS.waste.metalKg;
  const organicRaw = waste.organicKg * EMISSION_FACTORS.waste.organicKg;

  const plasticEmissions = plasticRaw * (1 - recyclingRate * 0.8);
  const paperEmissions = paperRaw * (1 - recyclingRate * 0.85);
  const glassEmissions = glassRaw * (1 - recyclingRate * 0.9);
  const metalEmissions = metalRaw * (1 - recyclingRate * 0.9);
  const organicEmissions = organicRaw * (1 - recyclingRate * 0.7);

  const wasteEmissions = plasticEmissions + paperEmissions + glassEmissions + metalEmissions + organicEmissions;

  // 5. Water emissions
  const waterEmissions = water.monthlyLiters * EMISSION_FACTORS.waterLiter;

  // Total monthly emissions in kg CO2
  const monthlyCO2 = electricityEmissions + transportEmissions + wasteEmissions + waterEmissions;
  const yearlyCO2 = monthlyCO2 * 12;

  // Sustainability Score (0-100 check)
  // Low emissions tier: <= 200 kg CO2 / month = 100 score
  // High emissions tier: >= 1500 kg CO2 / month = 0 score
  let sustainabilityScore = 100;
  if (monthlyCO2 > 200) {
    sustainabilityScore = Math.max(0, Math.round(100 - ((monthlyCO2 - 200) / 1300) * 100));
  }

  // Waste metrics
  const totalWasteKg = waste.plasticKg + waste.paperKg + waste.glassKg + waste.metalKg + waste.organicKg;
  const diversionRate = totalWasteKg > 0 ? waste.recycledPercentage : 0;
  
  // Recycling score out of 100 is based on both portion diverted and overall compost utilization
  const recyclingScore = Math.round(waste.recycledPercentage);

  return {
    monthlyCO2: Math.round(monthlyCO2 * 10) / 10,
    yearlyCO2: Math.round(yearlyCO2 * 10) / 10,
    categoryBreakdown: {
      electricity: Math.round(electricityEmissions * 10) / 10,
      transport: Math.round(transportEmissions * 10) / 10,
      waste: Math.round(wasteEmissions * 10) / 10,
      water: Math.round(waterEmissions * 10) / 10,
      flights: Math.round(flightEmissions * 10) / 10
    },
    sustainabilityScore,
    diversionRate: Math.round(diversionRate),
    recyclingScore
  };
}

// Generate projections
export interface ProjectionItem {
  name: string; // e.g. "Current", "1 Month", "3 Months", "6 Months", "12 Months"
  projected: number;
  target: number;
}

export function generateProjections(
  currentMonthlyCO2: number,
  targetMonthlyCO2: number,
  goalType: "low" | "medium" | "aggressive"
): ProjectionItem[] {
  // Goal trend reduction index: low reduces by 1% per month, medium by 2.5%, aggressive by 4%
  let factor = 0.99;
  if (goalType === "medium") factor = 0.975;
  if (goalType === "aggressive") factor = 0.96;

  const points = [
    { name: "Current", months: 0 },
    { name: "1 Month", months: 1 },
    { name: "3 Months", months: 3 },
    { name: "6 Months", months: 6 },
    { name: "12 Months", months: 12 }
  ];

  return points.map(pt => {
    const projected = currentMonthlyCO2 * Math.pow(factor, pt.months);
    return {
      name: pt.name,
      projected: Math.round(projected),
      target: targetMonthlyCO2
    };
  });
}

// Calculate recommendation scoring
// impactScore = carbonReduction * feasibilityBonus * costEffectivenessBonus
export function calculateImpactScore(
  carbonReduction: number,
  feasibility: "Easy" | "Medium" | "Hard",
  costEffectiveness: "Low Cost" | "Medium Cost" | "Investment Required"
): number {
  const fMultiplier = feasibility === "Easy" ? 1.2 : feasibility === "Medium" ? 1.0 : 0.7;
  const cMultiplier = costEffectiveness === "Low Cost" ? 1.2 : costEffectiveness === "Medium Cost" ? 1.0 : 0.6;
  return Math.round(carbonReduction * fMultiplier * cMultiplier);
}

// Default Recommendations if AI Advisor is offline OR for immediate fallback
export const STATIC_RECOMMENDATIONS = [
  {
    title: "Change to LED Bulbs",
    description: "Replace standard incandescent bulbs with Energy Star qualified LEDs. LEDs use 75% less energy and last 25 times longer.",
    carbonReduction: 35, // kg CO2/month
    feasibility: "Easy" as const,
    costEffectiveness: "Low Cost" as const,
    category: "energy" as const
  },
  {
    title: "Enable Smart Thermostat",
    description: "Set thermostats to adjust temperature automatically when away. Lowering temps by 7-10 degrees for 8 hours a day reduces footprint.",
    carbonReduction: 60,
    feasibility: "Easy" as const,
    costEffectiveness: "Medium Cost" as const,
    category: "energy" as const
  },
  {
    title: "Carpool or Remote Work",
    description: "Share car space with coworkers or commute remotely twice a week to drastically reduce transport emissions.",
    carbonReduction: 120,
    feasibility: "Medium" as const,
    costEffectiveness: "Low Cost" as const,
    category: "transport" as const
  },
  {
    title: "Shift to Public Transit",
    description: "Shift 20% of your single-occupancy vehicle travel to bus, rail, or subway commutes.",
    carbonReduction: 85,
    feasibility: "Medium" as const,
    costEffectiveness: "Low Cost" as const,
    category: "transport" as const
  },
  {
    title: "Adopt Composting",
    description: "Keep food scrubs and plant clippings out of garbage bins. Composting organic waste reduces landfill methane production by 70%.",
    carbonReduction: 25,
    feasibility: "Easy" as const,
    costEffectiveness: "Low Cost" as const,
    category: "waste" as const
  },
  {
    title: "Install Solar Panels",
    description: "Harness renewable micro-generation. Solar modules eliminate heavy reliance on traditional fossil-fueled grids.",
    carbonReduction: 280,
    feasibility: "Hard" as const,
    costEffectiveness: "Investment Required" as const,
    category: "energy" as const
  },
  {
    title: "Purchase Reusable Materials",
    description: "Ditch single-use plastic cups, water flasks, storage grocery wraps, and garbage liners for steel or compostable bag versions.",
    carbonReduction: 15,
    feasibility: "Easy" as const,
    costEffectiveness: "Low Cost" as const,
    category: "waste" as const
  },
  {
    title: "Switch to Electric Vehicle",
    description: "Transition from internal combustion vehicles to dynamic hybrid or full battery-electric (EV) vehicles.",
    carbonReduction: 320,
    feasibility: "Hard" as const,
    costEffectiveness: "Investment Required" as const,
    category: "transport" as const
  },
  {
    title: "Install Water-Saving Fixtures",
    description: "Equip low-flow aerators, secondary dual-flush toilets, and high-efficiency shower heads to drop hot water fuel loading.",
    carbonReduction: 18,
    feasibility: "Easy" as const,
    costEffectiveness: "Low Cost" as const,
    category: "lifestyle" as const
  }
];

export function getScoredRecommendations() {
  return STATIC_RECOMMENDATIONS.map(rec => ({
    ...rec,
    impactScore: calculateImpactScore(rec.carbonReduction, rec.feasibility, rec.costEffectiveness)
  })).sort((a,b) => b.impactScore - a.impactScore);
}

// Educational Topic Materials
export const EDUCATIONAL_CURRICULUM = [
  {
    id: "climate-basics",
    title: "Climate Change Basics",
    summary: "Understand the core mechanics of planetary greenhouse effect and the critical emission targets set globally.",
    content: `### What is Climate Change?
Climate change refers to long-term shifts in temperatures and weather patterns. Since the 1800s, human activities have been the main driver, primarily due to burning fossil fuels like coal, oil, and gas.

### The Greenhouse Effect
Greenhouse gases act like a blanket wrapped around the Earth, trapping the sun’s heat and raising temperatures. Key gases include:
- **Carbon Dioxide (CO₂)**: Emitted through combustion of fossil fuels, timber clearing, and industrial processes.
- **Methane (CH₄)**: Released during agricultural cultivation (notably livestock digestive tracts) and anaerobic landfill decompositions.
- **Nitrous Oxide (N₂O)**: Emitted mainly through biochemical farming fertilizers.

### Why Every Fraction of a Degree Matters
Under the Paris Agreement, nations pledged to limit temperature rise to below **1.5°C** compared to pre-industrial baselines. Going past this threshold increases the incidence of intense heatwaves, extreme precipitation, rising coastal sea heights, and catastrophic biodiversity losses.`
  },
  {
    id: "carbon-footprint",
    title: "What is a Carbon Footprint?",
    summary: "Learn what constitutes your direct and indirect greenhouse output, and how household actions scale up.",
    content: `### Understanding Footprint Categories
A carbon footprint calculates the total volume of greenhouse gas emissions generated directly and indirectly by our actions. It is split into three mainscopes:

1. **Direct Emissions (Scope 1)**: Actions under your direct control, such as burning gasoline in your car's engine or burning natural gas in your home heating furnace.
2. **Indirect Utility Emissions (Scope 2)**: Carbon released by the utility grids supplying your electricity, central municipal steam, or direct air conditioning.
3. **Upstream & Downstream Lifecycle (Scope 3)**: Emissions tied to packaging, transport shipping, and heavy manufacturing of consumer goods you buy, as well as waste disposal pipelines.

### Standard Household Averages
- **Global Household Average**: ~4.5 to 5 tons of CO₂ equivalent (tCO₂e) annually per traveler.
- **High Grid Intensity (e.g. US, Australia)**: ~15 to 18 tons per person.
- **Net-Zero Safe Target**: To halt warming, global individual emissions must average less than **2.0 tons** per year by 2050.`
  },
  {
    id: "renewable-energy",
    title: "Renewable Grid Transitions",
    summary: "Discover the carbon advantages of switching utility supply portfolios from fossil fuel burning to sun and wind sources.",
    content: `### Fossil Grids vs. Clean Power
Grids traditionally burn natural gas, coal, or heavy oil to keep steam turbines spinning. This releases significant carbon blocks for every kilowatt-hour.
- **Coal Electricity**: ~0.9 to 1.0 kg CO₂ per kWh generated.
- **Solar PV generation**: ~0.04 kg CO₂ equivalent per lifetime kWh (taking manufacturing and construction into account).
- **Onshore Wind energy**: ~0.01 kg CO₂ equivalent per lifetime kWh.

### Practical Steps to Decarbonize Your Utility Support
- **Opt-in Clean Portfolios**: Check if your utility operator lets you enroll in a 100% wind or solar program (usually costs a tiny surcharge).
- **Rooftop Solar Modules**: Rooftop units pay back their chemical thermal footprints within 1.5 years and provide 25+ years of emissions-free power.
- **Vampire Draw Prevention**: Standby power on major electronics accounts for up to 10% of utility bills; turning these off cuts carbon seamlessly.`
  },
  {
    id: "sustainable-transit",
    title: "Sustainable Transportation",
    summary: "Compare travel efficiencies and learn practical micro-mobility strategies to avoid single-commute car emissions.",
    content: `### Transport Efficiency Comparison
Passenger combustion vehicles are the highest transport emission source for individuals. Let's see the comparison (g CO₂ per kilometer per traveler):
- **Single-Occupant Gas SUV**: ~220g / km
- **Average Gas Sedan**: ~170g / km
- **Electric Vehicle (Standard grid profile)**: ~50-80g / km
- **Local Commuter Bus**: ~45-75g / passenger-km
- **Electric Metro Rail**: ~10-25g / passenger-km
- **Electric Bicycle / Walk**: 0g / km

### Quick Wins for Daily Travels
1. **Combine Errands**: Multi-stop routing avoids extra cold engine starts.
2. **Transit Day**: Commit to riding local buses or rail networks just once a week to slash your local commuting footprint by 20%.
3. **EV Fleet upgrade**: EV drivetrains operate with 85-90% efficiency compared to the 20-30% thermal output efficiency of internal combustion engines.`
  }
];

// Daily Tips Database
export const DAILY_TIPS = [
  "Swapping one traditional incandescent bulb for an LED reduces household emission by up to 75% over its lifetime.",
  "Unplugging electronic devices when fully charged stops 'vampire draw', which accounts for nearly 10% of standard home utility demand.",
  "Drying clothes on an outdoor line instead of utilizing electric dryers twice a week avoids over 150 kg of CO₂ annually.",
  "Lowering your indoor thermostat by just 1°C in winter can drop your space heating bill and matching carbon footprint by 8-10%.",
  "Skipping a single meat-based dinner each week in favor of plant-based grains reduces yearly footprint by nearly 200 kg.",
  "Composting family organic food scraps keeps waste out of anaerobic landfills, stopping the creation of devastating greenhouse Methane.",
  "Ensuring your car tires are inflated to the rated pressure improves gas mileage by up to 3%, cutting tailpipe emissions.",
  "Over 90% of a washing machine's heating energy goes purely to warming water; washing garments on cold settings extends fabric life and cuts energy.",
  "Placing high-quality aerators on standard bathroom faucets reduces warm water output volumes by up to 40% without hindering water pressure."
];
