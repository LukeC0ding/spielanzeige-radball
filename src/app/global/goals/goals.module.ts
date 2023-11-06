import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from './goals.component';



@NgModule({
    declarations: [
        GoalsComponent
    ],
    exports: [
        GoalsComponent
    ],
    imports: [
        CommonModule
    ]
})
export class GoalsModule { }
