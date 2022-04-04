import {
  effect,
  reactive,
  ref,
  shallowReactive,
  shallowReadonly,
} from "@vue/reactivity";
import { queueJob } from "./scheduler";
import { getSequence, normalizeClass } from "./shared";

const Text = Symbol();
const Comment = Symbol();
const Fragment = Symbol();
// function renderer(domString, container) {
//   container.innerHTML = domString;
// }

// const count = ref(1);

// effect(() => {
//   renderer(`<div>${count.value}</div>`, document.getElementById("app"));
// });

// count.value++;

function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    createText,
    setText,
    patchProps,
  } = options;

  function patchKeyedChildren(n1, n2, container) {
    const newChildren = n2.children;
    const oldChildren = n1.children;

    let j = 0;
    let oldVNode = oldChildren[j];
    let newVNode = newChildren[j];
    while (oldVNode.key === newVNode.key) {
      patch(oldVNode, newVNode, container);
      j++;
      oldVNode = oldChildren[j];
      newVNode = newChildren[j];
    }

    let oldEnd = oldChildren.length - 1;
    let newEnd = newChildren.length - 1;

    oldVNode = oldChildren[oldEnd];
    newVNode = newChildren[newEnd];

    while (oldVNode.key === newVNode.key) {
      patch(oldVNode, newVNode, container);
      oldEnd--;
      newEnd--;
      oldVNode = oldChildren[oldEnd];
      newVNode = newChildren[newEnd];
    }

    if (j > oldEnd && j <= newEnd) {
      const anchorIndex = newEnd + 1;
      const anchor =
        anchorIndex < newChildren.length ? newChildren[anchorIndex] : null;

      while (j <= newEnd) {
        patch(null, newChildren[j++], container, anchor);
      }
    } else if (j > newEnd && j <= oldEnd) {
      while (j <= oldEnd) {
        unmount(oldChildren[j++]);
      }
    } else {
      const count = newEnd - j + 1;
      const sources = new Array(count);
      sources.fill(-1);

      const oldStart = j;
      const newStart = j;

      let moved = false;
      let pos = 0;
      const keyIndex = {};
      for (let i = newStart; i <= newEnd; i++) {
        keyIndex[newChildren[i].key] = i;
      }

      let patched = 0; // 更新过的节点数量
      for (let i = oldStart; i < oldEnd; i++) {
        oldVNode = oldChildren[i];
        if (patched <= count) {
          const k = keyIndex[oldVNode.key];
          if (typeof k !== "undefined") {
            newVNode = newChildren[k];
            patch(oldVNode, newVNode, container);
            patched++;
            sources[k - newStart] = i;
            if (k < pos) {
              moved = true;
            } else {
              pos = k;
            }
          } else {
            unmount(oldVNode);
          }
        } else {
          unmount(oldVNode);
        }
      }
      if (moved) {
        const seq = getSequence(sources);

        let s = seq.length - 1;
        let i = count - 1;

        for (i; i >= 0; i--) {
          if (sources[i] === -1) {
            // 是新增
            const pos = i + newStart;
            const newVNode = newChildren[pos];

            const nextPos = pos + 1;
            const anchor =
              nextPos < newChildren.length ? newChildren[nextPos].el : null;
            patch(null, newVNode, container, anchor);
          } else if (i !== seq[s]) {
            // 该节点需要移动
            const pos = i + newStart;
            const newVNode = newChildren[pos];
            const nextPos = pos + 1;
            const anchor =
              nextPos < newChildren.length ? newChildren[nextPos].el : null;
            // 上面的循环有 patch 过，newVNode 上有 el
            insert(newVNode.el, container, anchor);
          } else {
            // 该节点不需要移动 (最长递增子序列的含义)
            s--;
          }
        }
      }
    }
  }

  function patchElement(n1, n2) {
    // DOM 节点的复用
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;

    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }

    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    patchChildren(n1, n2, el);
  }

  function patchChildren(n1, n2, container) {
    if (typeof n2.children === "string") {
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c));
      }

      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        patchKeyedChildren(n1, n2, container);
      } else {
        setElementText(container, "");
        n2.children.forEach((c) => patch(null, c, container));
      }
    } else {
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c));
      } else if (typeof n1.children === "string") {
        setElementText(container, "");
      }
    }
  }

  function patch(n1, n2, container, anchor) {
    if (n1 && n1.type !== n2.type) {
      // 如果 n1 存在，新旧node 的类型不同则直接卸载
      unmount(n1);
      n1 = null;
    }
    const { type } = n2;
    if (typeof type === "string") {
      if (!n1) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2);
      }
    } else if (type === Text) {
      if (!n1) {
        const el = (n2.el = createText(n2.children));
        insert(el, container);
      } else {
        const el = (n2.el = n1.el);
        // 如果旧节点存在则直接更新节点
        if (n2.children !== n1.children) {
          // el.nodeValue = n2.children;
          setText(el, n2.children);
        }
      }
    } else if (type === Fragment) {
      if (!n1) {
        n2.children.forEAch((c) => patch(null, c, container));
      } else {
        patchChildren(n1, n2, container);
      }
    } else if (typeof type === "object") {
      // 组件
      if (!n1) {
        mountComponent(n2, container, anchor);
      } else {
        patchComponent(n1, n2, anchor);
      }
    } else {
      // other type vnode
    }
  }

  function patchComponent(n1, n2, anchor) {
    const instance = (n2.component = n1.component);
    const { props } = instance;
    if (hasPropsChanged(n1.props, n2.props)) {
      const [nextProps] = resolveProps(n2.type.props, n2.props);

      for (const k in nextProps) {
        props[k] = nextProps[k];
      }

      for (const k in props) {
        if (!(k in nextProps)) delete props[k];
      }
    }
  }

  function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps)) {
      return true;
    }

    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key]) return true;
    }
    return false;
  }

  function resolveProps(options, propsData) {
    const props = {};
    const attrs = {};
    for (const key in propsData) {
      if (key in options || key.startsWith('on')) {
        props[key] = propsData[key];
      } else {
        attrs[key] = propsData[key];
      }
    }
    return [props, attrs];
  }

  function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type;

    let {
      render,
      data,
      setup,
      props: propsOption,
      beforeCreate,
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
    } = componentOptions;
    beforeCreate && beforeCreate();

    const state = data ? reactive(data()) : null;
    const [props, attrs] = resolveProps(propsOption, vnode.props);

    const instance = {
      state,
      isMounted: false,
      subTree: null,
      props: shallowReactive(props),
    };

    function emit(event, ...palyload) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
      const handler = instance.props[eventName]
      if (handler) {
        handler(...palyload)

      } else {
        console.error('时间处理函数不存在')
      }
    }
    
    const setupContext = { attrs, emit };
    const setupResult =
      setup && setup(shallowReadonly(instance.props), setupContext);
    let setupState = null;
    if (typeof setupResult === "function") {
      if (render) console.error("setup 函数返回渲染函数，render 选项将被忽略");
      render = setupResult;
    } else if (setupResult) {
      setupState = setupResult;
    }

    vnode.component = instance;

    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props } = t;
        if (state && k in state) {
          return state[k];
        } else if (props && k in props) {
          return props[k];
        } else if (setupState && k in setupState) {
          return setupState[k];
        } else {
          console.error("不存在");
        }
      },
      set(t, k, v) {
        const { state, props } = t;
        if (state && k in state) {
          return Reflect.set(state, k, v);
        } else if (props && k in props) {
          return Reflect.set(props, k, v);
        } else if (setupState && k in setupState) {
          return Reflect.set(setupState, k, v)
        } else {
          console.error("不存在");
        }
      },
    });

    created && created.call(renderContext);
    effect(
      () => {
        const subTree = render.call(renderContext, renderContext);
        if (!instance.isMounted) {
          beforeMount && beforeMount.call(renderContext);
          patch(null, subTree, container, anchor);
          instance.isMounted = true;
          mounted && mounted.call(renderContext);
        } else {
          beforeUpdate && beforeUpdate.call(renderContext);
          patch(instance.subTree, subTree, container, anchor);
          updated && updated.call(renderContext);
        }
        instance.subTree = subTree;
        console.log(subTree);
      },
      {
        scheduler: queueJob,
      }
    );
  }

  function mountElement(vnode, container, anchor) {
    // el 引用真实的 DOM 元素
    const el = (vnode.el = createElement(vnode.type));
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, el);
      });
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    insert(el, container, anchor);
  }

  function unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach((c) => unmount(c));
      return;
    }
    const parent = vnode.el.parentNode;
    if (parent) {
      parent.removeChild(vnode.el);
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        unmount(container._vnode);
      }
    }
    container._vnode = vnode;
  }

  return { render };
}

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.innerText = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  setText(el, text) {
    el.nodeValue = text;
  },
  patchProps(el, key, preValue, nextValue) {
    // Difference between DOM Properties and HTML Attributes
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {});
      let invoker = invokers[key];
      const name = key.slice(2).toLowerCase();
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            // 事件触发时间早于函数绑定时间，则不执行事件处理函数
            if (e.timeStamp < invoker.attached) return;
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e));
            } else {
              invoker.value(e);
            }
          };
          invoker.value = nextValue;
          // 时间处理函数被绑定的时间
          invoker.attached = performance.now();
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = normalizeClass(nextValue) || "";
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, vnode.props[key]);
    }
  },
});

function shouldSetAsProps(el, key, nextValue) {
  return key in el;
}

const vnode = {
  type: "h1",
  props: {
    class: {
      foo: true,
      bar: true,
    },
  },
  children: "Hello World How",
};

const MyComponent = {
  name: "MyComponent",
  data() {
    return {
      foo: "hello world",
    };
  },
  props: {
    bool: Boolean,
  },
  render() {
    return {
      type: "div",
      children: `the value of foo is ${this.foo}, bool is ${this.bool.value}`,
      props: {
        onClick: () => {
          this.foo = Math.random();
        },
      },
    };
  },
};

// const container = { type: "root" };

// renderer.render(vnode, document.querySelector("#app"));

const bol = ref(false);

effect(() => {
  const vnode = {
    type: "div",
    props: bol.value
      ? {
        onClick: () => {
          alert("父元素 clicked");
        },
      }
      : {},
    children: [
      {
        type: "p",
        props: {
          onClick: () => {
            bol.value = true;
          },
        },
        children: "text",
      },
      {
        type: MyComponent,
        props: {
          bool: bol,
        },
      },
    ],
  };
  console.log("effect", bol.value);
  renderer.render(vnode, document.querySelector("#app"));
});
