import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { UserI } from '../interfaces/UserI';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user: UserI | undefined;

  constructor(private firebaseAuth: AngularFireAuth) { }


  async logout() {
    await this.firebaseAuth.auth.signOut();
  }
}
