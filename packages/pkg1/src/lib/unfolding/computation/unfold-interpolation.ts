import { ComputationSchema } from '../../types';

export function unfoldInterpolationComputationSchema(schema: string): ComputationSchema | null {
  const args = stringToFuncArgs(schema);

  return {
    computationType: 'formula',
    formula: `concat(${args})`,
  };
}

function stringToFuncArgs(str: string): string {
  const result: string[] = [];
  let currentIndex = 0;

  while (currentIndex < str.length) {
    const startBrace = str.indexOf('{{', currentIndex);

    if (startBrace === -1) {
      const remaining = str.slice(currentIndex);
      if (remaining) result.push(`'${remaining}'`);
      break;
    }

    const before = str.slice(currentIndex, startBrace);
    if (before) result.push(`'${before}'`);

    const endBrace = str.indexOf('}}', startBrace);
    if (!endBrace) {
      result.push(str);
      break;
    }

    const template = str.slice(startBrace + 2, endBrace).trim();
    if (template) result.push(template);

    currentIndex = endBrace + 2;
  }
  return '[' + result.join(', ') + ']';
}
