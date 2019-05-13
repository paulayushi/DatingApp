import { Component, OnInit, Input } from '@angular/core';
import { Messages } from '../model/messages';
import { UserService } from '../services/userservice/user.service';
import { AuthService } from '../services/auth.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Messages[];
  newMessage: any = {};
  constructor(private userSvc: UserService, private authSvc: AuthService, private alertifySvc: AlerifyService) { }
  ngOnInit() {
    this.getMessageThread();
  }

  getMessageThread() {
    const currrentUserId = +this.authSvc.decodedToken.nameid;
    this.userSvc.getMessageThread(this.authSvc.decodedToken.nameid, this.recipientId)
      .pipe( tap( messages => {
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].isRead === false && messages[i].recipientId === currrentUserId) {
            this.userSvc.markMessageAsRead(messages[i].id, currrentUserId);
          }
        }
      }))
      .subscribe( messages => {
        this.messages = messages;
      });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userSvc.sendMessage(this.authSvc.decodedToken.nameid, this.newMessage)
      .subscribe((message: Messages) => {
        this.messages.unshift(message);
        this.newMessage.content = '';
      });
  }
}
