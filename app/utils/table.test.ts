import { getVisibleRows } from '~/utils/table';
import { typedEntries } from '~/utils/table';
import { getColor } from '~/utils/table';
import { describe, it, expect } from 'vitest';

describe('getVisibleRows', () => {
  it('should sort rows in descending order when order is "desc"', () => {
    const rows = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'Bob', age: 20 },
    ];
    const sortedRows = getVisibleRows(rows, 'desc', 'age');
    expect(sortedRows).toEqual([
      { name: 'Jane', age: 30 },
      { name: 'John', age: 25 },
      { name: 'Bob', age: 20 },
    ]);
  });

  it('should sort rows in ascending order when order is "asc"', () => {
    const rows = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'Bob', age: 20 },
    ];
    const sortedRows = getVisibleRows(rows, 'asc', 'age');
    expect(sortedRows).toEqual([
      { name: 'Bob', age: 20 },
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]);
  });
});

describe('typedEntries', () => {
  it('should return an array of key-value pairs for a given object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const entries = typedEntries(obj);
    expect(entries).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
});

describe('getColor', () => {
  it('should return the correct color for monthly risk threshold', () => {
    const value = 1;
    const viewType = 'monthly'; // per column 1 or 0 per active column for monthly
    const activeRiskColumns = 1;
    expect(getColor(value, viewType, activeRiskColumns)).toBe('red');
  });

  it('should return the correct color for annual risk threshold', () => {
    const value = 36;
    const viewType = 'annual'; // 0-12 per active column for annual
    const activeRiskColumns = 3;
    expect(getColor(value, viewType, activeRiskColumns)).toBe('red');
  });

  it('should return the default color if conditions are not met', () => {
    const value = 10;
    const viewType = 'monthly';
    const activeRiskColumns = 1;
    expect(getColor(value, viewType, activeRiskColumns)).toBe('unset');
  });

  it('should handle different active risk columns for monthly view', () => {
    const value = 2;
    const viewType = 'monthly';
    const activeRiskColumns = 2;
    expect(getColor(value, viewType, activeRiskColumns)).toBe('red');
  });

  it('should handle different active risk columns for annual view', () => {
    const value = 0;
    const viewType = 'annual';
    const activeRiskColumns = 2;
    expect(getColor(value, viewType, activeRiskColumns)).toBe('green');
  });
});
