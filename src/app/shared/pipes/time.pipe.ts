import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(utc: number): Date {
    return new Date(utc * 1000);
  }
}
