import { effect, ref } from "@vue/reactivity";
import { normalizeClass } from "./shared";

// function renderer(domString, container) {
//   container.innerHTML = domString;
// }

// const count = ref(1);

// effect(() => {
//   renderer(`<div>${count.value}</div>`, document.getElementById("app"));
// });

// count.value++;

function createRenderer(options) {
  const { createElement, insert, setElementText, patchProps } = options;

  function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
      // 如果 n1 存在，新旧node 的类型不同则直接卸载
      unmount(n1);
      n1 = null;
    }
    const { type } = n2;
    if (typeof type === "string") {
      if (!n1) {
        mountElement(n2, container);
      } else {
        // patchElement(n1, n2)
      }
    } else if (typeof type === "object") {
      // 组件
    } else {
      // other type vnode
    }
  }

  function mountElement(vnode, container) {
    // el 引用真实的 DOM 元素
    const el = (vnode.el = createElement(vnode.type));
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, el);
      });
    }
    insert(el, container);
  }

  function unmount(vnode) {
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
    console.log(`createElement: ${tag}`);
    return { tag };
  },
  setElementText(el, text) {
    console.log(`setElementText: ${text}`);
    el.text = text;
  },
  insert(el, parent, anchor = null) {
    console.log(`insert: ${el.tag}`);
    console.log(parent);
    parent.children = el;
  },
  patchProps(el, key, preValue, nextValue) {
    // Difference between DOM Properties and HTML Attributes
    if (key === "class") {
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
  children: "Hello World",
};

const container = { type: "root" };

renderer.render(vnode, container);
