import path from 'path';
import importGraphqlString from './index';

test('imports a file properly', () => {
  expect(
    importGraphqlString(path.resolve(__dirname, '__fixtures__/query.gql'))
  ).toMatch('query {');
});

test('resolves a relative path', () => {
  expect(importGraphqlString('./__fixtures__/query.gql')).toMatch('query {');
});

test('resolves imports properly', () => {
  const importResult = importGraphqlString(
    './__fixtures__/query-with-import.gql'
  );

  expect(importResult).toMatch('query {');
  expect(importResult).toMatch('fragment fragment1 on Query {');
});

test('understand various import syntaxes', () => {
  const importResult = importGraphqlString(
    './__fixtures__/query-with-import-syntaxes.gql'
  );

  expect(importResult).toMatch('query {');
  expect(importResult).toMatch('fragment fragment1 on Query {');
});

test('throws on an invalid import syntax', () => {
  const functionThatWillThrow = () =>
    importGraphqlString('./__fixtures__/query-with-invalid-import.gql');

  // Should throw the error
  expect(functionThatWillThrow).toThrow(
    'Encountered a malformed import line when importing a GraphQL file'
  );
  // Should include the path of the file where the error was encountered
  expect(functionThatWillThrow).toThrow(
    path.resolve(__dirname, './__fixtures__/fragment-with-invalid-import.gql')
  );
});

test('doesn’t import files twice', () => {
  const importResult = importGraphqlString(
    './__fixtures__/query-with-duplicated-child-imports.gql'
  );

  expect(importResult.match(/fragment fragment3 on Query {/g)).toHaveLength(1);
});
