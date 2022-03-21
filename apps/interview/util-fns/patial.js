// 偏函数
const partialFunc = function(func, ...args) {
  let placeholderNum = 0;
  return (...args2) => {
    args2.forEach(arg => {
      let index = args.findIndex(item => item === '_');
      if (index < 0) return;
      args[index] = arg;
      placeholderNum++;
    });
    if (placeholderNum < func.length) {
      args2 = args2.slice(placeholderNum);
    }
    return func.apply(this, [...args, ...args2]);
  };
};

const bindParams = function(fn, ...args) {
  return (...args2) => {
    return fn.apply(this, [...args, ...args2]);
  };
};

let add = (a, b, c, d) => a + b + c + d;

let patialAdd = partialFunc(add, '_', 2, '_');
console.log(patialAdd(1, 3, 4));
