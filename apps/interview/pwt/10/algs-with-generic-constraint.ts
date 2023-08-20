import { LinkedListNode } from "../09-Generics/Iterator";

enum ComparisonResult {
    LessThan,
    Equal,
    GreaterThan,
}

interface IComparable<T> {
    compareTo(value: T): ComparisonResult;
}

function clamp<T extends IComparable<T>>(a: T, start: T, end: T): T {
    if (a.compareTo(start) === ComparisonResult.LessThan) {
        return start;
    } else if (a.compareTo(end) === ComparisonResult.GreaterThan) {
        return end;
    } else {
        return a;
    }
}

interface IReadable<T> {
    get(): T;
}

interface IWritable<T> {
    set(value: T): void;
}

interface IIncrementable {
    increment(): void;
}

export interface IForwardIterator<T>
    extends IReadable<T>,
    IWritable<T>,
    IIncrementable {
    equals(other: IForwardIterator<T>): boolean;
    clone(): IForwardIterator<T>;
}

export class LinkedListIterator<T> implements IForwardIterator<T> {
    private node: LinkedListNode<T> | undefined;

    constructor(node: LinkedListNode<T> | undefined) {
        this.node = node;
    }

    get(): T {
        if (!this.node) throw Error();
        return this.node.value;
    }

    set(value: T): void {
        if (!this.node) throw Error();
        this.node.value = value;
    }

    equals(other: IForwardIterator<T>): boolean {
        return this.node == (<LinkedListIterator<T>>(other as unknown)).node;
    }

    clone(): IForwardIterator<T> {
        if (!this.node) throw new Error();
        return new LinkedListIterator(this.node);
    }

    increment(): void {
        this.node = this.node?.next;
    }
}

function find<T>(
    begin: IForwardIterator<T>,
    end: IForwardIterator<T>,
    pred: (value: T) => boolean,
): IForwardIterator<T> {
    while (!begin.equals(end)) {
        if (pred(begin.get())) {
            return begin;
        }
        begin.increment();
    }
    return end;
}

const head: LinkedListNode<number> = new LinkedListNode(1);

head.next = new LinkedListNode(2);

head.next.next = new LinkedListNode(42);
const begin = new LinkedListIterator(head);
const end = new LinkedListIterator<number>(undefined);

const iter = find(begin, end, (n) => n === 42);

console.log(`----------- ${__filename} -----`);
if (!iter.equals(end)) {
    console.log(iter.get());
    iter.set(444);
    console.log(iter.get());
}

export interface IBidirectionalIterator<T>
    extends IReadable<T>,
    IIncrementable,
    IWritable<T> {
    decrement(): void;
    equals(other: IBidirectionalIterator<T>): boolean;
    clone(): IBidirectionalIterator<T>;
}

export interface IRandomAccessIterator<T>
    extends IReadable<T>,
    IIncrementable,
    IWritable<T> {
    decrement(): void;
    equals(other: IRandomAccessIterator<T>): boolean;
    clone(): IRandomAccessIterator<T>;
    move(n: number): void;
    distance(other: IRandomAccessIterator<T>): number;
}

export class ArrayIterator<T> implements IRandomAccessIterator<T> {
    private array: T[];
    private index: number;

    constructor(arr: T[], index: number) {
        this.array = arr;
        this.index = index;
    }

    get(): T {
        return this.array[this.index];
    }

    set(value: T): void {
        this.array[this.index] = value;
    }

    equals(other: IRandomAccessIterator<T>): boolean {
        return this.index === (<ArrayIterator<T>>(other as unknown)).index;
    }

    increment(): void {
        this.index++;
    }

    decrement(): void {
        this.index--;
    }

    clone(): IRandomAccessIterator<T> {
        return new ArrayIterator(this.array, this.index);
    }

    move(n: number): void {
        this.index += n;
    }

    distance(other: IRandomAccessIterator<T>): number {
        return this.index - (<ArrayIterator<T>>(other as unknown)).index;
    }
}

function reverse<T>(
    begin: IRandomAccessIterator<T>,
    end: IRandomAccessIterator<T>,
): void {
    while (!begin.equals(end)) {
        end.decrement();
        if (begin.equals(end)) return;

        const temp = begin.get();
        begin.set(end.get());
        end.set(temp);

        begin.increment();
    }
}

const arr = [1, 2, 3, 4, 5];

const aBegin = new ArrayIterator(arr, 0);
const aEnd = new ArrayIterator(arr, arr.length);
reverse(aBegin, aEnd);
console.log(arr);
