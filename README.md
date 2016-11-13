# dfa-router

[![CircleCI](https://img.shields.io/circleci/project/github/KOBA789/dfa-router.svg?style=flat-square)](https://circleci.com/gh/KOBA789/dfa-router)
[![Codecov](https://img.shields.io/codecov/c/github/KOBA789/dfa-router.svg?style=flat-square)](https://codecov.io/gh/KOBA789/dfa-router)

A simple server-side url router using Deterministic Finite Automaton.

## Installation

This is published at npm registry: [dfa-router](https://www.npmjs.com/package/dfa-router).

You can install it via `npm`, `yarn` or what you like.

```
npm install dfa-router
```

## How to Use

It behaves like a simple key-value map.

```js
const router = new Router();
router.add('GET', '/foo', 'foo');
router.add('GET', '/bar', 'bar');

const foo = router.route('GET', '/foo');
assert.deepEqual(foo, {
  type: 'found',
  value: 'foo',
  params: new Map([]),
});
const bar = router.route('GET', '/bar');
assert.deepEqual(bar, {
  type: 'found',
  value: 'bar',
  params: new Map([]),
});
```

And also, it can capture parameters.

```js
const router = new Router();
router.add('GET', '/:param', 'foo');

const foo = router.route('GET', '/value');
assert.deepEqual(foo, {
  type: 'found',
  value: 'foo',
  params: new Map([
    ['param', 'value']
  ]),,
});
```

See `examples/server.js` and `test/` to learn more.
