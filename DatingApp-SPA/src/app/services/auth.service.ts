import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  uri: string;
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private _http: HttpClient) {}

  login(model: any) {
    this.uri = 'login';
    return this._http.post(this.baseUrl + this.uri, model).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
          console.log(this.decodedToken);
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
