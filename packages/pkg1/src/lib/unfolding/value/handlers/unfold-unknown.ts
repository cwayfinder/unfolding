import { UnfoldCtx } from '../unfold-node-value';

export function unfoldUnknown(ctx: UnfoldCtx) {
  return ctx.rawValue;
}
