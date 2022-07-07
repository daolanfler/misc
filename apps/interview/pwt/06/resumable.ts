function* counter(): Generator<number> {
  let count = 0;
  while (true) {
    yield ++count;
  }
}


function createFib(): () => number {
  let prev = 0;
  let cur = 1;
  return () => {
    const temp = cur;
    cur = cur + prev;
    prev = temp;
    return prev;
  };
}

const fib = createFib();

function* fibGen() {
  let prev = 0;
  let cur = 1;
  while (true) {
    const temp = cur;
    cur = cur + prev;
    prev = temp;
    yield prev;
  }
}
const fib2 = fibGen();

console.log(fib2.next());
console.log(fib2.next());
console.log(fib2.next());
console.log(fib2.next());
console.log(fib2.next());
console.log(fib2.next());
console.log(fib2.next());
