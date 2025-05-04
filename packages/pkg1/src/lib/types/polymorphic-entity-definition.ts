import { ValueType } from './node-description';

export interface PolymorphicEntityDefinition {
  commonProperties: Record<string, ValueType>;
  kinds: Record<string, Record<string, ValueType>>;
}
