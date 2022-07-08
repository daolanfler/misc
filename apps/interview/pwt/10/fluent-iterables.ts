import { getRandomNumber } from "../09-Generics/Exercise";

class FluentIterator<T> implements Iterable<T>{
  private iter: Iterable<T>;

  constructor(iter: Iterable<T>) {
    this.iter = iter;
  }

  [Symbol.iterator]() {
    return this.iter[Symbol.iterator]();
  }
  // getIter(): Iterable<T> {
  //   return this.iter;
  // }

  private *filterImpl(pred: (item: T) => boolean): IterableIterator<T> {
    for (const item of this.iter) {
      if (pred(item)) {
        yield item;
      }
    }
  }

  filter(pred: (item: T) => boolean): FluentIterator<T> {
    return new FluentIterator(this.filterImpl(pred));
  }

  private *mapImpl<U>(func: (item: T) => U): IterableIterator<U> {
    for (const item of this.iter) {
      yield func(item);
    }
  }

  map<U>(func: (item: T) => U): FluentIterator<U> {
    return new FluentIterator(this.mapImpl(func));
  }

  private *takeImpl(count: number): IterableIterator<T> {
    for (const item of this.iter) {
      if (count-- > 0) {
        yield item;
      } else {
        break;
      }
    }
  }

  take(count: number): FluentIterator<T> {
    return new FluentIterator(this.takeImpl(count));
  }

  private *dropImpl(count: number): IterableIterator<T> {
    for (const item of this.iter) {
      if (count -- > 0) continue;
      yield item;
    }
  }

  drop(count: number): FluentIterator<T> {
    return new FluentIterator(this.dropImpl(count));
  }
}

const instance = new FluentIterator(getRandomNumber());

console.log(`--------- ${__filename} ---------`);
const iter2 = instance
  .take(20)
  .filter((n) => n > 0.5)
  .map((item) => {
    return 100 * item;
  });

for (const item of iter2) {
  console.log(item);
}

// the `instance.iter` is also exhausted by the for...of loop; 
console.log("instance next ? ",instance[Symbol.iterator]().next());
// so here we need a new "data source"
const iter3 = new FluentIterator(getRandomNumber()).take(100).drop(98);


console.log('----------- drop -----------');
for (const item of iter3) {
  console.log(item);
}