import { describe, it, expect } from "vitest";
import { calculateImpactScore, getScoredRecommendations, STATIC_RECOMMENDATIONS } from "../src/utils";

describe("Sustainability Recommendation Engine Tests", () => {
  it("scores actions correctly based on feasibility and cost-effectiveness", () => {
    // Math: carbonReduction * fMultiplier * cMultiplier
    // If Easy and Low Cost: red * 1.2 * 1.2 = red * 1.44
    const scoreEasyLow = calculateImpactScore(100, "Easy", "Low Cost");
    expect(scoreEasyLow).toBe(144);

    // If Medium and Medium Cost: red * 1.0 * 1.0 = red * 1.0
    const scoreMedMed = calculateImpactScore(100, "Medium", "Medium Cost");
    expect(scoreMedMed).toBe(100);

    // If Hard and Investment Required: red * 0.7 * 0.6 = red * 0.42
    const scoreHardInv = calculateImpactScore(100, "Hard", "Investment Required");
    expect(scoreHardInv).toBe(42);
  });

  it("provisions the complete catalog of static recommendations", () => {
    expect(STATIC_RECOMMENDATIONS.length).toBeGreaterThanOrEqual(8);
    
    // Ensure all recommendations have correct fields and field types
    STATIC_RECOMMENDATIONS.forEach(rec => {
      expect(rec.title).toBeDefined();
      expect(typeof rec.title).toBe("string");
      expect(rec.description).toBeDefined();
      expect(typeof rec.description).toBe("string");
      expect(rec.carbonReduction).toBeGreaterThan(0);
      expect(["Easy", "Medium", "Hard"]).toContain(rec.feasibility);
      expect(["Low Cost", "Medium Cost", "Investment Required"]).toContain(rec.costEffectiveness);
      expect(["energy", "transport", "waste", "lifestyle"]).toContain(rec.category);
    });
  });

  it("yields dynamically sorted scored recommendations in descending order", () => {
    const scoredList = getScoredRecommendations();
    expect(scoredList).toBeDefined();
    expect(scoredList.length).toBe(STATIC_RECOMMENDATIONS.length);

    // Verify sorted in descending order of impactScore
    for (let i = 0; i < scoredList.length - 1; i++) {
      expect(scoredList[i].impactScore).toBeGreaterThanOrEqual(scoredList[i + 1].impactScore);
    }
  });

  it("contains specific required recommendations", () => {
    const scoredList = getScoredRecommendations();
    const titles = scoredList.map(r => r.title);
    expect(titles).toContain("Change to LED Bulbs");
    expect(titles).toContain("Adopt Composting");
    expect(titles).toContain("Install Solar Panels");
  });
});
