import { parseScenario, IOrderingScenario, Sheen, takeOrders } from "./clerk";

describe("takeOrders", () => {
  it("should have a solution for the simple scenario", () => {
    // Arrange
    const input = `5
      1 M 3 G 5 G
      2 G 3 M 4 G
      5 M`;

    const expectedResult = `G G G G M`;

    // Act
    const result = takeOrders(input);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});

describe("parseScenario", () => {
  it("should be able to handle a happy path", () => {
    // Act
    const input = `5
        1 M 3 G 5 G
        2 G 3 M 4 G
        5 M`;
    const expectedResult: IOrderingScenario = {
      numOfColors: 5,
      orders: [
        new Map<number, Sheen>([
          [1, "M"],
          [3, "G"],
          [5, "G"],
        ]),
        new Map<number, Sheen>([
          [2, "G"],
          [3, "M"],
          [4, "G"],
        ]),
        new Map<number, Sheen>([[5, "M"]]),
      ],
    };

    // Arrange
    const parsed = parseScenario(input);

    // Assert
    expect(parsed).toEqual(expectedResult);
  });
});
