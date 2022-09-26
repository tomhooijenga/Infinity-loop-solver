module.exports = {
  root: true,

  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },

  extends: [
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
  },
};
