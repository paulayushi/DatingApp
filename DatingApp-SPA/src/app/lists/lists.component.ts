import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { Pagination, PaginationResult } from '../model/pagination';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  likesParam: string;
  pagination: Pagination;

  constructor(private userSvc: UserService, private alertifySvc: AlerifyService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(){
    this.userSvc.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe( (response: PaginationResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertifySvc.error(error);
      });
  }
}
