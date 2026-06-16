import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { FavoritenlisteComponent } from './favoritenliste/favoritenliste.component';
import { SchwerpunktBadgeComponent } from './shared/schwerpunkt-badge/schwerpunkt-badge.component';
import { ScheduleReuseStrategy } from './schedule-reuse-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SHEETS_API_KEY } from './shared/google-sheets.service';
import { sheetsApiKey } from '../environments/secrets';

import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({ declarations: [
        AppComponent,
        ScheduleComponent,
        TrackDetailComponent,
        FavoritenlisteComponent,
        SchwerpunktBadgeComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatCheckboxModule,
        MatGridListModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatSelectModule,
        MatFormFieldModule], providers: [
        { provide: SHEETS_API_KEY, useValue: sheetsApiKey },
        { provide: RouteReuseStrategy, useClass: ScheduleReuseStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
