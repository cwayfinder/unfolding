import { ComponentId, NodePath } from './types';

export enum Delimiters {
  NodePath = '.',
}

export enum Computers {
  Variable = 'variable-computer',
  Property = 'property-computer',
  Function = 'function-computer',
  Array = 'array-computer',
  Object = 'object-computer',
}

export const debugName = (id: ComponentId, thing: string, nodePath: NodePath) => {
  return [id, thing, nodePath.join(Delimiters.NodePath)].join('|');
};

export const componentInstanceMap = new Map<ComponentId, unknown>();
