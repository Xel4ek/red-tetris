import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketModule } from './core/services/websocket/websocket.module';
import { environment } from '../environments/environment';
import { SunboxComponent } from './sunbox/sunbox/sunbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { SecureModule } from './core/directives/secure/secure.module';

@NgModule({
  declarations: [AppComponent, SunboxComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebsocketModule.config({ url: environment.ws }),
    BrowserAnimationsModule,
    MatButtonModule,
    SecureModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
