import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../model/user";
import { UserService } from "../services/userservice/user.service";
import { AlerifyService } from "../services/alertifyservice/alerify.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    constructor(private userSvc: UserService, private alertifySvc: AlerifyService,
                private router: Router) {}
    resolve(route: ActivatedRouteSnapshot): Observable<User[]>{        
        return this.userSvc.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError( error => {
                this.alertifySvc.error('Problems in retrieving data!');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}