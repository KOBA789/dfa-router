import 'mocha';
import * as assert from 'assert';

import Router from '../router';

describe('Router', () => {
  context('when routing is defined not in POST but in GET', () => {
    const router = new Router<string>();
    router.add('GET', '/', 'foo');

    it('should return method not allowed', () => {
      assert.deepEqual(
        router.route('POST', '/'),
        {
          type: 'method_not_allowed',
          allowed: ['GET']
        }
      );
    });
  });

  // FIXME:
  context('which has complex table', () => {
    const table = new Router<string>();
    table.add('GET', '/foo/bar', 'ok1');
    table.add('GET', '/foo', 'ok2');
    table.add('GET', '/foo/:hey', 'ok3');
    table.add('GET', '/foo/:yo/baz', 'ok4');
    table.add('POST', '/foo', 'ok5');
    table.add('GET', '/:boo/:yo/baz', 'ok6');

    it('should route correct direction', () => {
      assert.deepEqual(
        table.route('GET', '/foo/bar'),
        {
          type: 'found',
          value: 'ok1',
          params: new Map([]),
        }
      );
      assert.deepEqual(
        table.route('GET', '/foo'),
        {
          type: 'found',
          value: 'ok2',
          params: new Map([]),
        }
      );
      assert.deepEqual(
        table.route('GET', '/foo/baz'),
        {
          type: 'found',
          value: 'ok3',
          params: new Map([
            ['hey', 'baz']
          ]),
        }
      );
      assert.deepEqual(
        table.route('GET', '/foo/hoge/baz'),
        {
          type: 'found',
          value: 'ok4',
          params: new Map([
            ['yo', 'hoge']
          ]),
        }
      );
      assert.deepEqual(
        table.route('POST', '/foo'),
        {
          type: 'found',
          value: 'ok5',
          params: new Map([]),
        }
      );
      assert.deepEqual(
        table.route('GET', '/bar/foo/baz'),
        {
          type: 'found',
          value: 'ok6',
          params: new Map([
            ['boo', 'bar'],
            ['yo', 'foo']
          ]),
        }
      );
      assert.deepEqual(
        table.route('PUT', '/foo'),
        {
          type: 'method_not_allowed',
          allowed: ['GET', 'POST'],
        }
      );
    });
  });
});