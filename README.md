# `import-graphql-string`

> Read a GraphQL file into a plain string – resolving all `# import` declarations

## Why

Various tools in the GraphQL ecosystem support GraphQL imports with the following syntax:

```graphql
# import "./my-imported-fragment.gql"
query {
  ...myImportedFragment
}
```

When you import a GraphQL file with such tool, all `# import` declarations are resolved and inlined, and you receive a string or an object with all imported definitions.

If you use webpack, [`graphql-import-loader`](https://github.com/prisma/graphql-import-loader) supports this; and if you use Babel, [`babel-plugin-import-graphql`](https://github.com/detrohutt/babel-plugin-import-graphql) does that too. However, so far, there were no such tool for Node.js. This library fills the niche and allows you to read a GraphQL file into a string – and have all imports in that file and its dependencies inlined.

## Install

```sh
npm install import-graphql-string
# or
yarn add import-graphql-string
```

## Example

```graphql
# src/web-data.gql
fragment WebData on Query {
  urlSlug
  queryParams {
    name
  }
}

# src/query.gql
# import "./web-data.gql"
query {
  name
  image
  ...WebData
}
```

```js
// src/index.js
const importGraphqlString = require('import-graphql-string');

const graphqlString = importGraphqlString('./web-data.gql');
// ↑ Relative paths are supported even when calling from JS

console.log(graphqlString);
/*
↑ Outputs: 

fragment WebData on Query {
  urlSlug
  queryParams {
    name
  }
}

query {
  name
  image
  ...WebData
}
*/
```

## License

MIT © [Ivan Akulov](https://iamakulov.com)
