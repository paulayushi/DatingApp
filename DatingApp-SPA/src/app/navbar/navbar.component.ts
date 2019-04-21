import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AlerifyService } from "../services/alertifyservice/alerify.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alertifySvc: AlerifyService) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifySvc.success('Logged in successfully!');
      },
      error => {
        this.alertifySvc.error(error);
      }
    );
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this.alertifySvc.message('Logged out successfully!')
  }
}
