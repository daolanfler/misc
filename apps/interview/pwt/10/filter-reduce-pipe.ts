import { binaryTreeGen, BinaryTreeNode } from "../09-Generics/Iterator";

const root = new BinaryTreeNode(5);
root.left = new BinaryTreeNode(3);
root.right = new BinaryTreeNode(6);
root.left.left = new BinaryTreeNode(2);
root.left.right = new BinaryTreeNode(4);
root.left.left.left = new BinaryTreeNode(1);

function* map<T, U>(
    iter: Iterable<T>,
    fn: (item: T) => U,
): IterableIterator<U> {
    for (const item of iter) {
        yield fn(item);
    }
}

function* filter<T>(
    iter: Iterable<T>,
    fn: (item: T) => boolean,
): IterableIterator<T> {
    for (const item of iter) {
        if (fn(item)) {
            yield item;
        }
    }
}

function reduce<T>(
    iter: Iterable<T>,
    fn: (acc: T, item: T) => T,
    initial: T,
): T {
    let result: T = initial;
    for (const item of iter) {
        result = fn(result, item);
    }
    return result;
}

const result = reduce(
    filter(binaryTreeGen(root), (n) => n % 2 === 0),
    (sum, n) => sum + n,
    0,
);

console.log("----- 哟哟哟 -------");
console.log(result);

function concatenateNonEmpty(iter: Iterable<string>): string {
    return reduce(
        filter(iter, (char) => char !== " "),
        (res, char) => res + char,
        "",
    );
}

console.log(concatenateNonEmpty("May you stay forever young!"));

function squareOdds(iter: Iterable<number>): IterableIterator<number> {
    return map(
        filter(iter, (n) => n % 2 === 1),
        (x: number) => x * x,
    );
}

function* getNumber(): IterableIterator<number> {
    let n = 0;
    while (true) {
        yield n;
        n ++;
    }
}

let start = 1; 
for (const value of squareOdds(getNumber())) {
    if (start ++ <= 10) {
        console.log(value);
    } else {
        break;
    }
}