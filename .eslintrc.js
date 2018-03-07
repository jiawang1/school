module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": ["eslint-config-airbnb","prettier"],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "eslint-plugin-jsx-a11y",
    "import",
    "prettier"
  ],
  "rules": {
    "indent": "off",
    // "linebreak-style": [
    //     "error",
    //     "unix"
    // ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-underscore-dangle":[0],
    "class-methods-use-this":"off",
    "semi": [
      "error",
      "always"
    ],
    "prettier/prettier": "error"
  },
  "root":true
};
