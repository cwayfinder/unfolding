import { Observable } from 'rxjs';
import { IObservableValue } from 'mobx';
import { ValueType } from './node-description';

export type FormulaFunctionExecute<TResult> = (
  api: any,
  ...rest: Array<any>
) => TResult | Promise<TResult> | Observable<TResult> | IObservableValue<TResult>;

export type ArgType = {
  valueType: ValueType;
  evaluateWhen?: (previousValues: unknown[]) => boolean;
};

export type FormulaFunctionDefinition = {
  execute: FormulaFunctionExecute<unknown>;
  returns: ValueType;
  args: ArgType[];
  reset?: () => void;
};
