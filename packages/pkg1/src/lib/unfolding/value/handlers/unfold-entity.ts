import { EntityValueType } from '../../../types';
import { EntityValue } from '../../../types';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';
import { unfoldObject } from './unfold-object';
import { DefinitionStore } from '../../../definition-store';

export function unfoldEntity(ctx: UnfoldCtx<EntityValueType>): EntityValue {
  if (!isObject(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }

  const rawValue = ctx.rawValue as Record<string, unknown>;
  const objectValueType = DefinitionStore.getInstance().getEntityType(ctx.valueType.entityType);
  return unfoldObject({ rawValue, valueType: objectValueType, nodePath: ctx.nodePath });
}
