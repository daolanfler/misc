const Person1 = (function() {
  let name = Symbol('name');
  class Person {
    constructor(name) {
      this[name] = name;
    }
    getName() {
      return this[name];
    }
  }
  return Person;
})(); // 所有 instance 共享一个 name

class Person2 {
  constructor(name) {
    this.getName = function() {
      return name;
    };
  }
}

const Person3 = (function() {
  let w = new WeakMap();
  class Person {
    constructor(name) {
      w.set(this, { name });
    }
    getName() {
      return w.get(this).name;
    }
  }
  return Person;
})(); // 每个 instance 都有不同的name

const selfInstanceOf = function(left, right) {
  let proto = Object.getPrototypeOf(left);
  if (proto === null) return false;
  if (proto === right.prototype) return true;
  return selfInstanceOf(proto, right);
};
