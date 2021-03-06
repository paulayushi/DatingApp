import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/userservice/user.service';
import { AlerifyService } from '../services/alertifyservice/alerify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTab') memberTab: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private userSvc: UserService, private alertfySvc: AlerifyService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe( data => {
      this.user = data['user'];
    });
    this.router.queryParams.subscribe( params => {
      const selectedTab = params['tab'];
      this.memberTab.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }
  
  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number){
    this.memberTab.tabs[tabId].active = true;
  }
}
