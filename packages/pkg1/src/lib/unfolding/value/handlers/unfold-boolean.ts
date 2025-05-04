import { throwUnfoldError } from '../throw-unfold-value-error';
import { UnfoldCtx } from '../unfold-node-value';

export const unfoldBoolean = (ctx: UnfoldCtx) => {
  if (typeof ctx.rawValue !== 'boolean') {
    throwUnfoldError(ctx);
  }
  return ctx.rawValue;
};
