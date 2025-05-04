import { ValueType } from './node-description';
import { ComponentId } from './id';

export type AnyFn = (...args: unknown[]) => unknown;

export interface TCommand {
  runnerType: string;
  owner: ComponentId;
  target: any;
  init?: any;
  finalize?: any;
}

export type TriggerType = 'afterValueChange' | 'afterPropertyChange' | 'afterVariableChange';

export type TriggerSchema =
  | {
      triggerType: 'afterValueChange';
    }
  | {
      triggerType: 'afterPropertyChange';
      propertyName: string;
    }
  | {
      triggerType: 'afterVariableChange';
      variableName: string;
    };

export interface HookRawSchema {
  triggerType: TriggerType;
  command: unknown;
  [param: string]: unknown;
}

export interface VariableRawDefinition {
  _valueType: ValueType;
  _value?: unknown;
  _computation?: unknown;
  _binding?: unknown;
}

export interface SchemaParamDefinition {
  valueType: ValueType;
  value?: unknown;
  computation?: unknown;
  binding?: unknown;
}

export type Alias = string;

export type Defer = {
  placeholder?: { componentType: string } & { [key: string]: unknown };
  error?: { componentType: string } & { [key: string]: unknown };
};

export interface ComponentRawSchema {
  alias?: Alias;
  componentType: string;
  hooks?: HookRawSchema[];
  variables?: Record<string, unknown>;
  _defer?: Defer;
  [prop: string]: unknown;
}

export type TemplateRawSchema = Omit<ComponentRawSchema, 'componentType'> & {
  templateUrl: string;
};

export interface TemplateRawDefinition extends ComponentRawSchema {
  contract?: Record<string, SchemaParamDefinition>;
  defaultSlot?: string;
}
