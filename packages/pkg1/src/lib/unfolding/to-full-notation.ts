import { ComponentRawSchema, TemplateRawSchema, ValueType } from '../types';
import { BindingSchema } from '../types/binding';
import { extractWrappers, hasWrappers, unfoldFlatWrappers } from './unfold-flat-wrapper-notation';

export type RawNode = {
  _valueType: ValueType;
  _value: unknown;
  _computation: unknown;
  _binding: unknown;
};

export function toFullNotation(nodeSchema: unknown, valueType: ValueType): RawNode {
  const rawNode: RawNode = {
    _valueType: valueType,
    _value: null,
    _computation: null,
    _binding: null,
  };

  if (nodeSchema === null) {
    rawNode._value = null;
    return rawNode;
  }

  if (typeof nodeSchema === 'string') {
    if (nodeSchema.includes('{{') && nodeSchema.includes('}}')) {
      rawNode._computation = nodeSchema;
      return rawNode;
    }

    if (nodeSchema.startsWith('=')) {
      rawNode._computation = nodeSchema;
      return rawNode;
    }
  }

  if (typeof nodeSchema !== 'object') {
    rawNode._value = nodeSchema;
    return rawNode;
  }

  if ('computationType' in nodeSchema) {
    rawNode._computation = nodeSchema;
    return rawNode;
  }

  if ('bindingType' in nodeSchema) {
    rawNode._binding = nodeSchema as BindingSchema;
    return rawNode;
  }

  const isFullNotation = ['_valueType', '_value', '_computation', '_binding'].some((key) => key in nodeSchema);
  if (isFullNotation) {
    if ('_value' in nodeSchema) rawNode._value = nodeSchema._value;
    if ('_computation' in nodeSchema) rawNode._computation = nodeSchema._computation;
    if ('_binding' in nodeSchema) rawNode._binding = nodeSchema._binding as BindingSchema;
    return rawNode;
  }

  // detect 'if' short notation
  // TODO: change to _if to isolate keyword)
  if ('if' in nodeSchema) {
    const computation: any = {
      computationType: 'if',
      if: nodeSchema.if,
      then: null,
      else: null,
    };

    if (!('then' in nodeSchema) && !('else' in nodeSchema)) {
      const { if: _, ...thenSchema } = nodeSchema;
      computation.then = thenSchema;
    } else {
      if ('then' in nodeSchema) {
        computation.then = nodeSchema['then'];
      }
      if ('else' in nodeSchema) {
        computation.else = nodeSchema['else'];
      }
    }

    rawNode._computation = computation;
    return rawNode;
  }

  if ('templateUrl' in nodeSchema) {
    const schema = nodeSchema as TemplateRawSchema;
    if (hasWrappers(schema)) {
      const wrappers = extractWrappers(schema);
      return unfoldFlatWrappers(wrappers, toFullNotation(schema, valueType), rawNode);
    }

    const { templateUrl: path, ...rest } = nodeSchema;
    rawNode._computation = { computationType: 'import', path, ...rest };

    return rawNode;
  }

  if ('componentType' in nodeSchema) {
    const schema = nodeSchema as ComponentRawSchema;

    if (hasWrappers(schema)) {
      const wrappers = extractWrappers(schema);
      return unfoldFlatWrappers(wrappers, schema, rawNode);
    }
  }

  rawNode._value = nodeSchema;
  return rawNode;
}
