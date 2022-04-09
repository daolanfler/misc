import { expect, it } from 'vitest';
import { parse } from '../parse';
import { transform } from '../transform';


it('shourd transform to javascript ast', () => {
  const template = '<div><p>Vue</p><p>Template</p></div>'
  const ast = parse(template)
  expect(transform(ast)).toMatchInlineSnapshot(`
    {
      "body": [
        {
          "return": {
            "arguments": [
              {
                "type": "StringLiteral",
                "value": "div",
              },
              {
                "elements": [
                  {
                    "arguments": [
                      {
                        "type": "StringLiteral",
                        "value": "p",
                      },
                      {
                        "type": "StringLiteral",
                        "value": "Vue",
                      },
                    ],
                    "callee": {
                      "name": "h",
                      "type": "Identifier",
                    },
                    "type": "CallExpression",
                  },
                  {
                    "arguments": [
                      {
                        "type": "StringLiteral",
                        "value": "p",
                      },
                      {
                        "type": "StringLiteral",
                        "value": "Template",
                      },
                    ],
                    "callee": {
                      "name": "h",
                      "type": "Identifier",
                    },
                    "type": "CallExpression",
                  },
                ],
                "type": "ArrayExpression",
              },
            ],
            "callee": {
              "name": "h",
              "type": "Identifier",
            },
            "type": "CallExpression",
          },
          "type": "ReturnStatement",
        },
      ],
      "id": {
        "name": "render",
        "type": "Identifier",
      },
      "params": [],
      "type": "FunctionDecl",
    }
  `);
});
