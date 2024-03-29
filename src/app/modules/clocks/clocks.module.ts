import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClocksRoutingModule } from './clocks-routing.module';
import { ClocksComponent } from './clocks/clocks.component';
import { RouterModule } from '@angular/router';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';

@NgModule({
  declarations: [ClocksComponent],
  imports: [CommonModule, ClocksRoutingModule, RouterModule, TruncateTextPipe],
})
export class ClocksModule {}
