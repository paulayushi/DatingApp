import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from '../model/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};

  constructor(private userSvc: UserService, private alertifySvc: AlerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
      this.userParams.minAge = 18;
      this.userParams.maxAge = 99;
      this.userParams.orderBy = 'lastActive';
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(){
    console.log(this.userParams.orderBy);
    this.userSvc.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe( (response: PaginationResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertifySvc.error(error);
      });
  }
  resetFilters(){
      this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
      this.userParams.minAge = 18;
      this.userParams.maxAge = 99;
      this.userParams.orderBy = 'lastActive';
      this.loadUsers();
  }
}
