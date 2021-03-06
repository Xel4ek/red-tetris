import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { MainComponent } from './main/main.component';
import { TerrainModule } from '../terrain/terrain.module';
import { InitGameComponent } from './init-game/init-game.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { InfoWidgetComponent } from './info-widget/info-widget.component';
import { HelpComponent } from './help/help.component';
import { WebsocketModule } from '../../core/services/websocket/websocket.module';
import { environment } from '../../../environments/environment';
import { SecureModule } from '../../core/directives/secure/secure.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    MainComponent,
    InitGameComponent,
    InfoWidgetComponent,
    HelpComponent,
  ],
  imports: [
    WebsocketModule.config({ url: environment.ws }),
    CommonModule,
    GameRoutingModule,
    TerrainModule,
    MatListModule,
    MatExpansionModule,
    SecureModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class GameModule {}
