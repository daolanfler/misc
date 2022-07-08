// interface Box<T> {
//   thing: T;
// }

import { BinaryTreeNode } from "./Iterator";

// type unbox<T> = (box: Box<T>) => T;

class Box<T> {
  thing: T;

  constructor(a: T) {
    this.thing = a;
  }
}

function unbox<T>(box: Box<T>): T {
  return box.thing;
}

class Stack<T> {
  private values: T[];

  constructor() {
    this.values = [];
  }

  push(value: T): void {
    this.values.push(value);
  }

  pop(): T {
    if (!this.values.length) throw new Error("Stack in empty");
    return this.values.pop() as T;
  }

  peek(): T {
    if (this.values.length === 0) throw new Error("Nothing to peek");
    return this.values[this.values.length];
  }
}

class Pair<T, U> {
  first: T;
  second: U;

  constructor(first: T, second: U) {
    this.first = first;
    this.second = second;
  }
}

function* startOrderGen<T>(root: BinaryTreeNode<T>): IterableIterator<T> {
  yield root.value;

  if (root.left !== undefined) {
    for (const value of startOrderGen(root.left)) {
      yield value;
    }
  }

  if (root.right !== undefined) {
    for (const value of startOrderGen(root.right)) {
      yield value;
    }
  }
}

const root = new BinaryTreeNode(5);
root.left = new BinaryTreeNode(3);
root.right = new BinaryTreeNode(6);
root.left.left = new BinaryTreeNode(2);
root.left.right = new BinaryTreeNode(4);
root.left.left.left = new BinaryTreeNode(1);

console.log('----------- Exercise ----------');

for (const num of startOrderGen(root)) {
  console.log(num);
}


function* iterateArr<T>(arr: T[]): IterableIterator<T> {
  for (const item of arr) {
    yield item;
  }
}

export function* getRandomNumber() {
  while(true) {
    yield Math.random();
  }
}

function* square(iter: Iterable<number>) {
  for (const n of iter) {
    yield n * n;
  }
}

function* take<T>(iter: Iterable<T>, count: number): IterableIterator<T> {
  for (const value of iter) {
    if (count-- <= 0) return;
    yield value;
  }
}

const tenNums = take(square(getRandomNumber()), 10);

function* drop<T>(iter: Iterable<T>, count: number): IterableIterator<T> {
  for (const value of iter) {
    if (count -- >0) continue;
    yield value;
  }
}

for (const n of drop(tenNums, 8)) {
  console.log(n);
}