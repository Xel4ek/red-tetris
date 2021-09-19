import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
})
export class KeysPipe implements PipeTransform {
  transform<K, V>(input: ReadonlyMap<K, V>): string[];
  transform<K extends number, V>(input: Record<K, V>): string[];
  transform<K extends string, V>(
    input: Record<K, V> | ReadonlyMap<K, V>
  ): string[];
  transform(input: null | undefined): null;
  transform<K, V>(input: ReadonlyMap<K, V> | null | undefined): string[] | null;
  transform<K extends number, V>(
    input: Record<K, V> | null | undefined
  ): string[] | null;
  transform<K extends string, V>(
    input: Record<K, V> | ReadonlyMap<K, V> | null | undefined
  ): string[] | null {
    if (input) return Object.keys(input);
    return null;
  }
}
