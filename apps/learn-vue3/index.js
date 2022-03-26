let activeEffect;
let effectStack = [];
const bucket = new WeakMap();
const ITERATE_KEY = Symbol();

const data = {
  foo: 1,
  get bar() {
    return this.foo;
  },
};

const obj = new Proxy(data, {
  get(target, key, receiver) {
    track(target, key);

    // receiver 表示谁在读取属性
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newVal, receiver) {
    const res = Reflect.set(target, key, receiver);

    trigger(target, key);
    return res;
  },
  // in
  has(target, key) {
    track(target, key);
    return Reflect.ha(target, key);
  },
  // for ... in
  ownKeys(target) {
    track(target, ITERATE_KEY);
    return Reflect.ownKeys(target);
  },
});

function track(target, key) {
  if (!activeEffect) return;
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

function trigger(target, key) {
  const depsMap = bucket.get(target);

  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();

  const iterateEffects = depsMap.get(ITERATE_KEY);

  effects &&
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effectsToRun.add(effect);
      }
    });
  iterateEffects &&
    iterateEffects.forEach((effectFn) => {
      if (effect !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

function effect(fn, options = {}) {
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

function computed(getter) {
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

function watch(source, cb, options = {}) {
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
// below is not implementation, just example

// watch(
//   () => obj.foo,
//   (value, oldVal) => {
//     console.log("数据变化了", value, oldVal);
//   },
//   {
//     immediate: true,
//   }
// );

// obj.foo++;

effect(() => {
  for (const key in obj) {
    console.log(key);
  }
});

obj.bar = 'random';
