import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  uri: string;

  constructor(private _http: HttpClient) {}

  login(model: any) {
    this.uri = 'login';
    return this._http.post(this.baseUrl + this.uri, model).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(model: any) {
    this.uri = 'register';
    return this._http.post(this.baseUrl + this.uri, model);
  }
}
