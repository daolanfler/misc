import { expect, it } from 'vitest';
import { parse } from '../parse';
import { transform } from '../transform';


it('shourd transform to javascript ast', () => {
  const template = '<div><p>Vue</p><p>Template</p></div>'
  const ast = parse(template)
  expect(transform(ast)).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "content": "Vue",
                  "jsNode": {
                    "type": "StringLiteral",
                    "value": "Vue",
                  },
                  "type": "Text",
                },
              ],
              "jsNode": {
                "arguments": [
                  {
                    "type": "StringLiteral",
                    "value": "p",
                  },
                  {
                    "elements": [
                      {
                        "type": "StringLiteral",
                        "value": "Vue",
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
              "tag": "p",
              "type": "Element",
            },
            {
              "children": [
                {
                  "content": "Template",
                  "jsNode": {
                    "type": "StringLiteral",
                    "value": "Template",
                  },
                  "type": "Text",
                },
              ],
              "jsNode": {
                "arguments": [
                  {
                    "type": "StringLiteral",
                    "value": "p",
                  },
                  {
                    "elements": [
                      {
                        "type": "StringLiteral",
                        "value": "Template",
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
              "tag": "p",
              "type": "Element",
            },
          ],
          "jsNode": {
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
                        "elements": [
                          {
                            "type": "StringLiteral",
                            "value": "Vue",
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
                  {
                    "arguments": [
                      {
                        "type": "StringLiteral",
                        "value": "p",
                      },
                      {
                        "elements": [
                          {
                            "type": "StringLiteral",
                            "value": "Template",
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
          "tag": "div",
          "type": "Element",
        },
      ],
      "jsNode": {
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
                          "elements": [
                            {
                              "type": "StringLiteral",
                              "value": "Vue",
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
                    {
                      "arguments": [
                        {
                          "type": "StringLiteral",
                          "value": "p",
                        },
                        {
                          "elements": [
                            {
                              "type": "StringLiteral",
                              "value": "Template",
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
      },
      "type": "Root",
    }
  `);
});
