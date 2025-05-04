import { NodeType, ValueType } from '../types';
import { parseValueType } from './parse-value-type';

export function parsePropertyKeyShorthand(shorthand: string): [string, ValueType] {
  const [key, type] = shorthand.split('@') as [string, NodeType];
  if (!type) {
    throw new Error(`Invalid node key expression "${key}". Expected type for key "${key}"`);
  }
  return [key, parseValueType(type)];
}
