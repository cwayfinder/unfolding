import { ComponentRawSchema, TemplateRawSchema } from '../types';
import { isObject } from '../util/is-object';
import { RawNode } from './to-full-notation';
import { DefinitionStore } from '../definition-store';

type WrapperEntity = [string, Record<string, unknown>];

type ComposedSchema =
  | ComponentRawSchema
  | RawNode
  | {
      computationType: string;
      [x: string]: unknown;
    };

const WrapperPrefix = '+';
const PathSymbol = '/';

export function unfoldFlatWrappers(
  wrappers: WrapperEntity[],
  schema: ComponentRawSchema | RawNode,
  resultingNode: RawNode,
): RawNode {
  const composed = wrappers
    .reverse()
    .reduce<ComposedSchema>((composed, wrapper) => unfoldWrapper(wrapper, composed), schema);

  if ('computationType' in composed) {
    resultingNode._computation = composed;
  } else {
    resultingNode._value = composed;
  }

  return resultingNode;
}

function unfoldWrapper(wrapper: WrapperEntity, schema: ComposedSchema): ComposedSchema {
  const [componentType, props] = wrapper;

  if (componentType.includes(PathSymbol)) {
    return {
      computationType: 'import',
      path: componentType,
      ...props,
      slot: schema,
    };
  }

  const slot = getComponentSlot(componentType);

  return {
    componentType,
    ...props,
    [slot]: {
      ...schema,
    },
  };
}

function getComponentSlot(wrapperType: string): string {
  const props = DefinitionStore.getInstance().getComputedComponentContract(wrapperType);

  const componentSlots = Object.entries(props)
    .filter(([, prop]) => prop.valueType.type === 'component')
    .map(([key]) => key);

  if (!componentSlots.length) {
    throw new Error(`No component slot found for wrapper: "${wrapperType}"`);
  }

  if (componentSlots.length > 1) {
    const defaultSlot = DefinitionStore.getInstance().getComponent(wrapperType)?.defaultSlot;
    if (!defaultSlot) {
      throw new Error(`Multiple component slots found for wrapper: "${wrapperType}". Please specify a default slot.`);
    }
    return defaultSlot;
  }

  return componentSlots[0];
}

export function extractWrappers(schema: ComponentRawSchema | TemplateRawSchema): WrapperEntity[] {
  const wrappers: WrapperEntity[] = [];

  for (const key in schema) {
    if (key.startsWith(WrapperPrefix)) {
      const wrapperType = key.slice(1);
      const wrapperProps = schema[key] || {};

      if (!isObject(wrapperProps)) {
        throw new Error(`Properties for wrapper "${wrapperType}" must be an object`);
      }

      wrappers.push([wrapperType, wrapperProps]);
      delete schema[key];
    }
  }

  return wrappers;
}

export function hasWrappers(schema: ComponentRawSchema | TemplateRawSchema): boolean {
  return Object.keys(schema).some((key) => key.startsWith(WrapperPrefix));
}
