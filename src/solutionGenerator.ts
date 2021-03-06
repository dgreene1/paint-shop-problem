import { isSheen, CustomerRequest, IOrderingScenario, Sheen } from "./clerk";

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

export function createAllSolutionsInTree(
  desiredLength: number,
  prefix = ""
): string[] {
  const idx = prefix.length;
  if (idx === desiredLength) return [prefix];

  const lower = lessExpensiveSheen;
  const upper = moreExpensiveSheen;

  return [
    ...createAllSolutionsInTree(desiredLength, prefix + lower),
    ...createAllSolutionsInTree(desiredLength, prefix + upper),
  ];
}

const solutionStringToObj = (solutionAsString: string): IPotentialSolution => {
  return solutionAsString.split("").reduce((record, char, index) => {
    if (isSheen(char)) {
      record.set(index + 1, char);

      return record;
    }
    throw new Error(
      `Somehow we got a value in from our internal solution generation code that is not a Sheen value. It was "${char}"`
    );
  }, brandAsSolution(new Map<number, Sheen>()));
};

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
  const potentialSolutions = createAllSolutionsInTree(scenario.numOfColors);

  const solutionsThatSatisfyAllCustomers = potentialSolutions
    .map((solutionAsStr) => {
      return solutionStringToObj(solutionAsStr);
    })
    .filter((solution) => {
      return allCustomersApproveSolution({
        scenario,
        solution,
      });
    });

  if (solutionsThatSatisfyAllCustomers.length === 0) {
    return false;
  }

  const solutionByCheapest =
    solutionsThatSatisfyAllCustomers.sort(cheapnessCompareFn);

  return solutionByCheapest[0];
};
