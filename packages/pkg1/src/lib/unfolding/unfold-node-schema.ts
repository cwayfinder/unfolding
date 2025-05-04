import { BindingSchema } from '../types/binding';
import { unfoldComputationSchema } from './computation/unfold-computation-schema';
import { unfoldValue } from './value/unfold-node-value';
import { NodePath, NodeSchema, NodeSchemaBase, ValueType } from '../types';
import { toFullNotation } from './to-full-notation';

export function unfoldNodeSchema(rawSchema: unknown, valueType: ValueType, nodePath: NodePath = []): NodeSchema {
  const node: NodeSchemaBase = {
    valueType,
    value: null,
    computation: null,
    binding: null,
  };

  const nodeSchema = toFullNotation(rawSchema, valueType);

  if ('_binding' in nodeSchema) {
    node.binding = nodeSchema['_binding'] as BindingSchema;
  }
  if ('_computation' in nodeSchema) {
    node.computation = unfoldComputationSchema(nodeSchema._computation, valueType);
  }
  if ('_value' in nodeSchema) {
    node.value = unfoldValue({
      rawValue: nodeSchema._value,
      valueType,
      nodePath,
    });
  }

  return node as NodeSchema;
}
