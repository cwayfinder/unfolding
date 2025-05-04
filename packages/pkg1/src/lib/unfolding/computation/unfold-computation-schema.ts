import { ComputationSchema, SwitchComputationRawSchema, ValueType } from '../../types';
import { unfoldNodeSchema } from '../unfold-node-schema';
import { isObject } from '../../util/is-object';
import { unfoldIfComputationSchema } from './unfold-if';
import { unfoldForComputationSchema } from './unfold-for';
import { unfoldImportComputationSchema } from './unfold-import';
import { unfoldImportMemberComputationSchema } from './unfold-import-member';
import { unfoldInterpolationComputationSchema } from './unfold-interpolation';
import { stringifyObject } from '../../util/stringify-object';

export function unfoldComputationSchema(schema: unknown, valueType: ValueType): ComputationSchema | null {
  if (typeof schema === 'string') {
    if (schema.includes('{{') && schema.includes('}}')) {
      return unfoldInterpolationComputationSchema(schema);
    }

    if (schema.startsWith('=')) {
      return {
        computationType: 'formula',
        formula: schema.slice(1),
      };
    }
  }

  if (!isObject(schema) || !('computationType' in schema)) {
    return null;
  }

  switch (schema['computationType']) {
    case 'formula':
      return {
        computationType: 'formula',
        formula: schema['formula'] as string,
      };
    case 'for':
      return unfoldForComputationSchema(schema);
    case 'import':
      return unfoldImportComputationSchema(schema);
    case 'multi':
      return unfoldImportMemberComputationSchema(schema, valueType);
    case 'if':
      return unfoldIfComputationSchema(schema);
    case 'switch': {
      const { source, ...rest } = schema as SwitchComputationRawSchema;
      return {
        source: unfoldNodeSchema(source, { type: 'unknown' }, []),
        ...rest,
      };
    }
    default:
      throw new Error(`Unable to unfold computation schema.\n${stringifyObject('Schema', schema)}`);
  }
}
