import React, { type Key } from "react";
import type { Data, Order } from "~/types";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

  export const getVisibleRows = (rows: any, order: Order, orderBy: any) => React.useMemo(
    () => {
      return [...rows].sort(getComparator(order, orderBy));
    },
    [order, orderBy]
  );


  