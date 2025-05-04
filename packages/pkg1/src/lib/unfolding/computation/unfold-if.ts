import { unfoldNodeSchema } from '../unfold-node-schema';
import { ComponentRawSchema, ComputationSchema, IfComputationRawSchema } from '../../types';

export function unfoldIfComputationSchema(schema: IfComputationRawSchema): ComputationSchema {
  if (schema.if === undefined) {
    throw new Error('If computation requires the "if" field.');
  }

  return {
    computationType: 'if',
    if: unfoldNodeSchema(schema.if, { type: 'boolean' }, []),
    then: createBranch(schema.then),
    else: createBranch(schema.else),
  };
}

function wrap(schema: unknown): ComponentRawSchema {
  return {
    componentType: 'common.Box',
    content: schema,
  };
}

function createBranch(schema: unknown = null) {
  return unfoldNodeSchema(wrap(schema), { type: 'componentSchema' }, []);
}
