import { LinkedListNode } from "../09-Generics/Iterator";
import {
  ArrayIterator,
  IBidirectionalIterator,
  IForwardIterator,
  LinkedListIterator,
} from "./algs-with-generic-constraint";

function nthLastForward<T>(
  begin: IForwardIterator<T>,
  end: IForwardIterator<T>,
  n: number,
): IForwardIterator<T> {
  if (n === 0) return end;
  let len = 0;
  const cloneBegin: IForwardIterator<T> = begin.clone();
  while (!begin.equals(end)) {
    len++;
    begin.increment();
  }

  if (n > len) return end;
  let m = len - n;
  // n might be negative, so cloneBegin should not equal with end
  while (!cloneBegin.equals(end) && m-- > 0) {
    cloneBegin.increment();
  }
  return cloneBegin;
}

function nthLastBidirectional<T>(
  start: IBidirectionalIterator<T>,
  end: IBidirectionalIterator<T>,
  n: number,
): IBidirectionalIterator<T> {
  if (n === 0) return end;
  const current = end.clone();
  while (!start.equals(current) && n-- > 0) {
    current.decrement();
  }
  if (n > 0) return end;
  return current;
}

/** ts has no function overloading, thus needs to differenciate types and write 2
 * functions */
function isBidirectional<T>(
  instance: IForwardIterator<T>,
): instance is IBidirectionalIterator<T> {
  return "decrement" in instance;
}

function nthLast<T>(
  begin: IForwardIterator<T>,
  end: IForwardIterator<T>,
  n: number,
): IForwardIterator<T> {
  if (isBidirectional(begin) && isBidirectional(end)) {
    return nthLastBidirectional(begin, end, n);
  } else {
    return nthLastForward(begin, end, n);
  }
}

// test for LinkedList with IForwardIterator
const head: LinkedListNode<number> = new LinkedListNode(1);
head.next = new LinkedListNode(2);
head.next.next = new LinkedListNode(42);
const begin = new LinkedListIterator(head);
const end = new LinkedListIterator<number>(undefined);

console.log(`--------------${__filename}----------`);

// 1 2 42
console.log(nthLast(begin, end, 3));

const arr = [1, 2, 3, 4, 5];
const begin2 = new ArrayIterator(arr, 0);
const end2 = new ArrayIterator(arr, arr.length);
console.log(nthLast(begin2, end2, 1).get());
