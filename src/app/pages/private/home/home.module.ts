import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule
  ],
})
export class HomeModule { }
