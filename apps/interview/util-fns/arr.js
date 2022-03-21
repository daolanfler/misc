Array.prototype.selfReduce = function(fn, initialValue) {
  let arr = Array.prototype.slice.call(this);
  let res;
  let startIndex;
  if (initialValue === undefined) {
    for (let i = 0; i < arr.length; i++) {
      // 稀疏数组
      if (!Object.prototype.hasOwnProperty.call(arr, i)) continue;
      startIndex = i;
      res = arr[i];
      break;
    }
  } else {
    res = initialValue;
  }

  for (let i = ++startIndex || 0; i < arr.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(arr, i)) continue;
    res = fn.call(null, res, arr[i], i, this);
  }
  return res;
};


const selfFlat = function(depth = 1) {
  let arr = Array.prototype.slice.call(this);
  if (depth === 0) return arr;
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...selfFlat.call(cur, depth - 1)];
    } else {
      return [...pre, cur];
    }
  });
};
