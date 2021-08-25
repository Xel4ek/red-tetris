import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardsRoutingModule } from './leaderboards-routing.module';
import { LeaderboardsComponent } from './leaderboards.component';
import { MatButtonModule } from '@angular/material/button';
import { BackButtonModule } from '../../core/directives/back-button/back-button.module';
import { TruncateModule } from '../../core/pipes/truncate/truncate.module';

@NgModule({
  declarations: [LeaderboardsComponent],
  imports: [
    CommonModule,
    LeaderboardsRoutingModule,
    MatButtonModule,
    BackButtonModule,
    TruncateModule,
  ],
  exports: [],
})
export class LeaderboardsModule {}
