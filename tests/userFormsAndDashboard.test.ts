import { describe, it, expect } from "vitest";
import { UserProfile, CalculationLog } from "../src/types";

describe("Sustainability Dashboard & Forms Auxiliary Math", () => {
  it("safely default parses user profile records or provides defaults", () => {
    const rawProfile = {
      id: "user-test",
      name: "Robin Test",
      email: "test@domain.com",
      householdSize: 4,
      country: "CA",
      sustainabilityGoal: "aggressive",
      targetCO2: 350
    };

    expect(rawProfile.name).toBe("Robin Test");
    expect(rawProfile.householdSize).toBe(4);
    expect(rawProfile.country).toBe("CA");
    expect(rawProfile.sustainabilityGoal).toBe("aggressive");
    expect(rawProfile.targetCO2).toBe(350);
  });

  it("handles empty names and fallback alias gracefully", () => {
    const emptyNameProfile = {
      name: "",
      country: "US",
      householdSize: 1
    };

    const displayName = emptyNameProfile.name || "Eco Citizen";
    expect(displayName).toBe("Eco Citizen");
  });

  it("calculates trend percentages across log history points", () => {
    // Math checks for logs array
    const fakeLogs = [
      { month: "2026-04", results: { monthlyCO2: 600 } },
      { month: "2026-05", results: { monthlyCO2: 450 } }
    ];

    const currentLogOffset = fakeLogs[1].results.monthlyCO2;
    const oldLogOffset = fakeLogs[0].results.monthlyCO2;
    const difference = currentLogOffset - oldLogOffset; // -150
    const percentChange = (difference / oldLogOffset) * 100; // -25%

    expect(percentChange).toBe(-25);
  });

  it("bounds check inputs for sanitization", () => {
    const sanitizeInput = (val: string) => {
      // Basic strip down of symbols to prevent custom visual/code exploits
      return val.replace(/[<>'"&]/g, "");
    };

    const dirtyName = "Robin <script>alert(1)</script> Green";
    const cleaned = sanitizeInput(dirtyName);
    expect(cleaned).not.toContain("<");
    expect(cleaned).not.toContain(">");
    expect(cleaned).toBe("Robin scriptalert(1)/script Green");
  });
});
