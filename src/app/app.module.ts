import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';

var config = {
  apiKey: "AIzaSyCG1y6pBRwKQCaNjaL1pPGYiaWjaT2Efrg",
  authDomain: "suanfanzapp.firebaseapp.com",
  databaseURL: "https://suanfanzapp.firebaseio.com",
  projectId: "suanfanzapp",
  storageBucket: "suanfanzapp.appspot.com",
  messagingSenderId: "629403544257",
  appId: "1:629403544257:web:900f292c09f3f77c410240",
  measurementId: "G-JB1GEBLZJE"
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
