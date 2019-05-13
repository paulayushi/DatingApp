import { Component, OnInit } from '@angular/core';
import { Messages } from '../model/messages';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Pagination, PaginationResult } from '../model/pagination';
import { UserService } from '../services/userservice/user.service';
import { AuthService } from '../services/auth.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Messages[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private alertifySvc: AlerifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
      console.log(this.messageContainer);
    });
  }
  loadMessages() {
    console.log(this.messageContainer);
    this.userSvc
      .getUserMessages(
        this.authSvc.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe((resp: PaginationResult<Messages[]>) => {
        if (resp != null) {
          this.messages = resp.result;
          this.pagination = resp.pagination;
        }
      });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.alertifySvc.confirm('Are you really want to delete this message?', () => {
      this.userSvc.deleteMessage(id, this.authSvc.decodedToken.nameid).subscribe( () => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertifySvc.success('The message is successfully deleted.');
      }, error => {
        this.alertifySvc.error('Failed to delete the message.')
      });
    });
  }
}
