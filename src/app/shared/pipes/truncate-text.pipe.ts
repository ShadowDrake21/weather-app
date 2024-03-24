import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true,
})
export class TruncateTextPipe implements PipeTransform {
  transform(string: string, count: number = 50): string {
    return string.slice(0, count) + (string.length > count ? '...' : '');
  }
}
