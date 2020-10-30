import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DropZoneDirective } from '../../../shared/services/drop-zone.directive';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule
  ],
})
export class HomeModule { }
