import { NodeSchema, PolymorphicEntityValue, PolymorphicEntityValueType } from '../../../types';
import { unfoldNodeSchema } from '../../unfold-node-schema';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';
import { DefinitionStore } from '../../../definition-store';

export function unfoldPolymorphicEntity(ctx: UnfoldCtx<PolymorphicEntityValueType>): PolymorphicEntityValue {
  if (!isObject(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }

  const rawValue = ctx.rawValue as Record<string, unknown>;

  const kindKey = `${ctx.valueType.entityType}Type`;
  const kind = rawValue[kindKey] as string;

  if (!kind) {
    throw new Error(`Missing the kind field "${kindKey}"`);
  }

  const objectValueType = DefinitionStore.getInstance().getPolymorphicEntityType(ctx.valueType.entityType, kind);

  const objectNode = unfoldNodeSchema(rawValue, objectValueType, []);
  return {
    ...(objectNode.value as Record<string, NodeSchema>),
    [kindKey]: kind,
  };
}
