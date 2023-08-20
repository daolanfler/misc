interface IVisitor {
    visitParagraph(paragraph: Paragraph): void;
    visitPicture(picture: Picuture): void
    visitTable(table: Table): void
}

class Renderer implements IVisitor {
    visitParagraph(paragraph: Paragraph): void {
    // 
    }
    visitPicture(picture: Picuture): void {
    // 
    }
    visitTable(table: Table): void {
    // 
    }
}

interface IDocumentItem {
    accept(visitor: IVisitor): void;
}

class Paragraph implements  IDocumentItem {
    accept(visitor: IVisitor): void {
        visitor.visitParagraph(this);
    }
}

class Picuture implements IDocumentItem {
    accept(visitor: IVisitor): void {
        visitor.visitPicture(this);
    }
}

class Table implements IDocumentItem {
    accept(visitor: IVisitor): void {
        visitor.visitTable(this);
    }
}

const doc: IDocumentItem[] = [new Paragraph(), new Table()];

const renderer: IVisitor= new Renderer();

for (const item of doc) {
    item.accept(renderer);
}
