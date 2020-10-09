import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OverlayRecordComponent } from './overlay-record/overlay-record.component';
import { OverlayComponent } from './overlay/overlay.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'overlay',
    component: OverlayComponent
  },
  {
    path: 'overlay-record',
    component: OverlayRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
