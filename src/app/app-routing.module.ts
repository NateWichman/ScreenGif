import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OverlayComponent } from './overlay/overlay.component';
import { TesterComponent } from './tester/tester.component';

const routes: Routes = [
  {
    path: '',
    component: TesterComponent
  },
  {
    path: 'overlay',
    component: OverlayComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
