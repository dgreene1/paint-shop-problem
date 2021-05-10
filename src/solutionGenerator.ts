import { CustomerRequest, IOrderingScenario, Sheen } from "./clerk";

/**
 * Since this is a branded type, it will help us to not accidentally pass CustomerRequest as an IPotentialSolution
 */
export type IPotentialSolution = Map<number, Sheen> & {
  __branded__: "potentialSolution";
};

/**
 * The branded types technique ensures that we don't conflate to identical types that have nominal differences.
 */
export const brandAsSolution = (
  input: Map<number, Sheen>
): IPotentialSolution => {
  return input as IPotentialSolution;
};

const customerApprovesSolution = (input: {
  solution: IPotentialSolution;
  individualCustomerRequest: CustomerRequest;
}): boolean => {
  const { solution, individualCustomerRequest } = input;

  // Check if this customer can find at least one paint that matches their request
  const approves = Array.from(individualCustomerRequest).some(
    ([paintNumber, sheenRequestedByCustomer]) => {
      const possibleSheen = solution.get(paintNumber);
      if (possibleSheen && possibleSheen === sheenRequestedByCustomer) {
        return true;
      }

      return false;
    }
  );
  return approves;
};

const allCustomersApproveSolution = (input: {
  solution: IPotentialSolution;
  scenario: IOrderingScenario;
}): boolean => {
  const { solution, scenario } = input;

  return scenario.orders.every((individualCustomerRequest) => {
    return customerApprovesSolution({ solution, individualCustomerRequest });
  });
};

const moreExpensiveSheen: Sheen = "M";
const lessExpensiveSheen: Sheen = "G";

function createSingleSolution(input: {
  paintNumbersToMakeMoreExpensive: number[];
  numberOfPaintsToMake: number;
}): IPotentialSolution {
  const { numberOfPaintsToMake, paintNumbersToMakeMoreExpensive } = input;

  const solution = new Map<number, Sheen>();

  for (let index = 1; index < numberOfPaintsToMake + 1; index++) {
    if (paintNumbersToMakeMoreExpensive.includes(index)) {
      solution.set(index, moreExpensiveSheen);
    } else {
      solution.set(index, lessExpensiveSheen);
    }
  }

  return brandAsSolution(solution);
}

/**
 * This will start with the cheapest option and then will continue to make new solutions when requested
 */
function createAllSolutons(scenario: IOrderingScenario): IPotentialSolution[] {
  const potentialSolutions: IPotentialSolution[] = [];

  // Try the option of all cheap paint sheens first
  const cheapestOption = createSingleSolution({
    paintNumbersToMakeMoreExpensive: [],
    numberOfPaintsToMake: scenario.numOfColors,
  });
  potentialSolutions.push(cheapestOption);

  // If that didn't work, start to work through other solutions in the set of all permutations
  for (
    let firstPaintToFlip = 0;
    firstPaintToFlip < scenario.numOfColors + 1;
    firstPaintToFlip++
  ) {
    const paintNumbersToMakeMoreExpensive: number[] = [firstPaintToFlip];
    for (
      let subsequentColor = firstPaintToFlip;
      subsequentColor < scenario.numOfColors + 1;
      subsequentColor++
    ) {
      paintNumbersToMakeMoreExpensive.push(subsequentColor);
      const aSolution = createSingleSolution({
        paintNumbersToMakeMoreExpensive,
        numberOfPaintsToMake: scenario.numOfColors,
      });
      potentialSolutions.push(aSolution);
    }
  }

  return potentialSolutions;
}
const getCountOfMatte = (mapObj: IPotentialSolution): number => {
  return Array.from(mapObj, ([paintNumber, sheen]) => ({
    paintNumber,
    sheen,
  })).filter((x) => {
    const { sheen } = x;

    return sheen === moreExpensiveSheen;
  }).length;
};

export const cheapnessCompareFn = (
  a: IPotentialSolution,
  b: IPotentialSolution
): number => {
  return getCountOfMatte(a) - getCountOfMatte(b);
};

/**
 * Returns the ideal solution that would satisfy all customers while providing the lowest cost. If no solution satisfies all customers, it returns false.
 */
export const pickIdealSolution = (
  scenario: IOrderingScenario
): IPotentialSolution | false => {
  const potentialSolutions = createAllSolutons(scenario);

  const solutionsThatSatisfyAllCustomers = potentialSolutions.filter(
    (solution) => {
      return allCustomersApproveSolution({
        scenario,
        solution,
      });
    }
  );

  if (solutionsThatSatisfyAllCustomers.length === 0) {
    return false;
  }

  const solutionByCheapest =
    solutionsThatSatisfyAllCustomers.sort(cheapnessCompareFn);

  return solutionByCheapest[0];
};
