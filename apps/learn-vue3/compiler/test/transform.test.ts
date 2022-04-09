import { expect, it, test } from 'vitest';
import { parse, tokenize } from '../parse';
import { transform } from '../transform';


it('shourd transform to javascript ast', () => {
  const template = '<div><p>Vue</p><p>Template</p></div>'
  const ast = parse(template)
  expect(transform(ast)).toMatchInlineSnapshot(`
    "Root: 
    --Element: div
    ----Element: h1
    ----Element: h1
    "
  `);
});
