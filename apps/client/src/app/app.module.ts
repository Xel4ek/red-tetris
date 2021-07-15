import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketModule } from './core/services/websocket/websocket.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebsocketModule.config({ url: environment.ws }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
