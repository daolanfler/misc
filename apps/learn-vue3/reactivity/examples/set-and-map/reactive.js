let activeEffect;
let effectStack = [];
let shouldTrack = true;
const bucket = new WeakMap();
const ITERATE_KEY = Symbol();
const MAP_KEY_ITERATE_KEY = Symbol();
// 储存原始值到代理对象的映射
const reactiveMap = new Map();

const arrayInstrumentations = {};

function iterationMethod() {
  const target = this.raw;
  const itr = target[Symbol.iterator]();

  const wrap = (val) => (typeof val === "object" ? reactive(val) : val);

  track(target, ITERATE_KEY);
  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: value ? [wrap(value[0]), wrap(value[1])] : value,
        done,
      };
    },
    // 实现可迭代协议 (有next 方法为实现了迭代器协议)
    [Symbol.iterator]() {
      return this;
    },
  };
}

function valuesIterationMethod() {
  const target = this.raw;
  const itr = target.values();

  const wrap = (val) => (typeof val === "object" ? reactive(val) : val);

  track(target, ITERATE_KEY);

  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: wrap(value),
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

function keysIterationMethod() {
  const target = this.raw;
  const itr = target.keys();

  const wrap = (val) => (typeof val === "object" ? reactive(val) : val);

  track(target, MAP_KEY_ITERATE_KEY);

  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: wrap(value),
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

const mutableInstructions = {
  add(key) {
    const target = this.raw;
    const hadKey = target.has(key);
    const res = target.add(key);
    if (!hadKey) {
      trigger(target, key, "ADD");
    }
    return res;
  },

  delete(key) {
    const target = this.raw;
    const hadKey = target.has(key);
    const res = target.delete(key);
    if (hadKey) {
      trigger(target, key, "DELETE");
    }
    return res;
  },

  get(key) {
    // 获取原始对象
    const target = this.raw;
    const had = target.has(key);

    track(target, key);
    if (had) {
      const res = target.get(key);
      return typeof res === "object" ? reactive(res) : res;
    }
  },

  set(key, value) {
    const target = this.raw;
    const had = target.has(key);
    const oldVal = target.get(key);

    // 获取原始数据，由于 value 本身可能已经是原始数据，所以此时 value.raw 不存在，则直接使用 value
    // raw 可能与用户定义的属性同名，实际情况中应该用 symbol
    // Set 类型的 add 方法、普通对象的写值操作，还有为数组添加元素的方法等，都需要做类似的处理。
    const rawValue = value.raw || value;
    const res = target.set(key, rawValue);

    if (!had) {
      trigger(target, key, "ADD");
    } else if (
      value !== oldVal ||
      (typeof value === "object" && value !== null)
    ) {
      trigger(target, key, "SET", value);
    }
    return res;
  },

  forEach(callback, thisArg) {
    const wrap = (val) => (typeof val === "object" ? reactive(val) : val);
    const target = this.raw;
    track(target, ITERATE_KEY);

    target.forEach((v, k) => {
      callback.call(thisArg, wrap(v), wrap(k), this);
    });
  },

  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod,
  values: valuesIterationMethod,
  keys: keysIterationMethod,
};

["includes", "indexOf", "lastIndexOf"].forEach((method) => {
  const original = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    // this 指向代理对象
    let res = original.apply(this, args);

    if (res === false) {
      res = original.apply(this.raw, args);
    }
    return res;
  };
});

["push", "pop", "shift", "unshift", "splice"].forEach((method) => {
  const original = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    shouldTrack = false;
    const res = original.apply(this, args);
    shouldTrack = true;
    return res;
  };
});

