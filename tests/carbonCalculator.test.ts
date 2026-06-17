import { describe, it, expect } from "vitest";
import { calculateFootprint, generateProjections } from "../src/utils";
import { ElectricityInput, TransportInput, WasteInput, WaterInput, FlightInput } from "../src/types";

describe("Carbon Footprint Calculator Support", () => {
  const sampleElectricity: ElectricityInput = { monthlyKWh: 300 };
  const sampleTransport: TransportInput = {
    carDistance: 400,
    motorcycleDistance: 100,
    busDistance: 150,
    trainDistance: 200,
    metroDistance: 50,
    bicycleDistance: 100,
    walkingDistance: 50,
    flightDistance: 0
  };
  const sampleWaste: WasteInput = {
    plasticKg: 5,
    paperKg: 5,
    glassKg: 5,
    metalKg: 5,
    organicKg: 10,
    recycledPercentage: 50
  };
  const sampleWater: WaterInput = { monthlyLiters: 4000 };
  const sampleFlights: FlightInput = { shortTrips: 1, mediumTrips: 0, longTrips: 0 };

  it("calculates monthly footprint correctly", () => {
    const results = calculateFootprint(
      sampleElectricity,
      sampleTransport,
      sampleWaste,
      sampleWater,
      sampleFlights
    );
    expect(results.monthlyCO2).toBeGreaterThan(0);
    expect(results.categoryBreakdown.electricity).toBeCloseTo(125.1, 1);
    expect(results.categoryBreakdown.water).toBeCloseTo(1.2, 1);
  });

  it("calculates annual emission projection as a 12x scale", () => {
    const results = calculateFootprint(
      sampleElectricity,
      sampleTransport,
      sampleWaste,
      sampleWater,
      sampleFlights
    );
    // Allow minor deviation due to monthly and annual values being individually rounded to 1 decimal place (max 6.0kg error)
    expect(Math.abs(results.yearlyCO2 - results.monthlyCO2 * 12)).toBeLessThanOrEqual(6);
  });

  it("handles empty / zero emissions input case gracefully", () => {
    const zeroElec = { monthlyKWh: 0 };
    const zeroTrans = {
      carDistance: 0,
      motorcycleDistance: 0,
      busDistance: 0,
      trainDistance: 0,
      metroDistance: 0,
      bicycleDistance: 0,
      walkingDistance: 0,
      flightDistance: 0
    };
    const zeroWaste = {
      plasticKg: 0,
      paperKg: 0,
      glassKg: 0,
      metalKg: 0,
      organicKg: 0,
      recycledPercentage: 0
    };
    const zeroWater = { monthlyLiters: 0 };
    const zeroFlights = { shortTrips: 0, mediumTrips: 0, longTrips: 0 };

    const results = calculateFootprint(zeroElec, zeroTrans, zeroWaste, zeroWater, zeroFlights);
    expect(results.monthlyCO2).toBe(0);
    expect(results.yearlyCO2).toBe(0);
    expect(results.sustainabilityScore).toBe(100);
  });

  it("projects future compounding goals correctly", () => {
    const current = 500;
    const target = 350;
    
    const lowProjections = generateProjections(current, target, "low");
    expect(lowProjections).toHaveLength(5);
    expect(lowProjections[0].projected).toBe(500);
    expect(lowProjections[4].projected).toBeLessThan(500); // 12 months later

    const aggProjections = generateProjections(current, target, "aggressive");
    expect(aggProjections[4].projected).toBeLessThan(lowProjections[4].projected);
  });
});
