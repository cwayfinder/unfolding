export interface UnknownValueType {
  readonly type: 'unknown';
}

export interface StringValueType {
  readonly type: 'string';
}

export interface NumberValueType {
  readonly type: 'number';
}

export interface BooleanValueType {
  readonly type: 'boolean';
}

export interface ArrayValueType {
  readonly type: 'array';
  readonly item: ValueType;
}

export interface ObjectValueType {
  readonly type: 'object';
  readonly fields: Record<string, ValueType>;
}

export interface MapValueType {
  readonly type: 'map';
  readonly item: ValueType;
}

export interface ComponentValueType {
  readonly type: 'component';
}

export interface ComponentSchemaValueType {
  readonly type: 'componentSchema';
}

export interface CommandValueType {
  readonly type: 'command';
  readonly args?: ValueType[];
  readonly returns?: string;
}

export interface EntityValueType {
  readonly type: 'entity';
  readonly entityType: string;
}

export interface PolymorphicEntityValueType {
  readonly type: 'polymorphicEntity';
  readonly entityType: string;
}

export type ValueType =
  | UnknownValueType
  | StringValueType
  | NumberValueType
  | BooleanValueType
  | ArrayValueType
  | ObjectValueType
  | MapValueType
  | ComponentValueType
  | ComponentSchemaValueType
  | CommandValueType
  | EntityValueType
  | PolymorphicEntityValueType;

export type NodeType = ValueType['type'];

export const NodeTypes: NodeType[] = [
  'unknown',
  'string',
  'number',
  'boolean',
  'array',
  'object',
  'map',
  'component',
  'componentSchema',
  'command',
  'entity',
  'polymorphicEntity',
];
