import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';

@Pipe({
  name: 'keys',
})
export class KeysPipe implements PipeTransform {
  transform<K, V>(
    input: ReadonlyMap<K, V>,
    compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number
  ): string[];
  transform<K extends number, V>(
    input: Record<K, V>,
    compareFn?: (a: KeyValue<string, V>, b: KeyValue<string, V>) => number
  ): string[];
  transform<K extends string, V>(
    input: Record<K, V> | ReadonlyMap<K, V>,
    compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number
  ): string[];
  transform(
    input: null | undefined,
    compareFn?: (
      a: KeyValue<unknown, unknown>,
      b: KeyValue<unknown, unknown>
    ) => number
  ): null;
  transform<K, V>(
    input: ReadonlyMap<K, V> | null | undefined,
    compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number
  ): string[] | null;
  transform<K extends number, V>(
    input: Record<K, V> | null | undefined,
    compareFn?: (a: KeyValue<string, V>, b: KeyValue<string, V>) => number
  ): string[] | null;
  transform<K extends string, V>(
    input: Record<K, V> | ReadonlyMap<K, V> | null | undefined
  ): string[] | null {
    if (input) return Object.keys(input);
    return null;
  }
}
