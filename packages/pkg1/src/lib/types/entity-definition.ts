import { ValueType } from './node-description';

export interface EntityDefinition {
  properties: Record<string, ValueType>;
}
