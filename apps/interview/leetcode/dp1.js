// function f(n) {
//   const cache = { 0: 0 };
//   for (let i = 1; i <= n; i++) {
//     let cost = Infinity;
//     if (i - 1 >= 0) cost = Math.min(cost, cache[i - 1] + 1);
//     if (i - 5 >= 0) cost = Math.min(cost, cache[i - 5] + 1);
//     if (i - 11 >= 0) cost = Math.min(cost, cache[i - 11] + 1);
//     cache[i] = cost;
//   }
//   return cache[n];
// }

// console.log(f(100000));

function lis(arr) {
    let i,
        k,
        p,
        ans = 0,
        cache = {};
    for (i = 0; i < arr.length; i++) {
        cache[i] = 1;
    }
    for (k = 0; k < arr.length; k++) {
        for (p = 0; p < k; p++) {
            if (arr[p] < arr[k]) cache[k] = Math.max(cache[k], cache[p] + 1);
        }
    }
    for (i = 0; i < arr.length; i++) {
        ans = Math.max(ans, cache[i]);
    }
    return ans;
}

console.log(lis([1, 5, 3, 4, 6, 9, 7, 8]));
