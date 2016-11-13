import 'mocha';
import * as assert from 'assert';

import DFATable from '../dfa_table';

describe('DFATable', () => {
  it('should register entry and get entry', () => {
    const table = new DFATable();
    table.add(['foo'], 'hoge');
    assert.deepEqual(
      table.get(['foo']),
      {
        value: 'hoge',
        params: new Map([]),
      }
    );
  });

  context('which has (foo => hoge, bar => huga, {boo} => piyo)', () => {
    const table = new DFATable();
    table.add(['foo'], 'hoge');
    table.add(['bar'], 'huga');
    table.add([{ name: 'boo' }], 'piyo');

    it('should let static fragment precedence over named capture', () => {
      assert.deepEqual(
        table.get(['foo']),
        {
          value: 'hoge',
          params: new Map([]),
        }
      );
      assert.deepEqual(
        table.get(['bar']),
        {
          value: 'huga',
          params: new Map([]),
        }
      );
    });

    it('should choice named capture if no static fragments are matched', () => {
      assert.deepEqual(
        table.get(['not_foo']),
        {
          value: 'piyo',
          params: new Map([
            ['boo', 'not_foo']
          ]),
        }
      );
    });
  });

  context('which has ({boo} foo => hoge, {hey} bar => huga)', () => {
    const table = new DFATable();
    table.add([{ name: 'boo' }, 'foo'], 'hoge');
    table.add([{ name: 'hey' }, 'bar'], 'huga');

    it('should capture same level fragments as different name', () => {
      assert.deepEqual(
        table.get(['yo', 'foo']),
        {
          value: 'hoge',
          params: new Map([
            ['boo', 'yo']
          ]),
        }
      );
      assert.deepEqual(
        table.get(['yo', 'bar']),
        {
          value: 'huga',
          params: new Map([
            ['hey', 'yo']
          ]),
        }
      );
    });
  });
});
