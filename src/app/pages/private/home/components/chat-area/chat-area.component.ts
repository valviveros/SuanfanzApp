import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from '../../interfaces/ChatI';
import { MessageI } from '../../interfaces/MessageI';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  sockect;
  userConnected: string 
  @Input() title: string = ""
  @Input() icon: string = ""
  @Input() status: string = ""
  @Input() msgs: Array<MessageI> = []

  msg: string;
  constructor(public chatService: ChatService) { 
    this.sockect = io();

  }

  ngOnInit(): void {
    this.sockect.on('broadcast',(sockect) => {
      console.log("sdfsdfsdf")
      document.body.innerHTML = sockect;
      
    });
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
