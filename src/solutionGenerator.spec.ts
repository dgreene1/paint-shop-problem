import { Sheen } from "./clerk";
import { brandAsSolution, cheapnessCompareFn } from "./solutionGenerator";

describe("cheapnessCompareFn", () => {
  it("should return the all glossy solution as the first", () => {
    // Arrange
    const cheapest = brandAsSolution(
      new Map<number, Sheen>([
        [1, "G"],
        [2, "G"],
      ])
    );
    const middleCost = brandAsSolution(
      new Map<number, Sheen>([
        [1, "G"],
        [2, "M"],
      ])
    );
    const mostExpensive = brandAsSolution(
      new Map<number, Sheen>([
        [1, "M"],
        [2, "M"],
      ])
    );
    const allSolutions = [middleCost, mostExpensive, cheapest];

    // Act
    const result = allSolutions.sort(cheapnessCompareFn);

    // Assert
    expect(result[0]).toBe(cheapest);
    expect(result[1]).toBe(middleCost);
    expect(result[2]).toBe(mostExpensive);
  });
});
