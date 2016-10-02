var Util = require('./util');

describe('getMonthDifference', () => {
  test('same year', () => {
    var one = new Date(2000, 8);
    var two = new Date(2000, 2);
    expect(Util.getMonthDifference(one, two)).toBe(6);
  });

  test('different year', () => {
    var one = new Date(2001, 3);
    var two = new Date(2000, 9);
    expect(Util.getMonthDifference(one, two)).toBe(6);
  });

  test('negative same year', () => {
    var one = new Date(2000, 2);
    var two = new Date(2000, 8);
    expect(Util.getMonthDifference(one, two)).toBe(-6);
  });

  test('negative different year', () => {
    var one = new Date(1999, 10);
    var two = new Date(2000, 2);
    expect(Util.getMonthDifference(one, two)).toBe(-4);
  });
});
