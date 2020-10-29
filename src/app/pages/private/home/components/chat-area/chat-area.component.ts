import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from '../../interfaces/ChatI';
import { MessageI } from '../../interfaces/MessageI';
// import * as io from 'socket.io-client';
import * as io from 'socket.io-client'



@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  userConnected: string 
  socket = io.connect('http://localhost:3000');
  @Input() title: string = ""
  @Input() icon: string = ""
  @Input() status: string = ""
  @Input() msgs: Array<MessageI> = []

  msg: string;
  constructor(public chatService: ChatService) { 

  }

  ngOnInit(): void {
    this.socket.on('broadcast',(socket) =>{
      const status = document.getElementById('statusConection');
      status.innerHTML = socket
    })
  }
  sendMsg() {
    const msg: MessageI = {
      content: this.msg,
      isMe: true,
      time: "8:58",
      isRead: false,
      owner: this.title
    }
    this.chatService.sendMsg(msg);
    this.msg = "";
  }
}
