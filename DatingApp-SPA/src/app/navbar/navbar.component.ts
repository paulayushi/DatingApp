import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AlerifyService } from "../services/alertifyservice/alerify.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  constructor(public authService: AuthService, private alertifySvc: AlerifyService, 
    private router: Router) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe( photoUrl => this.photoUrl = photoUrl);
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifySvc.success('Logged in successfully!');
      },
      error => {
        this.alertifySvc.error(error);
      },
      ()=>{
        this.router.navigate(['\members']);
      }
    );
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertifySvc.message('Logged out successfully!');
    this.router.navigate(['\home']);
  }
}
