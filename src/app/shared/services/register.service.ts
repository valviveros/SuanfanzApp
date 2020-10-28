import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { UserI } from "../interfaces/UserI";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  registerList: AngularFireList<any>;
  // selectedProduct: UserI = new UserI();

  constructor(private firebase: AngularFireDatabase) { }

  getRegister(){
    return this.registerList = this.firebase.list('users');
  }

  insertRegister(register: UserI){

    this.registerList.push({
      email: register.email,
      phoneNumber: register.phoneNumber,
      password: register.password,
      name: register.name,
      lname: register.lname,      
    });
  }
}
