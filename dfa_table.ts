import * as assert from 'assert';

interface Captures {
  [name: string]: number;
}

interface TableAcceptance<T> {
  value: T;
  captures: Captures;
}

type Parameters = Map<string, string>;

export interface TableResult<T> {
  value: T;
  params: Parameters;
}

interface TableElement<T> {
  subTable: Table<T>;
  acceptance?: TableAcceptance<T>;
}

const ANY = Symbol('ANY');
interface Table<T> {
  [name: string]: TableElement<T>;
  [ANY]?: TableElement<T>;
}

interface NamedCapture {
  name: string;
}

type UpsertHandler<T> = (old: T | undefined) => T;

export default class DFATable<T> {
  private root: TableElement<T> = {
    acceptance: undefined,
    subTable: {},
  };

  private _upsert<T>(element: TableElement<T>, path: (string | symbol)[], upsertHandler: UpsertHandler<T>, captures: Captures) {
    if (path.length === 0) {
      element.acceptance = {
        value: upsertHandler(element.acceptance && element.acceptance.value),
        captures
      };
      return;
    }

    const name = path.shift() as (string | typeof ANY);
    const isANY = (name === ANY);
    const table = element.subTable;
    if (!Object.hasOwnProperty.call(table, ANY)) {
      table[ANY] = {
        subTable: {},
        acceptance: undefined,
      };
    }
    if (!isANY && !Object.hasOwnProperty.call(table, name)) {
      table[name] = {
        acceptance: undefined,
        subTable: Object.create(table[ANY]!.subTable),
      };
    }
    this._upsert(table[name]!, path, upsertHandler, captures);
  }

  public upsert(pattern: (string | NamedCapture)[], upsertHandler: UpsertHandler<T>) {
    const captures: Captures = {};
    const path = pattern.map((value, index) => {
      if (typeof value === 'object') {
        captures[value.name] = index;
        return ANY;
      }
      return value;
    });

    this._upsert(this.root, path, upsertHandler, captures);
  }

  public add(pattern: (string | NamedCapture)[], value: T) {
    this.upsert(pattern, (old) => {
      assert(old === undefined);
      return value;
    });
  }

  public get(query: string[]): TableResult<T> | undefined {
    let currentElement = this.root;
    for (let i = 0; i < query.length; ++i) {
      currentElement = currentElement.subTable[query[i]] || currentElement.subTable[ANY];
      if (currentElement === undefined) {
        return undefined;
      }
    }
    if (currentElement.acceptance === undefined) {
      return undefined;
    }
    const { value, captures } = currentElement.acceptance;
    const params: Parameters = new Map<string, string>();
    for (const key of Object.keys(captures)) {
      params.set(key, query[captures[key]]);
    }

    return { value, params };
  }
}