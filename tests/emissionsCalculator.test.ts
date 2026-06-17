import { describe, it, expect } from "vitest";
import { calculateFootprint, EMISSION_FACTORS } from "../src/utils";
import { ElectricityInput, TransportInput, WasteInput, WaterInput, FlightInput } from "../src/types";

describe("Emissions Calculator - Category and Score Insights", () => {
  const baselineElectricity = { monthlyKWh: 0 };
  const baselineTransport: TransportInput = {
    carDistance: 0,
    motorcycleDistance: 0,
    busDistance: 0,
    trainDistance: 0,
    metroDistance: 0,
    bicycleDistance: 0,
    walkingDistance: 0,
    flightDistance: 0
  };
  const baselineWaste = {
    plasticKg: 0,
    paperKg: 0,
    glassKg: 0,
    metalKg: 0,
    organicKg: 0,
    recycledPercentage: 0
  };
  const baselineWater = { monthlyLiters: 0 };
  const baselineFlights = { shortTrips: 0, mediumTrips: 0, longTrips: 0 };

  it("calculates electricity emissions with correct factor", () => {
    // 500 kWh electricity
    const results = calculateFootprint(
      { monthlyKWh: 500 },
      baselineTransport,
      baselineWaste,
      baselineWater,
      baselineFlights
    );
    // Factor: 0.417 kg CO2 / kWh
    expect(results.categoryBreakdown.electricity).toBeCloseTo(208.5, 1);
    expect(results.monthlyCO2).toBe(208.5);
  });

  it("calculates transport emissions for single modes", () => {
    // 1000 km car commute
    const transportInput: TransportInput = {
      ...baselineTransport,
      carDistance: 1000
    };
    const results = calculateFootprint(
      baselineElectricity,
      transportInput,
      baselineWaste,
      baselineWater,
      baselineFlights
    );
    // Factor: 0.192
    expect(results.categoryBreakdown.transport).toBeCloseTo(192.0, 1);
  });

  it("calculates short/medium/long flight trip emissions correctly", () => {
    // 1 short trip (~800km) + 1 medium trip (~2500km) + 1 long trip (~7500km)
    const flightInput: FlightInput = {
      shortTrips: 1,
      mediumTrips: 1,
      longTrips: 1
    };
    const results = calculateFootprint(
      baselineElectricity,
      baselineTransport,
      baselineWaste,
      baselineWater,
      flightInput
    );
    const expectedDistance = 800 + 2500 + 7500; // 10800
    const expectedEmissions = expectedDistance * EMISSION_FACTORS.transport.flight; // 10800 * 0.255 = 2754
    expect(results.categoryBreakdown.flights).toBeCloseTo(expectedEmissions, 1);
  });

  it("generates sustainability scores correctly relative to monthly total", () => {
    // 1. Under scale: <= 200 kg is 100
    const score100 = calculateFootprint({ monthlyKWh: 100 }, baselineTransport, baselineWaste, baselineWater, baselineFlights);
    expect(score100.sustainabilityScore).toBe(100);

    // 2. High scale: >= 1500 kg is 0
    // Try monthlyKWh of 4000: 4000 * 0.417 = 1668 kg
    const score0 = calculateFootprint({ monthlyKWh: 4000 }, baselineTransport, baselineWaste, baselineWater, baselineFlights);
    expect(score0.sustainabilityScore).toBe(0);

    // 3. Medium scale: expect proportional value
    // monthlyKWh of 1000 yields 417 kg
    // Score should be Math.max(0, Math.round(100 - ((417 - 200) / 1300) * 100))
    // 417 - 200 = 217. 217 / 1300 = 0.1669. 100 - 16.69 = 83.3 = 83
    const scoreMed = calculateFootprint({ monthlyKWh: 1000 }, baselineTransport, baselineWaste, baselineWater, baselineFlights);
    expect(scoreMed.sustainabilityScore).toBe(83);
  });
});
