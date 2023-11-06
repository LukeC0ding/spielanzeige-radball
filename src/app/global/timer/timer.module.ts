import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer.component';
import {CountdownComponent} from "ngx-countdown";



@NgModule({
    declarations: [
        TimerComponent
    ],
    exports: [
        TimerComponent
    ],
    imports: [
        CommonModule,
        CountdownComponent,
    ]
})
export class TimerModule { }
