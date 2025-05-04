import {
  CommandDefinition,
  ComponentDefinition,
  ComponentRawDefinition,
  EntityDefinition,
  FormulaFunctionDefinition,
  NodeSchema,
  ObjectValueType,
  PolymorphicEntityDefinition,
  ValueType,
} from './types';
import { Binding } from './types/binding';
import { memoize } from './util/memoize';
import { unfoldProperty } from './unfolding/unfold-property';
import { Delimiters } from './constants';
import { findChildValueType } from './util/find-child-description';

export class DefinitionStore {
  entities: { [entityType: string]: EntityDefinition } = {};
  polymorphicEntities: { [entityType: string]: PolymorphicEntityDefinition } = {};
  components: { [componentType: string]: ComponentDefinition } = {};
  functions: { [functionType: string]: FormulaFunctionDefinition } = {};
  commands: { [commandType: string]: CommandDefinition } = {};
  bindings: Record<string, Binding> = {};

  private static instance: DefinitionStore;

  private constructor() {
    this.getComponentTraits = memoize(this.getComponentTraits.bind(this));
    this.getComputedComponentContract = memoize(this.getComputedComponentContract.bind(this));
  }

  static getInstance(): DefinitionStore {
    if (!DefinitionStore.instance) {
      DefinitionStore.instance = new DefinitionStore();
    }
    return DefinitionStore.instance;
  }

  static reset() {
    DefinitionStore.instance = new DefinitionStore();

    return DefinitionStore.instance;
  }

  setEntity(entityType: string, properties: Record<string, ValueType>) {
    this.entities[entityType] = {
      properties,
    };
  }

  getEntityType(entityType: string): ObjectValueType {
    const definition = this.entities[entityType];
    if (!definition) {
      throw new Error(`Entity "${entityType}" is not registered.`);
    }

    return {
      type: 'object',
      fields: definition.properties,
    };
  }

  setPolymorphicEntity(entityType: string, commonProperties: Record<string, ValueType>) {
    this.polymorphicEntities[entityType] = {
      commonProperties,
      kinds: {},
    };
  }

  setPolymorphicEntityKind(entityType: string, kind: string, properties: Record<string, ValueType>): void {
    const definition = this.polymorphicEntities[entityType];
    if (!definition) {
      throw new Error(`PolymorphicEntity "${entityType}" is not registered`);
    }
    definition.kinds[kind] = properties;
  }

  getPolymorphicEntityType(entityType: string, kind: string): ObjectValueType {
    const definition = this.polymorphicEntities[entityType];
    if (!definition) {
      throw new Error(`PolymorphicEntity "${entityType}" is not registered.`);
    }

    const kindProperties = definition.kinds[kind];

    return {
      type: 'object',
      fields: {
        ...definition.commonProperties,
        ...kindProperties,
      },
    };
  }

  setComponent(componentType: string, componentDefinition: ComponentRawDefinition): void {
    const properties: Record<string, NodeSchema> = {};

    for (const entry of Object.entries(componentDefinition.properties)) {
      const [key, prop] = unfoldProperty(...entry);
      properties[key] = prop;
    }

    this.components[componentType] = {
      traits: componentDefinition.traits || [],
      properties,
      defaultSlot: componentDefinition.defaultSlot,
    };
  }

  setComponents(componentDefinitions: Record<string, ComponentRawDefinition>): void {
    for (const [componentType, componentDefinition] of Object.entries(componentDefinitions)) {
      this.setComponent(componentType, componentDefinition);
    }
  }

  getBinding(type: string): Binding {
    if (!this.bindings[type])
      throw new Error(`Binding with type "${type}" is not found. Available bindings: ${Object.keys(this.bindings)}`);

    return this.bindings[type];
  }

  setBinding(type: string, binding: Binding) {
    this.bindings[type] = binding;
  }

  setBindings(bindingDefinitions: Record<string, Binding>) {
    for (const [type, binding] of Object.entries(bindingDefinitions)) {
      this.bindings[type] = binding;
    }
  }

  getComponent(componentType: string): ComponentDefinition {
    const componentDefinition = this.components[componentType];
    if (!componentDefinition) {
      throw new Error(`Component with type "${componentType}" is not found.`);
    }
    return componentDefinition;
  }

  getComponentTraits(componentType: string): string[] {
    const description = this.getComponent(componentType);
    const traits = description.traits || [];
    const superTraits = traits.flatMap((trait) => this.getComponentTraits(trait));
    const result = [...superTraits, ...traits, componentType];

    return [...new Set(result)];
  }

  getComputedComponentContract(componentType: string): Record<string, NodeSchema> {
    const traits = this.getComponentTraits(componentType);
    const contracts = traits.map((trait) => this.getComponent(trait).properties);

    const propMap: Record<string, NodeSchema> = {};

    for (const contract of contracts) {
      for (const [key, prop] of Object.entries(contract)) {
        if (!propMap[key]) {
          propMap[key] = prop;
          continue;
        }

        const existingProp = propMap[key];
        if (existingProp) {
          propMap[key] = { ...existingProp, ...prop };
        }
      }
    }

    for (const [key, prop] of Object.entries(propMap)) {
      if (!prop.valueType) {
        throw new Error(`Property "${key}" in component "${componentType}" has no valueType.`);
      }
    }

    return propMap;
  }

  getNodeValueType(componentType: string, path: string): ValueType {
    const [node, ...rest] = path.split(Delimiters.NodePath);

    const description = this.getComputedComponentContract(componentType)[node];
    if (!description) {
      throw new Error(`Property "${path}" is not found in component "${componentType}".`);
    }
    return findChildValueType(description.valueType, rest);
  }

  hasComponentWithType(componentType: string): boolean {
    return !!this.components[componentType];
  }

  getComponentTypes(): string[] {
    return Object.keys(this.components);
  }

  setCommands(definitions: Record<string, CommandDefinition>): void {
    for (const [commandType, definition] of Object.entries(definitions)) {
      this.setCommand(commandType, definition);
    }
  }

  setCommand(commandType: string, definition: CommandDefinition): void {
    this.commands[commandType] = definition;
  }

  getCommand(commandType: string): CommandDefinition {
    const commandDefinition = this.commands[commandType];
    if (!commandDefinition) {
      throw new Error(`Command with type "${commandType}" is not found.`);
    }

    return commandDefinition;
  }

  getCommandNames(): string[] {
    return Object.keys(this.commands);
  }

  setFormulas(definitions: Record<string, FormulaFunctionDefinition>): void {
    for (const [functionType, definition] of Object.entries(definitions)) {
      this.setFunction(functionType, definition);
    }
  }

  setFunction(functionType: string, definition: FormulaFunctionDefinition): void {
    this.functions[functionType] = definition;
  }

  getFunction(functionType: string): FormulaFunctionDefinition {
    const definition = this.functions[functionType];
    if (!definition) {
      throw new Error(`Formula function with type "${functionType}" is not found.`);
    }

    return definition;
  }
}
