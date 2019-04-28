import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/userservice/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlerifyService,
              private userSvc: UserService, private authSvc: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.user = data['user'];
    });
  }

  updateUser() {
    this.userSvc.updateUser(this.authSvc.decodedToken.nameid, this.user).subscribe( next => {
      this.alertify.success('User profile updated successfully.');
      this.editForm.reset(this.user);
    });
  }
}
