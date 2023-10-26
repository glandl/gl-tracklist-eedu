import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';

import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    MatGridListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [ {
    provide: API_KEY,
    useValue: 'Find it in the Google Sheets API dashboard'
  }
  ,GoogleSheetsDbService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
