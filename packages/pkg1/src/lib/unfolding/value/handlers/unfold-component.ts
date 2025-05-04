import { validateProps } from './validate-props';
import { ComponentNodeValue, ComponentRawSchema, HookSchema, NodeSchema, TriggerType } from '../../../types';
import { isObject } from '../../../util/is-object';
import { unfoldNodeSchema } from '../../unfold-node-schema';
import { UnfoldCtx } from '../unfold-node-value';
import { throwUnfoldError } from '../throw-unfold-value-error';
import { unfoldProperty } from '../../unfold-property';
import { DefinitionStore } from '../../../definition-store';

export function unfoldComponent(ctx: UnfoldCtx): ComponentNodeValue {
  if (typeof ctx.rawValue === 'string' && ctx.rawValue.startsWith('csid-')) {
    return ctx.rawValue;
  }
  if (!isObject(ctx.rawValue)) {
    throwUnfoldError(ctx);
  }

  const componentRawSchema = ctx.rawValue as ComponentRawSchema;

  if (!componentRawSchema.componentType) {
    throw new Error(`Component schema "${JSON.stringify(ctx.rawValue)}" has no componentType.`);
  }

  validateProps(componentRawSchema);

  const properties = DefinitionStore.getInstance().getComputedComponentContract(componentRawSchema.componentType);

  const props = new Map<string, NodeSchema>();
  for (const [key, baseSchema] of Object.entries(properties)) {
    if (!(key in componentRawSchema)) {
      props.set(key, baseSchema);
      continue;
    }

    const unfoldedRawSchema = unfoldNodeSchema(componentRawSchema[key], baseSchema.valueType, [key]);

    const node = {
      valueType: baseSchema.valueType,
      value: unfoldedRawSchema.value ?? baseSchema.value,
      computation: unfoldedRawSchema.computation || baseSchema.computation,
      binding: unfoldedRawSchema.binding || baseSchema.binding,
    } as NodeSchema;

    props.set(key, node);
  }

  const variables = new Map<string, NodeSchema>();
  for (const [keyEx, schema] of Object.entries(componentRawSchema.variables || {})) {
    const [key, unfolded] = unfoldProperty(keyEx, schema);
    variables.set(key, unfolded);
  }

  const rawHooks = componentRawSchema.hooks || [];
  const hooks: HookSchema[] = rawHooks.map((hook) => {
    const { triggerType, command, ...params } = hook;
    if (!triggerType) {
      throw new Error(`Hook schema "${JSON.stringify(hook)}" has no triggerType.`);
    }
    if (!['afterPropertyChange', 'afterValueChange', 'afterVariableChange'].includes(triggerType)) {
      throw new Error(`Hook schema "${JSON.stringify(hook)}" has invalid triggerType.`);
    }
    return {
      triggerType: triggerType as TriggerType,
      ...params,
      command: unfoldNodeSchema(command, { type: 'command' }, []),
    };
  });

  const defer = componentRawSchema._defer
    ? {
        placeholder: unfoldNodeSchema(componentRawSchema._defer.placeholder || null, { type: 'component' }, []),
        error: unfoldNodeSchema(componentRawSchema._defer.error || null, { type: 'component' }, []),
      }
    : null;

  return {
    componentType: componentRawSchema.componentType,
    defer,
    alias: componentRawSchema.alias || '',
    props,
    variables,
    hooks,
  };
}
