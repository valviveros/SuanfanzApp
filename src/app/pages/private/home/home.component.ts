import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder, } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  countMore: number = 0;
  countContact: number = 0;
  registerList: UserI[];

  contactForm = new FormGroup({
    contactName: new FormControl(),
    contactNumber: new FormControl(),
  });

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
    };

  chats: Array<ChatI> = [
    {
      title: "Santi",
      icon: "/assets/img/ppRightBar.png",
      status: "online",
      isRead: false,
      msgPreview: "Entonces ando usando fotos reales hahaha",
      lastMsg: "11:13",
      msgs: [
        { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
        { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
      ]
    },
    {
      title: "Pablo Bejarano",
      icon: "/assets/img/ppInbox.png",
      status: "online",
      isRead: true,
      msgPreview: "Estrenando componente",
      lastMsg: "18:30",
      msgs: []
    },
    {
      title: "Pablo Bejarano 2",
      icon: "/assets/img/ppInbox.png",
      status: "online",
      isRead: true,
      msgPreview: "Nice front 😎",
      lastMsg: "23:30",
      msgs: []
    },
  ];

  currentChat = {
    title: "",
    icon: "",
    status: "",
    msgs: []
  };

  constructor(public authService: AuthService, public chatService: ChatService, private router: Router, private firebase: AngularFireDatabase, private firebaseAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.initChat();
  }

  ngOnDestroy(): void {
    this.destroySubscriptionList();
    this.chatService.disconnect();
  }

  initChat() {
    if (this.chats.length > 0) {
      this.currentChat.title = this.chats[0].title;
      this.currentChat.icon = this.chats[0].icon;
      this.currentChat.status = this.chats[0].status;
      this.currentChat.msgs = this.chats[0].msgs;
    }
    this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
      console.log("Nos conectamos");
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        msg.isMe = this.currentChat.title === msg.owner ? true : false;
        this.currentChat.msgs.push(msg);
      });
    });
  }

  onSelectInbox(index: number) {
    this.currentChat.title = this.chats[index].title;
    this.currentChat.icon = this.chats[index].icon;
    this.currentChat.status = this.chats[index].status;
    this.currentChat.msgs = this.chats[index].msgs;
  }

  async doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  onMore() {
    const query: string = '#app .leftMoreOpen';
    const leftMoreOpen: any = document.querySelector(query);

    if (this.countMore == 0) {
      this.countMore = 1;
      leftMoreOpen.style.transform = "scale(1)";
      leftMoreOpen.style.opacity = 1;
    } else {
      this.countMore = 0;
      leftMoreOpen.style.transform = "scale(0)";
      leftMoreOpen.style.opacity = 0;
    }
  }

  panelNewContact() {
    const query: string = '#app .addNewContact';
    const addNewContact: any = document.querySelector(query);
    const query2: string = '#app .searchIcon';
    const searchIcon: any = document.querySelector(query2);
    const query3: string = '#app .leftMoreOpen';
    const leftMoreOpen: any = document.querySelector(query3);
    if (this.countContact == 0) {
      this.countContact = 1;
      addNewContact.style.left = 0;
      searchIcon.style.position = "relative";
      leftMoreOpen.style.transform = "scale(0)";
      leftMoreOpen.style.opacity = 0;
      this.countMore = 0;
    } else {
      this.countContact = 0;
      addNewContact.style.left = "-100vh";
      searchIcon.style.position = "absolute";
    }
  }

  async addNewContact() {
    let database = this.firebase.database;
    let Key;
    const ContactName = this.contactForm.controls.contactName.value;
    const ContactNumber = this.contactForm.controls.contactNumber.value;
    const Email = this.firebaseAuth.auth.currentUser.email;
    await this.firebase.database.ref('users').once('value', users => {
      users.forEach(user => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos",childKey);
        }
        console.log("recorrido",childKey);
      });
    });
    
    console.log(ContactName, ContactNumber);
    this.firebase.database.ref('users').child(Key).child('contacts').push({
      contactName: ContactName,
      contactNumber: ContactNumber,
    });
  }
}
