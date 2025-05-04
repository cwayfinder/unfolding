import {
  Alias,
  AnyFn,
  ArrayValueType,
  BooleanValueType,
  CommandValueType,
  ComponentId,
  ComponentRawSchema,
  ComponentSchemaValueType,
  ComponentValueType,
  EntityValueType,
  MapValueType,
  NumberValueType,
  ObjectValueType,
  PolymorphicEntityValueType,
  StringValueType,
  TriggerType,
  UnknownValueType,
  ValueType,
} from '../types';
import { BindingSchema } from './binding';
import { ComputationSchema } from './computation-schema';

export type HookSchema = { triggerType: TriggerType; command: NodeSchema } & { [param: string]: unknown };
export type ComponentNodeValue =
  | {
      componentType: string;
      defer: {
        placeholder: NodeSchema;
        error: NodeSchema;
      } | null;
      alias: Alias;
      props: Map<string, NodeSchema>;
      variables: Map<string, NodeSchema>;
      hooks: HookSchema[];
    }
  | string
  | null;

export type CommandValue = {
  runnerType: 'js' | 'inline';
  target: string | AnyFn;
  owner: ComponentId | null;
};

export type EntityValue = {
  [key: string]: NodeSchema;
};

export type PolymorphicEntityValue = {
  [key: string]: NodeSchema | string;
};

export interface NodeSchemaBase<T extends ValueType = ValueType, V = unknown> {
  valueType: T;
  value: V;
  computation: ComputationSchema | null;
  binding: BindingSchema | null;
}

export type UnknownNodeSchema = NodeSchemaBase<UnknownValueType>;
export type BooleanNodeSchema = NodeSchemaBase<BooleanValueType, boolean>;
export type StringNodeSchema = NodeSchemaBase<StringValueType, string>;
export type NumberNodeSchema = NodeSchemaBase<NumberValueType, number>;
export type ArrayNodeSchema = NodeSchemaBase<ArrayValueType, NodeSchema[]>;
export type ObjectNodeSchema = NodeSchemaBase<ObjectValueType, Record<string, NodeSchema>>;
export type MapNodeSchema = NodeSchemaBase<MapValueType, Record<string, NodeSchema>>;
export type CommandNodeSchema = NodeSchemaBase<CommandValueType, CommandValue>;
export type ComponentNodeSchema = NodeSchemaBase<ComponentValueType, ComponentNodeValue>;
export type ComponentSchemaNodeSchema = NodeSchemaBase<ComponentSchemaValueType, ComponentRawSchema>;
export type EntityNodeSchema = NodeSchemaBase<EntityValueType, EntityValue>;
export type PolymorphicEntityNodeSchema = NodeSchemaBase<PolymorphicEntityValueType, PolymorphicEntityValue>;

export type LeafNodeSchema =
  | UnknownNodeSchema
  | BooleanNodeSchema
  | StringNodeSchema
  | NumberNodeSchema
  | CommandNodeSchema
  | ComponentSchemaNodeSchema
  | EntityNodeSchema
  | PolymorphicEntityNodeSchema;

export type NodeSchema =
  | LeafNodeSchema
  | ObjectNodeSchema
  | MapNodeSchema
  | ComponentNodeSchema
  | ArrayNodeSchema;
