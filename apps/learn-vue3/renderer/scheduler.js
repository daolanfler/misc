const queue = new Set();

let isFlushing = false;

const p = Promise.resolve();

export function queueJob() {
  queue.add(this);
  if (!isFlushing) {
    isFlushing = true;
    p.then(() => {
      try {
        queue.forEach((effect) => effect.fn());
      } finally {
        isFlushing = false;
        queue.clear();
      }
    });
  }
}
