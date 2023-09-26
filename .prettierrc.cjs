/** @type {import("prettier").Config} */
module.export = {
  trailingComma: "all",
  quoteProps: "consistent",

  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-sort-json",
    "prettier-plugin-tailwindcss",
  ],

  // options for prettier-plugin-sort-json
  jsonRecursiveSort: true,
};
