import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

import { OktaAuthModule } from '@okta/okta-angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    ProfileComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule.initAuth({
      issuer: 'https://dev-322018.oktapreview.com/oauth2/default',
      redirectUri: 'http://localhost:4200/implicit/callback',
      clientId: '0oaipoqa789EAewTL0h7'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
