import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageI } from 'src/app/pages/private/home/interfaces/MessageI';
import {AngularFirestore} from "@angular/fire/firestore"
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any;

  constructor(private db : AngularFirestore) { }

  getChatRooms(){
    return this.db.collection('chatsRooms').snapshotChanges()//observar cambios en tiempo real
  }

  getchatRoom(chat_id : string){
    return this.db.collection('chatsRoom').doc(chat_id).valueChanges()
  }

  connect() {
    return new Observable(observer => {
<<<<<<< HEAD
      this.socket = io('https://e080f766421c.ngrok.io');
=======
      this.socket = io('localhost:3000');
>>>>>>> b259ae7652b10d99e17febef1870e67815a7261c
      this.socket.on('connect', () => {
        observer.next();
      })
    })
  }

  getNewMsgs() {
    return new Observable(observer => {
      this.socket.on("newMsg", msg => {
        observer.next(msg);
      });
    });
  }

  sendMsg(msg: MessageI) {
    this.socket.emit('newMsg', msg);
  }

  disconnect() {
    this.socket.disconnect();
  }


}
