import { ValueType } from '../types';

export function findChildValueType(valueType: ValueType, path: string[]): ValueType {
  if (!path.length) {
    return valueType;
  }

  const [head, ...tail] = path;

  switch (valueType.type) {
    case 'array': {
      return findChildValueType(valueType.item, tail);
    }
    case 'object': {
      const found = valueType.fields[head];
      if (!found) {
        throw new Error(`Field ${head} not found in object description.`);
      }
      return findChildValueType(found, tail);
    }
    case 'map': {
      return findChildValueType(valueType.item, tail);
    }
    default:
      return valueType;
  }
}
