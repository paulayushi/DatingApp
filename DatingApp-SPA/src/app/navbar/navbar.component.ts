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
  constructor(public authService: AuthService, private alertifySvc: AlerifyService, 
    private router: Router) {}

  ngOnInit() {}

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

  logout(){
    localStorage.removeItem('token');
    this.alertifySvc.message('Logged out successfully!');
    this.router.navigate(['\home']);
  }
}
