import { Optional } from "../03/Optional";
import { Either } from "../04/4-3";

declare const filehandle: unique symbol;

interface FileHandle {
    [filehandle]: void;
}

interface Cat {
    meow(): void;
}

declare function openFile(path: string): Either<Error, FileHandle>;

declare function readFile(handle: FileHandle): Either<Error, string>;

declare function deserializeCat(serializedCat: string): Either<Error, Cat>;

function readCatFromFile(path: string): Either<Error, Cat> {
    const handle = openFile(path);

    if (handle.isLeft()) return Either.makeLeft(handle.getLeft());

    const content = readFile(handle.getRight());

    if (content.isLeft()) return Either.makeLeft(content.getLeft());

    return deserializeCat(content.getRight());
}

function map<TLeft, TRight, URight>(
    value: Either<TLeft, TRight>,
    func: (value: TRight) => URight,
): Either<TLeft, URight> {
    if (value.isLeft()) return Either.makeLeft(value.getLeft());
    return Either.makeRight(func(value.getRight()));
}

// function readCatFromFile2(path: string): Either<Error, Cat> {
//   const handle = openFile(path);
//   const content: Either<Error, string> = map(handle, readFile);
// }

function bind<TLeft, TRight, URight>(
    value: Either<TLeft, TRight>,
    func: (value: TRight) => Either<TLeft, URight>,
): Either<TLeft, URight> {
    if (value.isLeft()) {
        return Either.makeLeft(value.getLeft());
    }
    return func(value.getRight());
}

function readCatFromFile3(path: string): Either<Error, Cat> {
    const handle = openFile(path);

    const content = bind(handle, readFile);

    return bind(content, deserializeCat);
}

// what is a monad ?
// unit: (value: T) => H<T>
// bind: (value: H<T>, fn: (value: T) => H<U>) => H<U>

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace OptionalNS {
    export function unit<T>(value: T): Optional<T> {
        return new Optional(value);
    }

    export function bind<T, U>(
        optional: Optional<T>,
        func: (value: T) => Optional<U>,
    ): Optional<U> {
        if (!optional.hasValue()) return new Optional();
        return func(optional.getValue());
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace LazyNS {
  type Lazy<T> = () => T;

  export function unit<T>(value: T): Lazy<T> {
      return () => value;
  }

  export function bind<T, U>(
      f1: Lazy<T>,
      func: (value: T) => Lazy<U>,
  ): Lazy<U> {
      return func(f1());
  }

  export function map<T, U>(f1: Lazy<T>, func: (vlaue: T) => U): Lazy<U> {
      // return unit(func(f1()));
      return () => func(f1());
  }
}
