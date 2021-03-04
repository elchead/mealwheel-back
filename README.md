# Development

This project uses the following tools:

- **JSDoc**: to enable Intellisense and generate HTML documentation
- **Typescript**: use template .d.ts files for static type checking.
  This approach is based on:
  https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html

  To the `.js` files simply add:

  ```
    // @ts-check // enables typescript analysis
    /** @type {import("./mashString")} *// this refers to the generated .d.ts file for type checking
  ```

  Or check this post for further explanation:
  https://stackoverflow.com/a/60339571/10531075

  The types can be inferred from JSDOC as described in:
  https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

- **Eslint**: to encourage consistent code style
- **Prettier**: to format code
- **Husky**: for git-hookes (linting and testing)
- **Mocha + Chai**: unit-testing
