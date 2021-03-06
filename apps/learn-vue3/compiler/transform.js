import { parse } from "./parse.js";

function dump(node, indent = 0, context = { result: "" }) {
  const type = node.type;
  const desc =
    type === "Root" ? "" : type === "Element" ? node.tag : node.content;

  context.result += `${"-".repeat(indent)}${type}: ${desc} ${
    node.jsNode ? '\n jsNode:' + JSON.stringify(node.jsNode, null, indent + 2) : ""
  }\n`;
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2, context));
  }
  return context.result;
}

const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);
dump(ast);

function traverseNode(ast, context) {
  context.currentNode = ast;
  const exitFns = [];
  const transforms = context.nodeTransforms;

  for (let i = 0; i < transforms.length; i++) {
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      exitFns.push(onExit);
    }
    if (!context.currentNode) return;
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(children[i], context);
    }
  }

  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
function createStringLiteral(value) {
  return {
    type: "StringLiteral",
    value,
  };
}

function createIdentifier(name) {
  return {
    type: "Identifier",
    name,
  };
}

function createArrayExpression(elements) {
  return {
    type: "ArrayExpression",
    elements,
  };
}

function createCallExpression(callee, args) {
  return {
    type: "CallExpression",
    callee: createIdentifier(callee),
    arguments: args,
  };
}

function transformElement(node) {
  return () => {
    if (node.type !== "Element") return 

    const callExp = createCallExpression('h', [createStringLiteral(node.tag)])
    node.children.length === 1 ? 
      callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)))
    node.jsNode = callExp
  }
}

function transformRootNode(node) {
  return () => {
    if (node.type !== 'Root') return

    const vnodeJSAST = node.children[0].jsNode
    node.jsNode = {
      type: 'FunctionDecl',
      id: {type: 'Identifier', name: 'render'},
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST
        }
      ]
    }
  }
}

function transformText(node, context) {
  if (node.type !== "Text") {
    return;
  }
  node.jsNode = createStringLiteral(node.content);
}

export function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node;
      context.currentNode = node;
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1);
        context.currentNode = null;
      }
    },
    nodeTransforms: [transformElement, transformText, transformRootNode],
  };
  traverseNode(ast, context);
  return ast.jsNode
}
