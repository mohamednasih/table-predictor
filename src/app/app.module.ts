import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { PredictFixtureComponent } from './components/predict-fixture/predict-fixture.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    PredictFixtureComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
