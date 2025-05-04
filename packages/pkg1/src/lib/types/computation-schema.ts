import { Alias } from './schema';
import { NodeSchema } from './node-schema';
import { ValueType } from './node-description';
import { ComponentId } from './id';

export type ForComputationRawSchema = {
  items: unknown[];
  as?: {
    item: unknown;
    index: unknown;
    first?: unknown;
    last?: unknown;
  };
  content: unknown;
};

export type IfComputationRawSchema =
  | Record<'if' | 'then' | 'else', unknown>
  | ({ if: unknown; } & Record<string, unknown>);

export type SwitchComputationRawSchema = {
  computationType: 'switch';
  source: unknown;
  cases: { equals: unknown; then: unknown }[];
  default: unknown;
};

export interface TemplateComputationSchema {
  readonly computationType: 'import';
  readonly path: string;
  readonly alias?: Alias;
  readonly defer: {
    placeholder: NodeSchema;
    error: NodeSchema;
  } | null;
  readonly contractVariables: Record<string, unknown>;
}

export interface FormulaComputationSchema {
  readonly computationType: 'formula';
  readonly formula: string;
}

export interface IfComputationSchema {
  readonly computationType: 'if';
  readonly if: NodeSchema;
  readonly then: NodeSchema;
  readonly else: NodeSchema;
}

export interface DimensionSchema {
  items: NodeSchema;
  itemsType: ValueType;
  item: NodeSchema;
  index: NodeSchema;
  first: NodeSchema;
  last: NodeSchema;
}

export interface ForComputationSchema {
  readonly computationType: 'for';
  readonly dimensions: DimensionSchema[];
  readonly content: NodeSchema;
}

export interface ImportMemberComputationSchema {
  readonly computationType: 'multi';
  readonly schemas: { relativeComponent: ComponentId | null; itemSchema: NodeSchema }[];
}

export interface SwitchComputationSchema {
  readonly computationType: 'switch';
  readonly source: NodeSchema;
  readonly cases: { equals: unknown; then: unknown }[];
  readonly default: unknown;
}

export interface ComputationSchemaMap {
  formula: FormulaComputationSchema;
  conditional: IfComputationSchema;
  for: ForComputationSchema;
  templateUrl: TemplateComputationSchema;
  multi: ImportMemberComputationSchema;
  switch: SwitchComputationSchema;
}

export type ComputationType = keyof ComputationSchemaMap;
export type ComputationSchema = ComputationSchemaMap[ComputationType];
