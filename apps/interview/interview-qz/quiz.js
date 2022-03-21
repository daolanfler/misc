let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

function flatArr(arr, result = []) {
  return arr.reduce((res, item) => {
    if (Array.isArray(item)) {
      return [...new Set([...res, ...flatArr(item)])];
    } else {
      return [...new Set([...res, item])];
    }
  }, result);
}

console.log(flatArr(arr));

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}


function throttle(fn, delay) {
  let canRun = true;
  return function (...args) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, delay);
  };
}

// 限制最大并发数的 promise 
async function asyncPoll(poolLimit, arr, iteratorFn) {
  let result = [];
  let executing = [];
  for (let item of arr) {
    let p = Promise.resolve().then(() => iteratorFn(item, arr));
    result.push(p);
    if (poolLimit < arr.length) {
      let e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e); 
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }

  }
  return Promise.all(result);
}