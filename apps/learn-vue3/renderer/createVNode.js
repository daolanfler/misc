const dynamicChildrenStack = [];

let currentDynamicChildren = null;

function openBlock() {
  dynamicChildrenStack.push((currentDynamicChildren = []));
}

function closeBlock() {
  currentDynamicChildren = dynamicChildrenStack.pop();
}

export function createVNode(tag, props, children, flags) {
  const key = props && props.key;
  props && delete props.key;
  const vnode =  {
    tag,
    props,
    children,
    key,
    patchFlags: flags
  };

  if (typeof flags !== 'undefined' && currentDynamicChildren) {
    currentDynamicChildren.push(vnode)
  }
}

function render() {
  return (openBlock(), createBlock('div', null, [
    createVNode('p', {class: 'foo'}, null, 1 /** patch flag */),
    createVNode('p', {class: 'bar'}, null)
  ]))
}

function createBlock(tag, props, children) {
  const block = createVNode(tag, props, children)
  block.dynamicChildren = currentDynamicChildren;

  closeBlock();
  return block;

}