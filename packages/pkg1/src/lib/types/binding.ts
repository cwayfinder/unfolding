import { ComponentId, ValueType } from '../types';

export interface Binding<Mapping extends Record<string, unknown> = Record<string, unknown>, Value = unknown> {
  collectValues(relativeComponentId: ComponentId, componentQuery: string, mapping: Mapping): Value;
  distributeValues(
    relativeComponentId: ComponentId,
    componentQuery: string,
    mapping: Mapping,
    value: Value,
    valueType: ValueType,
  ): true;
}

export interface BindingSchema {
  bindingType: string;
  componentQuery: string;
  mapping: Record<string, string>;
}
