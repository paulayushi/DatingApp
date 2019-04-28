import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../model/user";
import { UserService } from "../services/userservice/user.service";
import { AlerifyService } from "../services/alertifyservice/alerify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userSvc: UserService, private authSvc: AuthService,
        private alertifySvc: AlerifyService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userSvc.getUser(this.authSvc.decodedToken.nameid).pipe(
            catchError( error => {
                this.alertifySvc.error('Problems in retrieving your data!');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
    }
}