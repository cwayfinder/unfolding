import { NodeSchema } from '../types';

export interface ComponentDefinition {
  readonly traits?: string[];
  readonly properties: Record<string, NodeSchema>;
  readonly defaultSlot?: string;
}

export type ComponentRawDefinition = {
  readonly traits?: string[];
  readonly properties: Record<string, unknown>;
  readonly defaultSlot?: string;
};
