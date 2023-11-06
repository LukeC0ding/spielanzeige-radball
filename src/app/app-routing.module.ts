import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin/admin.component";
import {DisplayComponent} from "./display/display.component";

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'display', component: DisplayComponent },
  { path: '', redirectTo: '/display', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
