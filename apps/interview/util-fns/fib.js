// 记忆 第一版
let memorize = function(fn) {
  let cache = {};
  return function recur(n) {
    if (cache[n] === undefined) cache[n] = fn(n, recur);
    return cache[n];
  };
};
let fib = function(n, recur) {
  if (n < 2) return n;
  return recur(n - 1) + recur(n - 2);
};
let optFib = memorize(fib);

console.log(optFib(100));

// 动态规划
function fib2(n) {
  const initial = [0, 1];
  if (n < 2) {
    return initial[n];
  }
  let i = 2;
  while (i <= n) {
    initial[1] = initial[0] + initial[1];
    initial[0] = initial[1] - initial[0];
    i ++;
  }
  return initial[1];
}

console.log(fib(1000));

// 函数记忆
function memorizer (memo, formula) {
  var recur = (n) => {
    let result = memo[n];
    if (result === undefined) {
      memo[n] = formula(recur, n);
      result = memo[n];
    }
    return result;
  };
  return recur;
}

let fib3 = memorizer([0,1], (recur, n) => recur(n-1) + recur(n-2));

console.log(fib2(1000));
