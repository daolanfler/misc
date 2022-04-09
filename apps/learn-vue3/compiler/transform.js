import { parse } from "./parse.js";

function dump(node, indent = 0, context = {result: ''}) {
  const type = node.type;
  const desc =
    type === "Root" ? "" : type === "Element" ? node.tag : node.content;

  context.result += `${"-".repeat(indent)}${type}: ${desc}\n`
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2, context));
  }
  return context.result
}

const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);
dump(ast);


function traverseNode(ast, context) {
  context.currentNode = ast
  const exitFns = []
  const transforms = context.nodeTransforms
  
  for (let i =0; i<transforms.length; i ++) {
    const onExit = transforms[i](context.currentNode, context)
    if (onExit) {
      exitFns.push(onExit)
    }
    if (!context.currentNode) return
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i =0; i<children.length; i++) {
      context.parent = context.currentNode
      context.childIndex = i;
      traverseNode(children[i], context)
    }
  }

  let i = exitFns.length;
  while(i --) {
    exitFns[i]();
  }
}

function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h1'
  }
}

function transformText(node, context) {
  if (node.type === 'Text') {
    context.replaceNode({
      type: 'Element',
      tag: 'span',
      children: [
        {
          type: 'Element',
          tag: 'i',
        }
      ]
    })
    context.removeNode();
  }
}
export function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node
      context.currentNode = node
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        context.currentNode = null
      }
    },
    nodeTransforms: [
      transformElement,
      transformText
    ]
  }
  traverseNode(ast, context)
  return dump(ast)
}