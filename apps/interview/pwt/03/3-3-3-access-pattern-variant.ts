import { Variant } from "./3-2-4-variant";

function visit<T1, T2, T3>(
  variant: Variant<T1, T2, T3>,
  func1: (value: T1) => void,
  func2: (value: T2) => void,
  func3: (value: T3) => void,
): void {
  switch (variant.index) {
    case 0:
      func1(<T1>variant.value);
      break;
    case 1:
      func2(<T2>variant.value);
      break;
    case 2:
      func3(<T3>variant.value);
      break;
    default:
      throw new Error();
  }
}

class Renderer {
  renderParagraph(paragraph: Paragraph): void {
    //
  }
  renderPicture(picture: Picuture): void {
    //
  }
  renderTable(table: Table): void {
    //
  }
}

class Paragraph {}

class Picuture {}

class Table {}

const doc: Variant<Paragraph, Picuture, Table>[] = [
  Variant.make1(new Paragraph()),
  Variant.make3(new Table()),
];

const renderer: Renderer = new Renderer();

for (const item of doc) {
  visit(item, 
    (paragraph: Paragraph) => renderer.renderParagraph(paragraph),
    (picture: Picuture) => renderer.renderPicture(picture),
    (table: Table) => renderer.renderTable(table),
  );
}


// 文档项和访问者都不用实现接口。将文档项与正确的访问者匹配的职责被封装到了
// visit 方法中。
class ScreenReader {
  readParagraph(paragraph: Paragraph): void {
    //
  }
  readPicture(picture: Picuture): void {
    //
  }
  readTable(table: Table): void {
    //
  }
}