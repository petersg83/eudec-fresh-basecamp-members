import { assertEquals } from "testing";
import { isUpToDateMember } from "../france.js";


Deno.test('isUptoDateMember', async (t) => {
  const dateToCheck = '2022-12-21'
  const testCases = [
    [undefined, false],
    ['', false],
    [';2012-04-04_2013-04-03', false],
    [';2012-04-04_2022-12-21', true],
    [';2012-04-04_2023-12-22', true],
    [';2012-04-04_2023-12-22;2012-04-04_2013-12-22', true],
    [';2012-04-04_2013-12-22;2012-04-04_2023-12-22', true],
    [';2000-04-04_2001-04-03;2001-04-04_2002-04-03', false],
    [';2012-04-04_2013-04-03;3012-04-04_3013-04-03', false],
    [';3012-04-04_3013-04-03;3013-04-04_3014-04-03', false],
  ];
  
  for (const [membershipDates, expectedResult] of testCases) {
    await t.step(`case ${membershipDates} => ${expectedResult}`, () => {
      const result = isUpToDateMember(dateToCheck)({ membershipDates });
      assertEquals(result, expectedResult);
    });
  }
});