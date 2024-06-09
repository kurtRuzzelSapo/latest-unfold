declare var $: any;
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,SidenavComponent,TopnavComponent, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  studentPortfolio: any = {};
   // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'
  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      contName: new FormControl(null, Validators.required),
      contNumber: new FormControl(null, Validators.required),
      contEmail: new FormControl(null, Validators.required),
      contHome: new FormControl(null, Validators.required)
    });

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
      },
      (error) => {
        console.error('Error retrieving portfolio:', error);
      }
    );
  }
  

  Insert() {
    this.formData.append('contName', this.applyForm.value.contName);
    this.formData.append('contNumber', this.applyForm.value.contNumber);
    this.formData.append('contEmail', this.applyForm.value.contEmail);
    this.formData.append('contHome', this.applyForm.value.contHome);
    this.formData.append('studentID', this.userDetails.studentID);

    this.ds.sendRequestWitoutMedia('add-contact', this.formData).subscribe(
      (response) => {
        // Handle successful response here if needed
        console.log('Application submitted successfully:', response);
        console.log(this.applyForm);
      },
      (error) => {
        // Handle error response here if needed
        console.error('Error submitting application:', error);
      }
    );
  }

  openModalpopup(){
    $('#exampleModalCenter').modal('show')
  }
  
  closePopup(){
    $('#exampleModalCenter').modal('hide')
  }
}
