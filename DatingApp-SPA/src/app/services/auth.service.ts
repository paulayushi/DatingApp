import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/environments/environment";
import { User } from "../model/user";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  uri: string;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl= new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private _http: HttpClient) {}

  updateCurrentPhotoUrl(photoUrl: string){
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    this.uri = 'login';
    return this._http.post(this.baseUrl + this.uri, model).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.currentUser));
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
          this.currentUser = response.currentUser;
          this.updateCurrentPhotoUrl(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(model: any) {
    this.uri = 'register';
    return this._http.post(this.baseUrl + this.uri, model);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
