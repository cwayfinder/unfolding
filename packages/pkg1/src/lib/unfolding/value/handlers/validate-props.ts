import { ComponentRawSchema } from '../../../types';
import { DefinitionStore } from '../../../definition-store';

export function validateProps(rawSchema: ComponentRawSchema) {
  const componentDefinitionProps = DefinitionStore.getInstance().getComputedComponentContract(rawSchema.componentType);
  const ignoredSchemaProps = new Set(['componentType', '_defer', 'variables', 'hooks', 'alias', 'contract']);

  const invalidProps = Object.keys(rawSchema).filter(
    (prop) => !componentDefinitionProps[prop] && !ignoredSchemaProps.has(prop),
  );

  if (invalidProps.length) {
    throw new Error(
      `Component schema "${rawSchema.componentType}" contains unknown properties: ${invalidProps.join(', ')}`,
    );
  }
}
