import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  constructor(private userSvc: UserService, private alertifySvc: AlerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( date => {
      this.users = date['users'];
    });
  }
}
