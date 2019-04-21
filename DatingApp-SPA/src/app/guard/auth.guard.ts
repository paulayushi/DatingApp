import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private route: Router,
    private alerifySvc: AlerifyService){}
  canActivate(): boolean {
    if(this.authSvc.loggedIn()){
      return true;
    }
    this.alerifySvc.error('You are not logged in. Action is not allowed!!');
    this.route.navigate(['\home']);
    return false;
  }
}
