import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackDetailComponent } from './track-detail/track-detail.component';

const routes: Routes = [
  { path: 'detail/:eventIndex/:slot/:room', component: TrackDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
