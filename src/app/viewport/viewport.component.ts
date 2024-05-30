import { Component, OnInit, inject } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-viewport',
  standalone: true,
  imports: [TopnavComponent, CommonModule,  ReactiveFormsModule, RouterLink],
  providers: [CookieService],
  templateUrl: './viewport.component.html',
  styleUrl: './viewport.component.css'
})


export class ViewportComponent {
  formData:any  
  userDetails: any;
 studentImage: any;
  cookieService = inject(CookieService);
  studentList: any = [CommonModule];
  studentPortfolio: any ={};
  studentID: any;

  baseAPI:string = 'https://unfoldap.online/unfold-api'
  constructor(private ds: DataService,private route: ActivatedRoute){}

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


      this.route.params.subscribe(params => {
        // Access parameter values
        const studentID = params['studentID'];
        // console.log('Student ID:', studentID);

        this.ds.getRequestWithParams("view-portfolio",{id: studentID}).subscribe(
          (response: any) => {
            this.studentPortfolio = response
            console.log('View Portfolio details:', response);
            this.studentImage = `${this.baseAPI}${this.studentPortfolio.about.aboutImg}`;
          },
          (error) => {
            console.error('Error submitting application:', error);
          }
        )
      });

      // this.ds.getRequest("view-allportfolio").subscribe(
      //   (response: any) => {
      //     this.studentPortfolio = response
      //     console.log("this is about me ",this.studentPortfolio.aboutme)
      //     console.log('View ALL Portfolio details:', response);
      //   },
      //   (error) => {
      //     console.error('Error submitting application:', error);
      //   }
      // )

      
     
  }
}
