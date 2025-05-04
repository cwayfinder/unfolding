import { NodeSchema, ValueType } from '../types';
import { unfoldNodeSchema } from './unfold-node-schema';
import { isObject } from '../util/is-object';
import { toFullNotation } from './to-full-notation';
import { parsePropertyKeyShorthand } from './parse-property-key-shorthand';

export function unfoldProperty(keyEx: string, rawSchema: unknown): [string, NodeSchema] {
  if (keyEx.includes('@')) {
    const [key, valueType] = parsePropertyKeyShorthand(keyEx);
    const nodeSchema = unfoldNodeSchema(toFullNotation(rawSchema, valueType), valueType, [key]);
    return [key, nodeSchema];
  }

  if (isObject(rawSchema) && '_valueType' in rawSchema) {
    const valueType = rawSchema['_valueType'] as ValueType; // TODO: check if valueType is valid
    const nodeSchema = unfoldNodeSchema(rawSchema, valueType, [keyEx]);
    return [keyEx, nodeSchema];
  }

  throw new Error(`Cannot unfold node schema. Invalid schema notation ${JSON.stringify(rawSchema)} for key "${keyEx}"`);
}
