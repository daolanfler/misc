function curry(fn) {
  if (fn.length <= 1) return fn;
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      return (...args2) => {
        return generator(...args, ...args2);
      };
    }
  };
  return generator;
}

// let add = (a, b, c, d) => a + b + c + d
// const curryAdd = curry(add)
// curryAdd(1)(2)(3)(4)

function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

var initials = function(name) {
  return name
    .split(' ')
    .map(compose(toUpperCase, head))
    .join('. ');
};

var split = curry(function(separator, str) {
  return str.split(separator);
});
var head = function(str) {
  return str.slice(0, 1);
};
var toUpperCase = function(str) {
  return str.toUpperCase();
};
var join = curry(function(separator, arr) {
  return arr.join(separator);
});
var map = curry(function(fn, arr) {
  return arr.map(fn);
});

console.log(initials('kevin daisy kelly'));

// 换一种写法
var initials2 = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

console.log(initials2('kevin daisy kelly'));

const curry3 = (fn, placeholder = '_') => {
  curry3.placeholder = placeholder;
  if (fn.length <= 1) return fn;
  const argsList = [];
  const generator = (...args) => {
    let currentPlaceholderIndex = -1;
    args.forEach(arg => {
      let placeholderIndex = argsList.findIndex(
        item => item === curry3.placeholder
      );
      if (placeholderIndex < 0) {
        // 之前的占位符被填充完 或没有占位符
        currentPlaceholderIndex = argsList.push(arg) - 1;
      } else if (placeholderIndex !== currentPlaceholderIndex) {
        // 将占位符替换成 arg
        argsList[placeholderIndex] = arg;
      } else {
        // 当前轮连续出现 > 1 g个占位符
        argsList.push(arg);
      }
    });
    let realArgsList = argsList.filter(arg => arg !== curry3.placeholder);
    if (realArgsList.length === fn.length) {
      return fn(...argsList);
    } else if (realArgsList.length > fn.length) {
      throw new Error('超出初始函数参数最大值');
    } else {
      return generator;
    }
  };
  return generator;
};

let display = (a, b, c, d, e, f, g, h) => [a, b, c, d, e, f, g, h];
const curryDisplay = curry3(display);
var res = curryDisplay('_', '_', 3)('_', 1)(2, '_')(4, '_')(5, 6, 7, 8);
// 每一轮传入的参数去填充上一轮的占位符
console.log(res);
