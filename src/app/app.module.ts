import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { DisplayComponent } from './display/display.component';
import {FormsModule} from "@angular/forms";
import {TimerModule} from "./global/timer/timer.module";
import {GoalsModule} from "./global/goals/goals.module";

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DisplayComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        TimerModule,
        GoalsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
