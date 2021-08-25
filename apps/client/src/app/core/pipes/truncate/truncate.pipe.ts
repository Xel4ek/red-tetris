import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: unknown, length: number): unknown {
    if (typeof value === 'string') {
      if (value.length > length) {
        return value.slice(0, length) + '...';
      }
    }
    return value;
  }
}
