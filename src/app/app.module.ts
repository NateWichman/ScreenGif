import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecorderComponent } from './recorder/recorder.component';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    RecorderComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
