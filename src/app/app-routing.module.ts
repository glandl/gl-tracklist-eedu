import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { FavoritenlisteComponent } from './favoritenliste/favoritenliste.component';

const routes: Routes = [
  { path: '', component: ScheduleComponent },
  { path: 'favorites/:eventIndex', component: FavoritenlisteComponent },
  { path: 'detail/:eventIndex/:slot/:room', component: TrackDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
