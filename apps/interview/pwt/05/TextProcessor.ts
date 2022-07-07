import fs from "fs";
enum TextProcessingMode {
  Text,
  Marker,
  Code,
}

class TextProcessor {
  private mode: TextProcessingMode = TextProcessingMode.Text;
  private result: string[] = [];
  private codeSample: string[] = [];

  processText(lines: string[]): string[] {
    this.result = [];
    this.mode = TextProcessingMode.Text;

    for (const line of lines) {
      this.processLine(line);
    }
    return this.result;
  }

  private processLine(line: string): void {
    switch (this.mode) {
      case TextProcessingMode.Text:
        this.processTextLine(line);
        break;
      case TextProcessingMode.Marker:
        this.processMarkLine(line);
        break;
      case TextProcessingMode.Code:
        this.processCodeLine(line);
        break;
    }
  }
  private processTextLine(line: string): void {
    this.result.push(line);
    if (line.startsWith("<!--")) {
      this.loadCodeSample(line);
      this.mode = TextProcessingMode.Marker;
    }
  }
  private processMarkLine(line: string): void {
    this.result.push(line);
    if (line.startsWith("```ts")) {
      this.result = this.result.concat(this.codeSample);
      this.mode = TextProcessingMode.Code;
    }
  }
  private processCodeLine(line: string): void {
    if (line.startsWith("```")) {
      this.result.push(line);
      this.mode = TextProcessingMode.Text;
    }
  }
  private loadCodeSample(line: string): void {
    const fileName = line.match(/<!--\s*(.+)-->$/)?.[1] || "";
    let lines: string[] = [];
    if (fileName) {
      lines = fs.readFileSync(`./${fileName.trim()}`).toString().split("\n");
    }
    this.codeSample = lines;
  }
}

const filePath = './Chapter1.md';
const mdlines = fs.readFileSync(filePath).toString().split("\n");

const processor = new TextProcessor();

const newLines = processor.processText(mdlines);

fs.writeFileSync(filePath, '');
for (const line of newLines) {
  fs.appendFileSync(filePath, line + '\n' );
}