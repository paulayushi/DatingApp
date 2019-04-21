import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegisterMode = new EventEmitter();
  model: any = {};
  constructor( private authService: AuthService, private alertifySvc: AlerifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe( () => {
      this.alertifySvc.success('Registration is successful!');
    }, error => {
      this.alertifySvc.error(error);
    });
  }

  cancel() {
    this.cancelRegisterMode.emit(false);
  }
}
