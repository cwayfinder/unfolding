import { AnyFn, CommandValue, CommandValueType } from '../../../types';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';

export function unfoldCommand(ctx: UnfoldCtx<CommandValueType>): CommandValue {
  const rawValue = ctx.rawValue;

  if (typeof rawValue === 'string') {
    return { runnerType: 'js', target: rawValue, owner: null };
  }

  if (isObject(rawValue) && 'runnerType' in rawValue && 'target' in rawValue) {
    if (typeof rawValue['runnerType'] !== 'string') {
      throw new Error(`Command schema is invalid. Field "runnerType" must be string.`);
    }
    if (!rawValue['target']) {
      throw new Error(`Command schema is invalid. Field "target" must be defined.`);
    }
    return rawValue as CommandValue;
  }

  if (typeof rawValue === 'function') {
    return { runnerType: 'inline', target: rawValue as AnyFn, owner: null };
  }

  throwUnfoldError(ctx);
}
