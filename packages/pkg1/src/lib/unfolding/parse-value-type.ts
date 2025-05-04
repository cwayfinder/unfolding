import {
  CommandValueType,
  EntityValueType,
  NodeType,
  NodeTypes,
  ObjectValueType,
  PolymorphicEntityValueType,
  ValueType,
} from '../types';
import { DefinitionStore } from '../definition-store';

export function parseValueType(type: string): ValueType {
  type = type.replaceAll(' ', '');

  if (type.startsWith('(') && type.endsWith(')')) {
    return createCommandType(type.slice(1, -1));
  }

  if (type.endsWith('{}')) {
    const rest = type.slice(0, -2);
    return {
      type: 'map',
      item: parseValueType(rest),
    };
  }

  if (type.endsWith('[]')) {
    const rest = type.slice(0, -2);
    return {
      type: 'array',
      item: parseValueType(rest),
    };
  }

  if (type.startsWith('{') && type.endsWith('}')) {
    return createObjectType(type.slice(1, -1));
  }

  return createSimpleType(type as NodeType);
}

function createObjectType(type: string): ObjectValueType {
  const fieldsPairs = splitTypesByComma(type);

  const fields = fieldsPairs.reduce<Record<string, ValueType>>((acc, str) => {
    const [fieldKey, fieldType = ''] = str.split(/:(.+)/); // split only by first colon
    acc[fieldKey] = parseValueType(fieldType);
    return acc;
  }, {});

  return {
    type: 'object',
    fields,
  } satisfies ObjectValueType;
}

function createCommandType(type: string): CommandValueType {
  const args = splitTypesByComma(type).filter(Boolean);

  return {
    type: 'command',
    args: args.map(parseValueType),
  } satisfies CommandValueType;
}

function createSimpleType(type: NodeType): ValueType {
  if (NodeTypes.includes(type)) {
    return { type } as ValueType;
  }

  if (type in DefinitionStore.getInstance().entities) {
    return {
      type: 'entity',
      entityType: type,
    } as EntityValueType;
  }

  if (type in DefinitionStore.getInstance().polymorphicEntities) {
    return {
      type: 'polymorphicEntity',
      entityType: type,
    } as PolymorphicEntityValueType;
  }

  throw new Error(`Unknown type '${type}'`);
}

function splitTypesByComma(str: string): string[] {
  const pairs: string[] = [];

  let braceCount = 0;
  let part = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '{') {
      braceCount++;
      part += char;
      continue;
    }

    if (char === '}') {
      braceCount--;
      part += char;
      continue;
    }

    if (char === ',' && braceCount === 0) {
      pairs.push(part);
      part = '';
    } else {
      part += char;
    }
  }

  pairs.push(part);

  return pairs;
}
