import { Pipe, PipeTransform } from '@angular/core';

type Unit = 'meter' | 'kilometer';

@Pipe({
  name: 'changeUnitsMeasure',
  standalone: true,
})
export class ChangeUnitsMeasurePipe implements PipeTransform {
  transform(value: number, unitIn: Unit, unitOut: Unit): number {
    if (unitIn === unitOut) return value;
    let returnValue: number = 0;
    if (unitIn === 'meter') {
      switch (unitOut) {
        case 'kilometer':
          returnValue = value / 1000;
          break;
      }
    } else if (unitIn === 'kilometer') {
      switch (unitOut) {
        case 'meter':
          returnValue = value / 1000;
          break;
      }
    }
    return returnValue;
  }
}
