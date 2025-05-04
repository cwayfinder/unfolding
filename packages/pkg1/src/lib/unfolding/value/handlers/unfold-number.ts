import { throwUnfoldError } from '../throw-unfold-value-error';
import { UnfoldCtx } from '../unfold-node-value';

export function unfoldNumber(ctx: UnfoldCtx) {
  if (!isValidNumber(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }
  return ctx.rawValue;
}

function isValidNumber(value: unknown) {
  return typeof value === 'number' && !isNaN(value);
}
