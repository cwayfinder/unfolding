import { NodePath, NodeSchema, ValueType } from '../../types';
import {
  unfoldArray,
  unfoldBoolean,
  unfoldCommand,
  unfoldComponent,
  unfoldComponentSchema,
  unfoldMap,
  unfoldNumber,
  unfoldObject,
  unfoldPolymorphicEntity,
  unfoldString,
  unfoldUnknown,
} from './handlers';
import { unfoldEntity } from './handlers/unfold-entity';

export type UnfoldCtx<T extends ValueType = ValueType> = {
  rawValue: unknown;
  valueType: T;
  nodePath: NodePath;
};

export type Handler = (ctx: UnfoldCtx) => NodeSchema['value'];

const handlers: Record<ValueType['type'], unknown> = {
  unknown: unfoldUnknown,
  number: unfoldNumber,
  string: unfoldString,
  boolean: unfoldBoolean,
  array: unfoldArray,
  map: unfoldMap,
  object: unfoldObject,
  entity: unfoldEntity,
  polymorphicEntity: unfoldPolymorphicEntity,
  command: unfoldCommand,
  componentSchema: unfoldComponentSchema,
  component: unfoldComponent,
};

export function unfoldValue(ctx: UnfoldCtx) {
  const handler = handlers[ctx.valueType.type] as Handler;
  if (!handler) {
    throw new Error(`Cannot unfold value "${ctx.rawValue}". Unknown value type '${ctx.valueType.type}'`);
  }
  if (ctx.rawValue === undefined || ctx.rawValue === null) {
    return null;
  }
  return handler(ctx);
}
