import { reactive } from "./index.js";

export function ref(val) {
  const wrapper = {
    value: val,
  };

  Object.defineProperty(wrapper, "__v_isRef", { value: true });

  return reactive(wrapper);
}

export function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key];
    },
    set value(val) {
      obj[key] = val;
    },
  };
  Object.defineProperty(wrapper, "__v_isRef", { value: true });

  return wrapper;
}

export function toRefs(obj) {
  const ret = {};
  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }
  return ret;
}

// 自动脱 ref, setup 函数返回的数据会传递给 proxyRefs 函数进行处理。reactive 也有自动脱ref 的功能
export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return value.__v_isRef ? value.value: value;
    },
    set(target, key, newValue, receiver) {
      const value = target[key];

      if (value.__v_isRef) {
        value.value = newValue;
        return true;
      }
      return Reflect.set(target, key, newValue, receiver);
    }
  });
}