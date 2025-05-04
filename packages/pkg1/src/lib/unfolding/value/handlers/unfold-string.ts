import { throwUnfoldError } from '../throw-unfold-value-error';
import { UnfoldCtx } from '../unfold-node-value';

export function unfoldString(ctx: UnfoldCtx) {
  if (typeof ctx.rawValue !== 'string') {
    throwUnfoldError(ctx);
  }
  return ctx.rawValue;
}
