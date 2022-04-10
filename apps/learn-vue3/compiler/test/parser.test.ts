import { expect, it, test } from 'vitest';
import { parse} from '../parser';


it('should parse to a template ast tree', () => {
  const template = '<div id="foo" v-show="display"></div>'
  expect(parse(template)).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [],
          "isSelfClosing": false,
          "props": [
            {
              "name": "id",
              "type": "Attribute",
              "value": "foo",
            },
            {
              "name": "v-show",
              "type": "Attribute",
              "value": "display",
            },
          ],
          "tag": "div",
          "type": "Element",
        },
      ],
      "type": "Root",
    }
  `)
});
