import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { environment } from '../environments/environment';
import { RegisterService} from '../app/shared/services/register.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { from } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http';
import { DropZoneDirective } from './shared/services/drop-zone.directive';
import { AngularFirestoreModule, AngularFirestore }    from 'angularfire2/firestore';
import { AngularFireStorageModule, AngularFireStorage }    from 'angularfire2/storage';
=======
import {AngularFirestoreModule, FirestoreSettingsToken} from "@angular/fire/firestore"

>>>>>>> b259ae7652b10d99e17febef1870e67815a7261c

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DropZoneDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    RegisterService,
    AuthService,
    AngularFireAuthGuard,
    {provide: FirestoreSettingsToken, useValue: {}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
