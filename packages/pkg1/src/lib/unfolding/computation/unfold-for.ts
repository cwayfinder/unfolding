import { unfoldNodeSchema } from '../unfold-node-schema';
import { isObject } from '../../util/is-object';
import { ComputationSchema, ForComputationRawSchema } from '../../types';
import { parsePropertyKeyShorthand } from '../parse-property-key-shorthand';

export function unfoldForComputationSchema(schema: unknown): ComputationSchema | null {
  if (!isObject(schema) || !('computationType' in schema)) {
    return null;
  }
  let rawDimensions = schema['dimensions'] as ForComputationRawSchema[];
  if (rawDimensions) {
    if (!Array.isArray(rawDimensions)) {
      throw new Error(`Invalid dimensions schema "${JSON.stringify(rawDimensions)}". It must be an array.`);
    }
  } else {
    // schema can be a flat object if only one dimension is defined
    rawDimensions = [schema as ForComputationRawSchema];
  }

  const dimensions = rawDimensions.map((dimension) => {
    const { item = 'item', index = 'index', first = null, last = null } = dimension.as || {};

    const itemsKey = Object.keys(dimension).find((key) => key.startsWith('items')) as keyof typeof dimension;

    const [items, itemsType] = parsePropertyKeyShorthand(itemsKey ?? '');
    if (items !== 'items') {
      throw new Error('Computation "for" requires "items" field', schema);
    }

    const itemsArr = dimension[itemsKey];

    return {
      items: unfoldNodeSchema(itemsArr, itemsType, []),
      itemsType,
      item: unfoldNodeSchema(item, { type: 'string' }, []),
      index: unfoldNodeSchema(index, { type: 'string' }, []),
      first: unfoldNodeSchema(first, { type: 'string' }, []),
      last: unfoldNodeSchema(last, { type: 'string' }, []),
    };
  });

  const normalizedContent = unfoldNodeSchema(schema['content'], { type: 'unknown' }, []);

  return {
    computationType: 'for',
    dimensions,
    content: normalizedContent,
  };
}
