import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IframeComponent } from './iframe/iframe.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'iframe', component: IframeComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
