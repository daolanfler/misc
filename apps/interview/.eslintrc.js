module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    requireConfigFile: false,
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": 1,
    semi: ["error", "always"],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: { browser: true, es6: true, node: true },
      extends: [
        "eslint:recommended",
        // "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2018,
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
      plugins: ["@typescript-eslint"],
      rules: {
        // indent: ["error", 2, { SwitchCase: 1 }],
        // quotes: ["error", "single"],
        // "comma-dangle": ["error", "always-multiline"],
        indent: "off",
        quotes: 0,
        "@typescript-eslint/indent": ["warn", 2, { SwitchCase: 1}],
        "linebreak-style": ["error", "unix"],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/ban-ts-comment": ["error", {"ts-expect-error": false}],
      },
      settings: { react: { version: "detect" } },
    },
  ],
};
