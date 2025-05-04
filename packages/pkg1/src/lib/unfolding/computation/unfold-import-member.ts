import { ComponentId, ComputationSchema, ValueType } from '../../types';
import { unfoldNodeSchema } from '../unfold-node-schema';
import { isObject } from '../../util/is-object';

export function unfoldImportMemberComputationSchema(
  schema: unknown,
  valueType: ValueType
): ComputationSchema | null {
  if (!isObject(schema) || !('computationType' in schema)) {
    return null;
  }
  const { schemas } = schema as unknown as {
    schemas: { relativeComponent: ComponentId | null; itemSchema: unknown }[];
  };
  if (!schemas) {
    throw new Error(`Multi resolver requires a schemas field.`);
  }

  const normalizedSchemas = schemas.map(
    ({ relativeComponent, itemSchema }) => ({
      itemSchema: unfoldNodeSchema(itemSchema, valueType, []),
      relativeComponent,
    })
  );

  return {
    computationType: 'multi',
    schemas: normalizedSchemas,
  };
}
