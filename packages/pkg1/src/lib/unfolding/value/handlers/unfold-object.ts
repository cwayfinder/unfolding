import { unfoldNodeSchema } from '../../unfold-node-schema';
import { NodeSchema, ObjectValueType } from '../../../types';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';

export function unfoldObject(ctx: UnfoldCtx<ObjectValueType>) {
  if (!isObject(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }

  const rawObject = ctx.rawValue as Record<string, unknown>;

  return Object.entries(ctx.valueType.fields).reduce<Record<string, NodeSchema>>(
    (structure, [fieldKey, fieldValueType]) => {
      const fieldValue = fieldKey in rawObject ? rawObject[fieldKey] : null;
      structure[fieldKey] = unfoldNodeSchema(fieldValue, fieldValueType, []);
      return structure;
    },
    {},
  );
}
