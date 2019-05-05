import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../model/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getPhotoChangeUrl = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentPhoto: Photo;

  constructor(private authSvc: AuthService, private userSvc: UserService,
    private alertifySvc: AlerifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authSvc.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response , status , headers) => {
      const resp: Photo = JSON.parse(response);
      const photo = {
        id: resp.id,
        url: resp.url,
        dateAdded: resp.dateAdded,
        description: resp.description,
        isMain: resp.isMain
      };
      this.photos.push(photo);
      if (resp.isMain) {
        this.authSvc.updateCurrentPhotoUrl(photo.url);
        this.authSvc.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authSvc.currentUser));
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userSvc.setMainPhoto(this.authSvc.decodedToken.nameid, photo.id).subscribe(() => {
      this.currentPhoto = this.photos.filter( p => p.isMain === true)[0];
      this.currentPhoto.isMain = false;
      photo.isMain = true;
      this.authSvc.updateCurrentPhotoUrl(photo.url);
      this.authSvc.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authSvc.currentUser));
    }, error => {
      this.alertifySvc.error(error);
    });
  }

  deletePhoto(photoId: number) {
    this.alertifySvc.confirm('Do you want to delete this photo from your profile?', () => {
      this.userSvc.deletePhoto(this.authSvc.decodedToken.nameid, photoId).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
      }, error => {
        this.alertifySvc.error('Something went wrong. Unable to delete the photo at this moment!');
      });
    });
  }
}
