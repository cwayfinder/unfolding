export type CommandExecute<TResult> = (api: any, ...params: any[]) => TResult | Promise<TResult>;

export type CommandDefinition = {
  execute: CommandExecute<unknown>;
};
