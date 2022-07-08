/** TypeScript cann't compile below  */
// interface Functor<H<T>> {
//   map<U>(func: (value: T) => U): H<U>;
// }

// class Box<T> implements Functor<Box<T>> {
//   value: T;
//   constructor(value: T) {
//     this.value = value;
//   }

//   map<U>(func: (value: T) => U): Box<U> {
//     return new Box(func(this.value))
//   }
// }

// functor of function
function map<T, U>(
  f1: (arg1: T, arg2: T) => T,
  f2: (arg: T) => U,
): (arg1: T, arg2: T) => U {
  return (arg1: T, arg2: T) => f2(f1(arg1, arg2));
}

function add(x: number, y: number) {
  return x + y;
}

function strigify(n: number) {
  return n.toString();
}

const ss = map(add, strigify)(12, 44);
console.log(ss);

interface IReader<T> {
  read(): T;
}

class MappedReader<T, U> implements IReader<U> {
  value: IReader<T>;
  func: (value: T) => U;
  constructor(value: IReader<T>, func: (value: T) => U) {
    this.value = value;
    this.func = func;
  }
  read(): U {
    return this.func(this.value.read());
  }
}

function map2<T, U>(value: IReader<T>, func: (value: T) => U): IReader<U> {
  return new MappedReader(value, func);
}
