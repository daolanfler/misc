import { isComplexDataType } from '../util';

function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType
    }
  });
  // 将 subType 的 [[prototype]] 设置为 superType，用来继承父类的静态方法 （object.[[prototype]] 和 object.prototype 是两个不同的概念）
  Object.setPrototypeOf(subType, superType);
}

class A {
  static getName() {
    console.log('name is A');
  }
}
class B extends A {}

B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true

// new
const selfNew = function(fn, ...rest) {
  let instance = Object.create(fn.prototype);
  let res = fn.apply(instance, res);
  return isComplexDataType(res) ? res : instance;
};

// 单例模式
function proxify(func) {
  let instance;
  return new Proxy(func, {
    construct(target, args) {
      if (!instance) {
        instance = Reflect.construct(target, args);
      }
      return instance;
    }
  });
}
