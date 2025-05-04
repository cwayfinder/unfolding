import { MapValueType, NodeSchema } from '../../../types';
import { unfoldNodeSchema } from '../../unfold-node-schema';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';

export function unfoldMap(ctx: UnfoldCtx<MapValueType>) {
  if (!isObject(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }
  return Object.entries(ctx.rawValue).reduce<Record<string, NodeSchema>>((structure, [key, child]) => {
    structure[key] = unfoldNodeSchema(child, ctx.valueType.item, []);
    return structure;
  }, {});
}
