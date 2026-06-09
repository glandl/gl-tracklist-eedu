import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SHEETS_API_KEY } from './shared/google-sheets.service';
import { sheetsApiKey } from '../environments/secrets';

import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({ declarations: [
        AppComponent,
        TrackDetailComponent
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
        MatSelectModule,
        MatFormFieldModule], providers: [
        { provide: SHEETS_API_KEY, useValue: sheetsApiKey },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
