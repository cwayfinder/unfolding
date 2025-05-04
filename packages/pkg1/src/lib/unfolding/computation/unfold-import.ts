import { unfoldNodeSchema } from '../unfold-node-schema';
import { isObject } from '../../util/is-object';
import { Alias, ComputationSchema, Defer } from '../../types';

type TemplateFullRawSchema = {
  readonly computationType: 'import';
  readonly path: string;
  readonly alias?: Alias;
  readonly _defer?: Defer;
} & Record<string, unknown>;

export function unfoldImportComputationSchema(schema: unknown): ComputationSchema | null {
  if (!isObject(schema) || !('computationType' in schema)) {
    return null;
  }

  const { path, alias, computationType, _defer, ...contractVariables } = schema as TemplateFullRawSchema;
  if (!path) {
    throw new Error(`Import resolver requires a path field.`);
  }

  const defer = _defer
    ? {
        placeholder: unfoldNodeSchema(_defer.placeholder || null, { type: 'component' }, []),
        error: unfoldNodeSchema(_defer.error || null, { type: 'component' }, []),
      }
    : null;

  return {
    computationType,
    path,
    defer,
    alias,
    contractVariables,
  };
}
