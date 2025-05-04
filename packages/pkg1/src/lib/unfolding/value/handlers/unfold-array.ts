import { ArrayValueType } from '../../../types';
import { unfoldNodeSchema } from '../../unfold-node-schema';
import { throwUnfoldError } from '../throw-unfold-value-error';
import { UnfoldCtx } from '../unfold-node-value';

export function unfoldArray(ctx: UnfoldCtx<ArrayValueType>) {
  if (!Array.isArray(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }

  return ctx.rawValue.map((item) => unfoldNodeSchema(item, ctx.valueType.item, []));
}
