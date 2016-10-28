# dfa-router

[![CircleCI](https://img.shields.io/circleci/project/github/KOBA789/dfa-router.svg?style=flat-square)](https://circleci.com/gh/KOBA789/dfa-router)
[![Codecov](https://img.shields.io/codecov/c/github/KOBA789/dfa-router.svg?style=flat-square)](https://codecov.io/gh/KOBA789/dfa-router)

A simple server-side url router using Deterministic Finite Automaton.

## How to Use

It behaves like a simple key-value map.

```
const router = new Router();
router.add('GET', '/foo', 'foo');
router.add('GET', '/bar', 'bar');

const foo = router.route('GET', '/foo');
assert.deepEqual(foo, {
  type: 'found',
  value: 'foo',
  params: {},
});
const bar = router.route('GET', '/bar');
assert.deepEqual(bar, {
  type: 'found',
  value: 'bar',
  params: {},
});
```

And also, it can capture parameters.

```
const router = new Router();
router.add('GET', '/:param', 'foo');

const foo = router.route('GET', '/value');
assert.deepEqual(foo, {
  type: 'found',
  value: 'foo',
  params: { param: 'value' },
});
```

See `examples/server.js` and `test/` to learn more.
