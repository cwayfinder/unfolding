export function stringifyObject(label: string, data: unknown): string {
  return `\n${label}:\n${JSON.stringify(data, null, 2)}`;
}
