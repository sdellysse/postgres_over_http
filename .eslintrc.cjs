/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  plugins: [
    "@typescript-eslint",
    "react-hooks",
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react-hooks/recommended",
    "prettier",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },

  rules: {
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "generic",
      },
    ],

    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    "@typescript-eslint/consistent-type-exports": "error",

    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports",
      },
    ],

    "@typescript-eslint/method-signature-style": "error",

    "@typescript-eslint/no-require-imports": "error",

    "@typescript-eslint/no-useless-empty-export": "error",

    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],

    "@typescript-eslint/require-array-sort-compare": "error",

    "@typescript-eslint/require-await": "off",

    "@typescript-eslint/restrict-template-expressions": ["error", {
      allowAny: false,
      allowBoolean: false,
      allowNever: true,
      allowNullish: true,
      allowNumber: true,
      allowRegExp: false,
    }],

    "no-return-await": "off",
    "@typescript-eslint/return-await": ["error", "always"],

    "@typescript-eslint/sort-type-constituents": "error",

    "@typescript-eslint/strict-boolean-expressions": "error",

    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
};
