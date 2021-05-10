/*
  Please see clerk.spec.ts for the tests.
  End-to-end tests would have required extensive spies of console.log and would have been slow.
  If this was a project I planned to maintain,
    I would absolutely provide at least one end-to-end test to exercise the I/O aspects.
  Instead I'm trusting what oclif provides in terms of cli for now.
*/
test("truism", () => {
  expect(true).toEqual(true);
});
