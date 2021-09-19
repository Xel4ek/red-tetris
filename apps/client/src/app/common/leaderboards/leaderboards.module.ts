import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardsRoutingModule } from './leaderboards-routing.module';
import { LeaderboardsComponent } from './leaderboards.component';
import { MatButtonModule } from '@angular/material/button';
import { TruncateModule } from '../../core/pipes/truncate/truncate.module';
import { MatTableModule } from '@angular/material/table';
import { KeysModule } from '../../core/pipes/keys/keys.module';
import { BackButtonModule } from '../../core/directives/back-button/back-button.module';

@NgModule({
  declarations: [LeaderboardsComponent],
  imports: [
    CommonModule,
    LeaderboardsRoutingModule,
    MatButtonModule,
    TruncateModule,
    MatTableModule,
    KeysModule,
    BackButtonModule,
  ],
  exports: [],
})
export class LeaderboardsModule {}
