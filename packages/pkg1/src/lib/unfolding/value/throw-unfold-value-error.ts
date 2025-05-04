import { UnfoldCtx } from './unfold-node-value';
import { stringifyObject } from '../../util/stringify-object';

export function throwUnfoldError(ctx: UnfoldCtx): never {
  let message = 'Error happened while unfolding node';
  if (ctx.nodePath) {
    message += `\nPath: ${JSON.stringify(ctx.nodePath)}.`;
  }
  message += stringifyObject('ValueType', ctx.valueType);
  message += stringifyObject('Provided value', ctx.rawValue);

  throw new Error(message);
}
