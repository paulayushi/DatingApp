import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Messages } from '../model/messages';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Messages[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';
    constructor(private userSvc: UserService, private alertifySvc: AlerifyService,
                private authService: AuthService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Messages[]> {
        return this.userSvc.getUserMessages(this.authService.decodedToken.nameid, this.pageNumber,
            this.pageSize, this.messageContainer).pipe(
            catchError( () => {
                this.alertifySvc.error('Problems in retrieving messages!');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}