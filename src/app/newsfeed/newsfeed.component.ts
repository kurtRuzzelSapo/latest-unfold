import { Component, OnInit, inject } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [TopnavComponent, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css'
})
export class NewsfeedComponent {
  formData:any  
  userDetails: any;
  cookieService = inject(CookieService);
  studentList: any = [];
  studentPortfolio: any ={};
  
  baseAPI:string = 'https://unfoldap.online/unfold-api'
  constructor(private ds: DataService, private route: Router) {}


  ngOnInit(): void {
    this.formData = new FormData();
      this.userDetails = JSON.parse(this.cookieService.get('user_details'));

      this.ds.getRequest("get-all-students").subscribe(
        (response: any) => {
          this.studentList = response;  
          console.log('User details:', response);
        },
        (error) => {
          console.error('Error submitting application:', error);
        }
      )


      this.ds.getRequest("view-allportfolio").subscribe(
        (response: any) => {
          this.studentPortfolio = response
          console.log("this is about me ",this.studentPortfolio.aboutme)
          console.log('View ALL Portfolio details:', response);
        },
        (error) => {
          console.error('Error submitting application:', error);
        }
      )
  }

  ViewPortfolio(e:any,studentID: string){
    e.preventDefault();
    this.route.navigateByUrl(`viewport/${studentID}`);
   
    
    console.log(studentID);
  }
}

