import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';
import { HomeComponent } from 'src/app/pages/private/home/home.component';
import { v4 as uuidv4 } from 'uuid';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  @Input() title: string = ""
  @Input() status: string = ""
  @Input() icon: string = ""
  @Input() msgs: Array<MessageI> = []

  msg: string;
  socket = io.connect('http://localhost:3000');

  constructor(public chatService: ChatService, public homeComponent: HomeComponent) { }

  ngOnInit(): void {
    this.socket.on('broadcast', (socket) => {
      const status = document.getElementById('statusConection');
      status.innerHTML = socket
    })
  }
  getTime(date){
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
  }
  sendMsg() {
    const msg: MessageI = {
      id:uuidv4(),
      content: this.msg,
      status: "",
      isMe: true,
      time: this.getTime(new Date(Date.now())),
      isRead: false,
      owner: this.title,
      from:""
    }
    this.homeComponent.myNewMessages(msg);
    this.chatService.sendMsg(msg);
    this.msg = "";
  }
}
