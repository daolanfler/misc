const TextModes = {
  DATA: "DATA",
  RCDATA: "RADATA",
  RAWTEXT: "RAWTEXT",
  CDATA: "CDATA",
};

export function parse(str) {
  const context = {
    source: str,
    mode: TextModes.DATA,
    advanceBy(num) {
      context.source = context.source.slice(num);
    },
    advanceSpaces() {
      const match = /^[\t\r\n\f ]+/.exec(context.source);
      if (match) {
        context.advanceBy(match[0].length);
      }
    },
  };

  const nodes = parseChildren(context, []);

  return {
    type: "Root",
    children: nodes,
  };
}

function parseChildren(context, ancestors) {
  let nodes = [];

  const { mode, source } = context;

  while (!isEnd(context, ancestors)) {
    let node;
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      // DATA 模式才支持标签节点解析
      if (mode === TextModes.DATA && source[0] === "<") {
        if (source[1] === "!") {
          if (source.startsWith("<!--")) {
            node = parseComment(context);
          } else if (source.startsWith("<![CDATA[")) {
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === "/") {
          // 标签结束需要抛出错误
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancestors);
        }
      } else if (source.startsWith("{{")) {
        node = parseInterpolation(context);
      }
    }

    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }

  return nodes;
}

function parseElement(context, ancestors) {
  const element = parseTag(context);
  if (element.isSelfClosing) return element;

  if (element.tag === "textarea" || element.tag === "title") {
    context.mode = TextModes.RCDATA;
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    context.mode = TextModes.RAWTEXT;
  } else {
    context.mode = TextModes.DATA;
  }
  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, "end");
  } else {
    console.error(`${element.tag} 标签缺少闭合标签`);
  }
  return element;
}

function isEnd(context, ancestors) {
  if (!context.source) return true;
  for (let i = ancestors.length - 1; i >= 0; --i) {
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true;
    }
  }
}

function parseTag(context, type = "start") {
  const { advanceSpaces, advanceBy } = context;

  const match =
    type === "start"
      ? /^<([a-z][^\t\n\r\f />]*)/i.exec(context.source)
      : /^<\/([a-z][^\t\n\r\f />]*)/i.exec(context.source);

  const tag = match[1];

  advanceBy(match[0].length);
  advanceSpaces();
  const props = parseAttributes(context);

  const isSelfClosing = context.source.startsWith("/>");
  advanceBy(isSelfClosing ? 2 : 1);

  return {
    type: "Element",
    tag,
    props,
    children: [],
    isSelfClosing,
  };
}

function parseCDATA() {}

function parseAttributes(context) {
  const { advanceBy, advanceSpaces } = context;

  const props = [];

  while (!context.source.startsWith(">") && !context.source.startsWith("/>")) {
    const match = /^[^\t\r\n\f />][^\t\r\v\f />=]*/.exec(context.source);

    const name = match[0];
    advanceBy(name.length);

    advanceSpaces();
    advanceBy(1);

    advanceSpaces();

    let value = "";

    const quote = context.source[0];
    const isQuoted = quote === '"' || quote === "'";
    if (isQuoted) {
      advanceBy(1);

      const endQuoteIndex = context.source.indexOf(quote);
      if (endQuoteIndex > -1) {
        value = context.source.slice(0, endQuoteIndex);
        advanceBy(value.length);
        advanceBy(1);
      } else {
        console.error("缺少引号");
      }
    } else {
      const match = /^[^\t\r\n\f >]+/.exec(context.source)
      value = match[0]
      advanceBy(value.length)
    }
    advanceSpaces();

    props.push({
      type: 'Attribute',
      name,
      value
    })
  }
  return props
}

function parseComment() {

}

function parseText() {

}

function parseInterpolation() {

}