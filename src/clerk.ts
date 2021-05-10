import { pickIdealSolution } from "./solutionGenerator";

export type Sheen = "M" | "G";

// The following technique ensures that TypeScript will demand we update this code if a new Sheen value is added to the string literal union
const sheenRecord: Record<Sheen, string> = {
  M: "Matte",
  G: "Glossy",
};

/**
 * This is a hash map so that we can do a quick lookup on whether a customer has requested a paint color or not
 */
export type CustomerRequest = Map<number, Sheen>;

export interface IOrderingScenario {
  numOfColors: number;
  orders: CustomerRequest[];
}

const assertIsKnownPaintColor = (
  desiredPaintNumber: number,
  scenario: Pick<IOrderingScenario, "numOfColors">
): void => {
  if (desiredPaintNumber <= 0) {
    throw new Error(
      `Paint Numbers start at the index of 1, however a customer requested "${desiredPaintNumber}"`
    );
  }
  if (desiredPaintNumber <= scenario.numOfColors) {
    return;
  }
  throw new Error(
    `Customer requested paint color "${desiredPaintNumber}" but we only carry paints 1 through ${scenario.numOfColors}`
  );
};

const assertIsSheen = (desiredSheen: string): desiredSheen is Sheen => {
  // This type assertion lets us do a lookup on a narrow key from a widened type
  const ambiguousLookup = sheenRecord as Record<string, string>;

  if (ambiguousLookup[desiredSheen]) {
    return true;
  }
  return false;
};

const parseCustomerOrder = (
  customersOrderRaw: string,
  scenario: Pick<IOrderingScenario, "numOfColors">
): CustomerRequest => {
  const chunks = customersOrderRaw.split(" ");

  let currentPaintInProgress: number | undefined;
  const paintsForACust: CustomerRequest = new Map<number, Sheen>();

  chunks.forEach((currentChunk) => {
    // is it number?
    const potentialNumber = parseInt(currentChunk, 10);

    if (!isNaN(potentialNumber)) {
      // is it a paint color we have?
      assertIsKnownPaintColor(potentialNumber, scenario);
      // was it preceded by a number? If so, they forgot to include sheen
      if (typeof currentPaintInProgress === "number") {
        throw new TypeError(
          `Malformed file: Customer did not provide a sheen for paint "${currentPaintInProgress}" in their order "${customersOrderRaw}"`
        );
      }
      // Save it for the next iteration
      currentPaintInProgress = potentialNumber;
    } else {
      // We know that it's not a paint number now, so it better be a sheen color
      if (!assertIsSheen(currentChunk)) {
        throw new Error(
          `"${currentChunk}" is not an acceptable Sheen value. Allowed values are ${Object.keys(
            sheenRecord
          )}`
        );
      } else {
        // was it prededed by a string? If so, they forgot to include the paint number
        if (!currentPaintInProgress) {
          throw new Error(
            `Malformed file: Customer did not provide a paint number for one of the items in their order "${customersOrderRaw}"`
          );
        }
        // Save
        paintsForACust.set(currentPaintInProgress, currentChunk);
        // Clear out the state since the next loop will (ideally) be a new paint color.
        currentPaintInProgress = undefined;
      }
    }
  });

  if (currentPaintInProgress) {
    throw new Error(
      `Customer neglected to provide a sheen for paint number "${currentPaintInProgress}"`
    );
  }

  return paintsForACust;
};

export const parseScenario = (scenario: string): IOrderingScenario => {
  const allNewlineChars = /\r\n|\r|\n/;
  const lines = scenario.split(allNewlineChars);

  if (!lines[0]) {
    throw new Error(
      `The input file did not contain the number of paint colors nor any orders.`
    );
  }
  const numOfColorsStringified = lines[0];
  const numOfColors = parseInt(numOfColorsStringified, 10);

  if (isNaN(numOfColors)) {
    throw new TypeError(
      `The first line must contain a number that defines the number of paint colors available.`
    );
  }

  const orders = lines
    // remove the first item since it's not an order and shouldn't be parsed as if it was one
    .filter((_value, index) => {
      return index > 0;
    })
    // parse each line that contains an order
    .map((aLine) => {
      return parseCustomerOrder(aLine.trim(), {
        numOfColors,
      });
    });

  return {
    numOfColors,
    orders,
  };
};

export const takeOrders = (scenarioAsString: string): string => {
  const scenario = parseScenario(scenarioAsString);
  const idealScenario = pickIdealSolution(scenario);

  if (idealScenario === false) {
    return "No solution exists";
  }

  return Array.from(idealScenario, ([_paintNumber, sheen]) => {
    return sheen;
  }).join(" ");
};
