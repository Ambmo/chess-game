import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { IframeComponent } from './iframe/iframe.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { ChessCommunicationService } from './services/chess-communication.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    IframeComponent
  ],
  imports: [
    NgxChessBoardModule.forRoot(),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ChessCommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
