import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from 'src/app/model/user';
import { Observable } from 'rxjs';
import { PaginationResult } from 'src/app/model/pagination';
import { map } from 'rxjs/operators';

// const httpOptions = {
//   headers : new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?, likeParam?: string): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>()
    let params = new HttpParams();
    if (pageNumber != null && pageSize != null){
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    if (userParams != null){
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likeParam && likeParam.toLowerCase() === 'likers'){
      params = params.append('likers', 'true');
    }
    if (likeParam && likeParam.toLowerCase() === 'likees'){
      params = params.append('likees', 'true');
    }
    return this._http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params}).pipe(
      map(response => {
        paginationResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginationResult;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this._http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this._http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, photoId: number) {
     return this._http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
  }

  deletePhoto(userId: number, photoId: number){
    return this._http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId);
  }

  likeUser(id: number, recipientId: number) {
    return this._http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }
}
