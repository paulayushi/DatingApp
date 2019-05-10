import { Component, OnInit, Input } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private userService: UserService, 
    private authSvc: AuthService, private alertifySvc: AlerifyService) { }

  ngOnInit() {
  }

  likeUser(recipientId: number){
    this.userService.likeUser(this.authSvc.decodedToken.nameid, this.user.id).subscribe( () => {
      this.alertifySvc.success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertifySvc.error(error);
    });
  }
}
