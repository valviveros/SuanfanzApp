import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder, } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { RegisterService } from "src/app/shared/services/register.service";
import { HttpClient } from '@angular/common/http';
import { GroupI } from './interfaces/GroupI';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  registerList: UserI[];
  countMore: number = 0;
  countContact: number = 0;
  countProfile: number = 0;
  countGroup: number = 0;
  contactAdded: Boolean = false;
  contactGroup: Boolean = false;
  fileUrl: string;
  imgUrl: string;
  imageSelected: string;
  nameSelected: string;
  activeChat: any;
  addInfo: string;
  countPop: number = 0;
  GroupName: string;
  areAllMembers: Boolean = false;
  integrants: string[] = [];
  addToGroup: Boolean = false;
  groups: Array<GroupI> = [];

  yourNameForm = new FormGroup({
    yourName: new FormControl()
  });

  contactForm = new FormGroup({
    contactName: new FormControl(),
    contactNumber: new FormControl(),
  });

  groupForm = new FormGroup({
    groupName: new FormControl(),
    groupContactNumber: new FormControl(),
  });

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
    };

  chats: Array<ChatI> = [
    // {
    //   title: "Santi",
    //   icon: "/assets/img/ppRightBar.png",
    //   status: "online",
    //   isRead: false,
    //   msgPreview: "Entonces ando usando fotos reales hahaha",
    //   lastMsg: "11:13",
    //   msgs: [
    //     { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
    //     { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
    //   ]
    // },
    // {
    //   title: "Pablo Bejarano",
    //   icon: "/assets/img/ppInbox.png",
    //   status: "online",
    //   isRead: true,
    //   msgPreview: "Estrenando componente",
    //   lastMsg: "18:30",
    //   msgs: []
    // },
    // {
    //   title: "Pablo Bejarano 2",
    //   icon: "/assets/img/ppInbox.png",
    //   status: "online",
    //   isRead: true,
    //   msgPreview: "Nice front 😎",
    //   lastMsg: "23:30",
    //   msgs: []
    // },
  ];

  currentChat = {
    title: "",
    icon: "",
    status: "",
    msgs: []
  };

  constructor(public authService: AuthService, public chatService: ChatService, private router: Router, private firebase: AngularFireDatabase, private firebaseAuth: AngularFireAuth, private registerService: RegisterService, private http: HttpClient) { }

  ngOnInit(): void {
    this.registerService.getRegister()
      .snapshotChanges().subscribe(item => {
        this.registerList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.registerList.push(x as UserI);
        });
      });
    this.updateProfilePhoto();
    this.updateYourName()
    this.loadChats();
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
      this.whoIsWritingMe();
    });
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

  async loadChats() {
    let Key;
    const Email = this.firebaseAuth.auth.currentUser.email;

    await this.firebase.database.ref('users').once('value', users => {
      users.forEach(user => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramosCargaChat", childKey);
          console.log("recorridoCargaChat", childKey);
          user.forEach(info => {
            const infoChildKey = info.key;
            console.log("infoCargaChat", infoChildKey);
            if (infoChildKey == 'chatRooms') {
              info.forEach(chatRooms => {
                const contactChildKey = chatRooms.key;
                console.log("contactCargaChat", contactChildKey);
                chatRooms.forEach(chats => {
                  const chatContactChildKey = chats.key;
                  const chatContactChildData = chats.val();
                  console.log("chats", chatContactChildData);
                  this.chats.push(chatContactChildData);
                });
              });
            }
          });
        }
      });
    });
    this.initChat();
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

  panelEditProfile() {
    const query: string = '#app .editProfileManager';
    const editProfile: any = document.querySelector(query);
    const query2: string = '#app .searchIcon';
    const searchIcon: any = document.querySelector(query2);
    const query3: string = '#app .leftMoreOpen';
    const leftMoreOpen: any = document.querySelector(query3);
    if (this.countProfile == 0) {
      this.countProfile = 1;
      editProfile.style.left = 0;
      searchIcon.style.position = "relative";
      leftMoreOpen.style.transform = "scale(0)";
      leftMoreOpen.style.opacity = 0;
      this.countMore = 0;
    } else {
      this.countProfile = 0;
      editProfile.style.left = "-100vh";
      searchIcon.style.position = "absolute";
    }
  }

  getUrl(event) {
    this.fileUrl = event;
    console.log("URL recibida en padre: " + this.fileUrl);
  }
  async getImg(event) {
    this.imgUrl = event;
    console.log("URL recibida en padre: " + this.imgUrl);
    await this.sendImage();
    await this.updateProfilePhoto();
  }

  async sendImage() {
    if (this.imgUrl) {
      let Key;
      const Email = this.firebaseAuth.auth.currentUser.email;
      await this.firebase.database.ref("users").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            console.log("entramos", childKey);
            console.log("recorrido", childKey);
          }

        });
      });
      this.firebase.database.ref("users").child(Key).child("images").push({
        imgUrl: this.imgUrl
      });
    }
  }

  async searchImg() {
    let Key;
    let ContactNumber = this.contactForm.controls.contactNumber.value;
    this.imageSelected = '/assets/img/user.svg';

    await this.firebase.database.ref("users").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == ContactNumber || childData.phoneNumber.e164Number == ContactNumber) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            console.log("info", infoChildData);
            info.forEach((images) => {
              const imagesChildKey = images.key;
              const imagesChilData = images.val();
              console.log("images", imagesChildKey);
              images.forEach((imgUrl) => {
                const imagesChildKey = imgUrl.key;
                const imagesChildData = imgUrl.val();
                if (imagesChildKey == "imgUrl") {
                  this.imageSelected = imagesChildData;
                  console.log("IMAGEEEEEN", this.imageSelected);
                }
              });
            });
          });
        }
      });
    });
    return this.imageSelected;
  }

  async updateProfilePhoto() {
    let Key;
    const Email = this.firebaseAuth.auth.currentUser.email;

    await this.firebase.database.ref("users").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          user.forEach((info) => {
            info.forEach((images) => {
              images.forEach((imgUrl) => {
                const imagesChildKey = imgUrl.key;
                const imagesChildData = imgUrl.val();
                if (imagesChildKey == "imgUrl") {
                  this.imageSelected = imagesChildData;
                }
              });
            });
          });
        }
      });
    });

    if (this.imageSelected) {
      const query: string = "#app .profileBig";
      const profileBig: any = document.querySelector(query);
      const query2: string = "#app .profile";
      const profile: any = document.querySelector(query2);
      profileBig.src = this.imageSelected;
      profile.src = this.imageSelected;
    } else {
      this.imageSelected = "/assets/img/user.svg";
    }
  }

  async sendYourName() {
    console.log("Se envió el nombre");
    const YourName = this.yourNameForm.controls.yourName.value;
    let Key;
    const Email = this.firebaseAuth.auth.currentUser.email;
    await this.firebase.database.ref("users").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
        }
      });
    });
    this.firebase.database.ref("users").child(Key).child("nickname").push({
      yourName: YourName
    });
  }

  async updateYourName() {
    let Key;
    const Email = this.firebaseAuth.auth.currentUser.email;
    await this.firebase.database.ref("users").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          user.forEach((nickname) => {
            const nicknameChildKey = nickname.key;
            const nicknameChildData = nickname.val();
            if (nicknameChildKey == "nickname") {
              nickname.forEach((nicknameKey) => {
                const nicknameKeyChildKey = nicknameKey.key;
                const nicknameKeyChildData = nicknameKey.val();
                nicknameKey.forEach((yourName) => {
                  const yourNameChildKey = yourName.key;
                  const yourNameChildData = yourName.val();
                  this.nameSelected = yourNameChildData;
                })
              })
            }
          });
        }
      });
    });

    const query: string = "#app .inputYourName";
    const inputYourName: any = document.querySelector(query);
    if (this.nameSelected) {
      inputYourName.value = this.nameSelected;
    } else {
      this.nameSelected = "";
      inputYourName.value = this.nameSelected;
    }
  }

  openaddContact() {
    if (this.countContact == 0) {
      this.panelNewContact(this.countContact);
    } else {
      this.panelNewContact(this.countContact);
    }
  }

  panelNewContact(countContact: number) {
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
    let Key;
    const ContactName = this.contactForm.controls.contactName.value;
    let ContactNumber = this.contactForm.controls.contactNumber.value;
    const Email = this.firebaseAuth.auth.currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    let userExist;
    let addNumber;
    let addEmail;

    await this.firebase.database.ref('users').once('value', users => {
      users.forEach(user => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          user.forEach(info => {
            const infoChildKey = info.key;
            console.log("info", infoChildKey);
            info.forEach(contact => {
              const contactChildKey = contact.key;
              console.log("contact", contactChildKey);
              contact.forEach(numberContact => {
                const numberContactChildKey = numberContact.key;
                const numberContactChildData = numberContact.val();
                if (numberContactChildData == ContactNumber) {
                  console.log("Ya lo tienes añadido");
                  this.contactAdded = true;
                }
                console.log("numberContact", numberContactChildKey, numberContactChildData);
              });
            });
          });
        }
      });
    });

    if (ContactNumber.match(emailRegexp)) {
      // Es correo
      console.log("Es correo");
      userExist = this.registerList.find(user => user.email == ContactNumber);
      addNumber = userExist.phoneNumber.e164Number;
      ContactNumber = userExist && userExist.email || undefined;
      if (!userExist) {
        console.log("Este usuario no existe");
        const query: string = '#app #userDoesNotExist';
        const userDoesNotExist: any = document.querySelector(query);
        userDoesNotExist.style.display = "flex";
        setTimeout(() => {
          userDoesNotExist.style.display = "none";
        }, 3000);
      } else {
        if (!this.contactAdded) {
          this.searchImg();
          console.log(ContactName, ContactNumber);
          const query: string = '#app #contactAdded';
          const contactAdded: any = document.querySelector(query);
          contactAdded.style.display = "flex";
          setTimeout(() => {
            contactAdded.style.display = "none";
          }, 3000);
          this.firebase.database.ref('users').child(Key).child('contacts').push({
            contactName: ContactName,
            contactNumber: addNumber,
            contactEmail: ContactNumber,
          });
          // creamos su inbox-chat
          this.chats.push({
            email: ContactNumber,
            title: ContactName,
            icon: this.imageSelected,
            // status: "online",
            isRead: false,
            msgPreview: "Entonces ando usando fotos reales hahaha",
            lastMsg: "11:13",
            msgs: [
              { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
              { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
            ]
          });
          let chatsSize = this.chats.length - 1;
          this.firebase.database.ref('users').child(Key).child('chatRooms').push({
            chats: this.chats[chatsSize],
          });
        } else {
          console.log("Ya lo tienes añadido");
          const query: string = '#app #userAlreadyAdded';
          const userAlreadyAdded: any = document.querySelector(query);
          userAlreadyAdded.style.display = "flex";
          setTimeout(() => {
            userAlreadyAdded.style.display = "none";
          }, 3000);
        }
      }
    } else {
      console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find(user => user.phoneNumber.e164Number == ContactNumber && user);
      addEmail = userExist.email;
      if (!userExist) {
        console.log("Este usuario no existe");
        const query: string = '#app #userDoesNotExist';
        const userDoesNotExist: any = document.querySelector(query);
        userDoesNotExist.style.display = "flex";
        setTimeout(() => {
          userDoesNotExist.style.display = "none";
        }, 3000);
      } else {
        if (!this.contactAdded) {
          this.searchImg();
          console.log(ContactName, ContactNumber);
          const query: string = '#app #contactAdded';
          const contactAdded: any = document.querySelector(query);
          contactAdded.style.display = "flex";
          setTimeout(() => {
            contactAdded.style.display = "none";
          }, 3000);
          this.firebase.database.ref('users').child(Key).child('contacts').push({
            contactName: ContactName,
            contactNumber: ContactNumber,
            contactEmail: addEmail,
          });
          // creamos su inbox-chat
          this.chats.push({
            email: addEmail,
            title: ContactName,
            icon: this.imageSelected,
            // status: "online",
            isRead: false,
            msgPreview: "Entonces ando usando fotos reales hahaha",
            lastMsg: "11:13",
            msgs: [
              { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
              { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
            ]
          });
          let chatsSize = this.chats.length - 1;
          this.firebase.database.ref('users').child(Key).child('chatRooms').push({
            chats: this.chats[chatsSize],
          });
        } else {
          console.log("Ya lo tienes añadido");
          const query: string = '#app #userAlreadyAdded';
          const userAlreadyAdded: any = document.querySelector(query);
          userAlreadyAdded.style.display = "flex";
          setTimeout(() => {
            userAlreadyAdded.style.display = "none";
          }, 3000);
        }
      }
    }

    this.contactForm.reset({
      contactName: "",
      contactNumber: "",
    });
  }

  whoIsWritingMe() {
    console.log("Entre a la funcion renderizar");
    this.subscriptionList.msgs = this.chatService.paraRenderizarMensaje().subscribe((msg: MessageI) => {
      console.log("Llego mensaje");
      console.log(msg.content);
      if (this.chats.length == 0) {
        console.log("primer IF")
        this.cargandoContactos(msg);
      } else {
        for (let i = 0; i < this.chats.length; i++) {
          console.log("entre al for y voy en el recorrido: " + i)
          const newLocal = this.chats[i].email;
          if (msg.from === newLocal) {
            console.log("Segundo IF y meto nuevo mensage")
            console.log("ya exite el contacto")
            this.chats[i].lastMsg = msg.content
            this.chats[i].msgPreview = msg.time
            msg.isMe = this.currentChat.title === msg.owner ? true : false;
            this.chats[i].msgs.push(msg);
          } else {
            this.countPop = 0;
            // this.ConfirmPopUp(this.countPop);
            console.log("Entre al else")
            let f = i
            f++
            if (f == this.chats.length) {
              console.log("Entro al Elsey creo nuevo contacto")
              console.log("Nuevo contacto");
              this.cargandoContactos(msg);
              break
            }
          }
        }
      }
    });
  }

  panelNewGroup() {
    const query: string = '#app .addNewGroup';
    const addNewGroup: any = document.querySelector(query);
    const query2: string = '#app .searchIcon';
    const searchIcon: any = document.querySelector(query2);
    const query3: string = '#app .leftMoreOpen';
    const leftMoreOpen: any = document.querySelector(query3);
    if (this.countGroup == 0) {
      this.countGroup = 1;
      addNewGroup.style.left = 0;
      searchIcon.style.position = "relative";
      leftMoreOpen.style.transform = "scale(0)";
      leftMoreOpen.style.opacity = 0;
      this.countMore = 0;
    } else {
      this.countGroup = 0;
      addNewGroup.style.left = "-100vh";
      searchIcon.style.position = "absolute";
    }
  }

  async sendGroup() {
    let Key;
    this.GroupName = this.groupForm.controls.groupName.value;
    let GroupContactNumber = this.groupForm.controls.groupContactNumber.value;
    const Email = this.firebaseAuth.auth.currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    let userExist;
    let addNumber;
    let addEmail;
    let addName;

    await this.firebase.database.ref("users").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            info.forEach((contact) => {
              const contactChildKey = contact.key;
              contact.forEach((numberContact) => {
                const numberContactChildKey = numberContact.key;
                const numberContactchildData = numberContact.val();
                if (numberContactchildData == GroupContactNumber) {
                  this.contactGroup = true;
                }
                console.log(
                  "numberContact",
                  numberContactChildKey,
                  numberContactchildData
                );
              });
            });
          });
        }
      });
    });

    if (GroupContactNumber.match(emailRegexp)) {
      // Es correo
      console.log("Es correo");
      userExist = this.registerList.find((user) => user.email == GroupContactNumber);
      addNumber = userExist.phoneNumber.e164Number;
      addName = userExist.name + " " + userExist.lname;
      console.log("Es userexist");
      console.log(userExist);
      GroupContactNumber = (userExist && userExist.email) || undefined;

      if (!userExist) {
        console.log("Este usuario no existe");
        const query: string = '#app #groupUserDoesNotExist';
        const groupUserDoesNotExist: any = document.querySelector(query);
        groupUserDoesNotExist.style.display = "flex";
        setTimeout(() => {
          groupUserDoesNotExist.style.display = "none";
        }, 3000);
      } else {
        // if (!this.contactGroup) {
          if (this.areAllMembers == true) {
            this.areAllMembers = false;
            console.log("Entre en if de AreAllMembers");
            this.firebase.database.ref('users').child(Key).child(this.GroupName).push({
              owner: Email,
              integrants: this.integrants,
              name: this.GroupName,
              title: this.GroupName,
              icon: "/assets/img/user.svg",
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                { content: Email + " has invite you to the group " + this.GroupName, isRead: true, isMe: true, time: "7:24" },
              ]
            });
            this.integrants.push(GroupContactNumber);
            this.integrants = [];
          } else {
            console.log("Entre en else de AreAllMembers");
            const query: string = '#app #groupContactAdded';
            const groupContactAdded: any = document.querySelector(query);
            groupContactAdded.style.display = "flex";
            setTimeout(() => {
              groupContactAdded.style.display = "none";
            }, 3000);
            this.integrants.push(GroupContactNumber);
            console.log("integrants");
            console.log(this.integrants);
          }
        // } else {
        //   console.log("Ya lo tienes añadido");
        //   const query: string = '#app #groupUserAlreadyAdded';
        //   const groupUserAlreadyAdded: any = document.querySelector(query);
        //   groupUserAlreadyAdded.style.display = "flex";
        //   setTimeout(() => {
        //     groupUserAlreadyAdded.style.display = "none";
        //   }, 3000);
        // }
      } 
    } else {
      console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find((user) => user.phoneNumber.e164Number == GroupContactNumber && user);
      addEmail = userExist.email;
      addName = userExist.name + " " + userExist.lname;

      if (!userExist) {
        console.log("Este usuario no existe");
        const query: string = '#app #groupUserDoesNotExist';
        const groupUserDoesNotExist: any = document.querySelector(query);
        groupUserDoesNotExist.style.display = "flex";
        setTimeout(() => {
          groupUserDoesNotExist.style.display = "none";
        }, 3000);
      } else {
        if (!this.addToGroup) {
          this.searchImg();
          const query: string = '#app #groupContactAdded';
          const groupContactAdded: any = document.querySelector(query);
          groupContactAdded.style.display = "flex";
          setTimeout(() => {
            groupContactAdded.style.display = "none";
          }, 3000);
          this.groups.push({
            owner: Email,
            integrants: GroupContactNumber,
            name: addName,
            title: this.GroupName,
            icon: "/assets/img/user.svg",
            isRead: false,
            msgPreview: "Melosqui melosqui",
            lastMsg: "11:13",
            msgs: [
              { content: Email + " has invited you to the group " + this.GroupName, isRead: true, isMe: true, time: "7:24" },
            ]
          });
        } else {
          console.log("Este usuario no existe");
          const query: string = '#app #groupUserDoesNotExist';
          const groupUserDoesNotExist: any = document.querySelector(query);
          groupUserDoesNotExist.style.display = "flex";
          setTimeout(() => {
            groupUserDoesNotExist.style.display = "none";
          }, 3000);
        }
      }
    }
    // this.groupForm.reset({
    //   groupName: this.GroupName,
    //   groupContactNumber: ""
    // });
  }

  all() {
    this.areAllMembers = true;
    this.sendGroup();
    return this.areAllMembers;
  }

  async cargandoContactos(msg: MessageI) {
    msg.isMe = this.currentChat.title === msg.owner ? true : false;
    this.chats.push({
      email: msg.from,
      title: msg.from,
      icon: "/assets/img/user.svg",
      status: "online",
      msgPreview: msg.time,
      isRead: false,
      lastMsg: msg.content,
      msgs: [msg]
    })

    this.addInfo = msg.from;
  }
  async myNewMessages(msg: MessageI) {
    console.log("si imprimo mis mensajes")
    msg.isMe = true;
    this.currentChat.msgs.push(msg);
  }

  onSelectInbox(index: number) {

    this.activeChat = this.chats[index].email;
    console.log(this.activeChat);
    this.currentChat.title = this.chats[index].title;
    this.currentChat.icon = this.chats[index].icon;
    this.currentChat.status = this.chats[index].status;
    this.currentChat.msgs = this.chats[index].msgs;
    this.chatService.idenificadorId(this.activeChat);

  }

  SearchAnim() { }

  ConfirmPopUp(countPop: number) {
    const query: string = "#app .ConfirmPopUp";
    const ConfirmPopUp: any = document.querySelector(query);

    if (countPop == 0) {
      // this.countPop = 1;
      ConfirmPopUp.style.opacity = 1;
      ConfirmPopUp.style.transform = "scale(1)";
    } else {
      countPop = 0;
      ConfirmPopUp.style.opacity = 0;
      ConfirmPopUp.style.transform = "scale(0)";
    }
  }

  async Add() {
    let Email;
    console.log("Entre en add");
    this.countPop = 1;
    this.countContact = 0;
    // this.ConfirmPopUp(this.countPop);
    this.panelNewContact(this.countContact);

    Email = this.contactForm.controls.email;
    Email = this.addInfo;
  }
}
