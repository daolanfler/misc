import { expect, it, test, describe } from 'vitest';
import { decodeHtml, parse} from '../parser';


it('should parse attributes', () => {
  const template = '<div id="foo" v-show="display"></div>'

  expect(parse(template)).toMatchSnapshot()
});

it('should parse v-on attributes', () => { 

  const template = '<div id="foo" v-show="display" v-on:mouseover="onMouseOver"></div>'
 
  expect(parse(template)).toMatchSnapshot()
})

it('should parse Text', () => {
  expect(parse('<div>Text {{ console.log("random")}}</div>')).toMatchSnapshot();
})

it('should parse Text with HTML entities', () => {
  expect(parse('<div>a&ltcc;bbb</div>')).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "content": "a⪦bbb",
              "type": "Text",
            },
          ],
          "isSelfClosing": false,
          "props": [],
          "tag": "div",
          "type": "Element",
        },
      ],
      "type": "Root",
    }
  `);
})

test('decodeHtml', () => {
  expect(decodeHtml('a&&ltccb')).toMatchInlineSnapshot('"a&<ccb"');
})

describe('decodeHtml', () => {
  it('should decode HTML correctly', () => {
    expect(decodeHtml(' abc  123 ')).toBe(' abc  123 ')

    expect(decodeHtml('&')).toBe('&')
    expect(decodeHtml('&amp;')).toBe('&')
    expect(decodeHtml('&amp;amp;')).toBe('&amp;')

    expect(decodeHtml('<')).toBe('<')
    expect(decodeHtml('&lt;')).toBe('<')
    expect(decodeHtml('&amp;lt;')).toBe('&lt;')

    expect(decodeHtml('>')).toBe('>')
    expect(decodeHtml('&gt;')).toBe('>')
    expect(decodeHtml('&amp;gt;')).toBe('&gt;')

    expect(decodeHtml('&nbsp;')).toBe('\u00a0')
    expect(decodeHtml('&quot;')).toBe('"')
    expect(decodeHtml('&apos;')).toBe('\'')

    expect(decodeHtml('&Eacute;')).toBe('\u00c9')
    expect(decodeHtml('&#xc9;')).toBe('\u00c9')
    expect(decodeHtml('&#201;')).toBe('\u00c9')

    // #3001 html tags inside attribute values
    expect(decodeHtml('<strong>Text</strong>', true)).toBe(
      '<strong>Text</strong>',
    )
    expect(decodeHtml('<strong>&amp;</strong>', true)).toBe(
      '<strong>&</strong>',
    )
    expect(
      decodeHtml(
        '<strong>&lt;strong&gt;&amp;&lt;/strong&gt;</strong>',
        true,
      ),
    ).toBe('<strong><strong>&</strong></strong>')
  })
})
