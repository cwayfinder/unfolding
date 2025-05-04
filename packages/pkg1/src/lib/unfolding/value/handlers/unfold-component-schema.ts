import { validateProps } from './validate-props';
import { ComponentRawSchema, ComponentSchemaValueType } from '../../../types';
import { isObject } from '../../../util/is-object';
import { UnfoldCtx } from '../unfold-node-value';

export function unfoldComponentSchema(ctx: UnfoldCtx<ComponentSchemaValueType>) {
  if (!isObject(ctx.rawValue)) {
    throw new Error('Unfolded component schema type');
  }
  const componentRawSchema = ctx.rawValue as ComponentRawSchema;

  if (!componentRawSchema.componentType) {
    throw new Error(`Component schema "${JSON.stringify(ctx.rawValue)}" has no componentType.`);
  }

  validateProps(componentRawSchema);

  return componentRawSchema;
}