export function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === "raw") {
        return target;
      }
      if (key === "size") {
        track(target, ITERATE_KEY);
        return Reflect.get(target, key, target);
      }
      return mutableInstructions[key];
      // // if (key === Symbol.iterator) {
      // //   console.log('读取了 Symbol.iterator 属性')
      // // }
      // // 代理对象时，可以通过 raw 访问原始数据
      // if (key === "raw") {
      //   return target;
      // }

      // // 重写部分数组上的方法
      // if (
      //   Array.isArray(target) &&
      //   Object.prototype.hasOwnProperty.call(arrayInstrumentations, key)
      // ) {
      //   return Reflect.get(arrayInstrumentations, key, receiver);
      // }

      // if (!isReadonly && typeof key !== "symbol") {
      //   track(target, key);
      // }
      // // receiver 表示谁在读取属性
      // const res = Reflect.get(target, key, receiver);
      // if (isShallow) return res;
      // if (typeof res === "object" && res !== null) {
      //   return isReadonly ? readonly(res) : reactive(res);
      // }
      // return res;
    },

    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const oldVal = target[key];

      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? "SET"
          : "ADD"
        : Object.prototype.hasOwnProperty.call(target, key)
          ? "SET"
          : "ADD";

      const res = Reflect.set(target, key, newVal, receiver);
      // target === receiver.raw 说明receiver 就是代理对象。原型对象上不触发
      if (target === receiver.raw) {
        // 不全等，并且都不是 NAN 的时候才触发响应
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type, newVal);
        }
      }
      return res;
    },

    // in
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },

    // for ... in
    ownKeys(target) {
      track(target, Array.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    },

    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);

      if (res && hadKey) {
        trigger(target, key, "DELETE");
      }
      return res;
    },
  });
}

export function reactive(obj) {
  const exsistionProxy = reactiveMap.get(obj);
  if (exsistionProxy) return exsistionProxy;
  const proxy = createReactive(obj, false);
  // 储存到 Map 中，从而帮忙重复创建
  reactiveMap.set(obj, proxy);
  return proxy;
}

export function shallowReactive(obj) {
  return createReactive(obj, true);
}

export function readonly(obj) {
  return createReactive(obj, false, true);
}

export function shallowReadonly(obj) {
  return createReactive(obj, true /* shallow */, true);
}

function track(target, key) {
  if (!activeEffect || !shouldTrack) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target);

  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();

  effects &&
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effectsToRun.add(effect);
      }
    });

  if (
    (type === "ADD" || type === "DELETE") &&
    Object.prototype.toString.call(target) === "[object Map]"
  ) {
    // 触发 map 的 key iteration 副作用
    const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY);
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (
    type === "ADD" ||
    type === "DELETE" ||
    // 如果操作类型是 SET, 并且目标对象是 Map 类型的数据，
    // 也应该触发那些与 ITERATE_KEY 相关联的副作用函数重新执行
    (type === "SET" &&
      Object.prototype.toString.call(target) === "[object Map]")
  ) {
    // for ... in effects
    const iterateEffects = depsMap.get(ITERATE_KEY);
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effect !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (type === "ADD" && Array.isArray(target)) {
    const lengthEffects = depsMap.get("length");
    lengthEffects &&
      lengthEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  // 如果操作的是数组，而且修改了数组的 length 属性
  if (Array.isArray(target) && key === "length") {
    // 对于索引大于或等于新长度的元素
    // 需要把所有相关联的副作用函数取出并添加到 effectsToRun 中待执行
    depsMap.forEach((effects, key) => {
      if (key >= newVal) {
        effects.forEach((effectFn) => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
      }
    });
  }

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // 副作用的集合
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// 定义一个任务队列
const jobQueue = new Set();

const p = Promise.resolve();

let isFlushing = false;

function flushJob() {
  if (isFlushing) return;

  isFlushing = true;

  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export function computed(getter) {
  // value 用来缓存上一次计算值
  let value;
  // 是否需要重新计算
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, "value");
      }
    },
  });
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, "value");
      return value;
    },
  };
  return obj;
}

export function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  let oldValue, newValue;
  let cleanup;

  function onInvalidate(fn) {
    cleanup = fn;
  }
  const job = () => {
    newValue = effectFn();
    // 先调用过期回调
    if (cleanup) {
      cleanup();
    }
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    scheduler: () => {
      if (options.flush === "post") {
        const p = Promise.resolve();
        p.then(job);
      } else {
        job();
      }
    },
    lazy: true,
  });
  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}

// 一个通用的读取操作，收集依赖，当响应数据发生变化时，触发 scheduler
function traverse(value, seen = new Set()) {
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);

  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
