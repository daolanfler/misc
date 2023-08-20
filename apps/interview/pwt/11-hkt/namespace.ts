// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SumType {
    export function map<T, U>(
        value: T | undefined,
        func: (item: T) => U,
    ): U | undefined {
        if (value === undefined) {
            return undefined;
        }
        return func(value);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Box {
    export class Box<T> {
        value: T;
        constructor(value: T) {
            this.value = value;
        }
    }
    export function map<T, U>(box: Box<T>, func: (value: T) => U) {
        return new Box(func(box.value));
    }
}

console.log(Box.map(new Box.Box(12), (n) => n + ""));

export const a = 12;
