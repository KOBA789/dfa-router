import * as assert from 'assert';
import DFATable, { TableResult } from './dfa_table';

interface RoutingEntry<T> {
  [method: string]: T;
}
export type RoutingResult<T> = ({
  type: 'found';
} & TableResult<T>) | {
  type: 'not_found';
} | {
  type: 'method_not_allowed';
  allowed: string[];
};

export default class Router<T> {
  private table = new DFATable<RoutingEntry<T>>();

  add(method: string, path: string, value: T) {
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    const names = path.split('/');
    const pattern = names.map((name) => (
      name.startsWith(':')
        ? { name: name.substring(1) }
        : name
    ));
    this.table.upsert(pattern, (old) => {
      const newValue = old || {};
      assert(newValue[method] === undefined);
      newValue[method] = value;
      return newValue;
    });
  }

  route(method: string, path: string): RoutingResult<T> {
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    const query = path.split('/');

    const result = this.table.get(query);
    if (result === undefined) {
      return {
        type: 'not_found',
      };
    }

    const { value: methods, params } = result;
    if (Object.hasOwnProperty.call(methods, method)) {
      return {
        value: methods[method],
        params,
        type: 'found',
      };
    }

    return {
      type: 'method_not_allowed',
      allowed: Object.keys(methods),
    };
  }
}
