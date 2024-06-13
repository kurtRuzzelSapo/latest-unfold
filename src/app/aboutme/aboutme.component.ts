declare var $: any;
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, CommonModule, MatTableModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.scss',
})
export class AboutmeComponent implements OnInit {
  selectedFile: any;
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  studentList: any = [];
  studentPortfolio: any ={};
  studentAbout: any ={};
  selectedAboutText: string = '';
  selectedAboutDesc: string = '';
  selectedAboutImg: string = '';
  selectedAboutId: any;
   // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'



  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
  ) {
    // Initialize the form group
    this.applyForm = new FormGroup({
      proTitle: new FormControl('', Validators.required),
      proLink: new FormControl('', Validators.required),
      proImg: new FormControl(null, Validators.required),
      proDate: new FormControl('', Validators.required),
      proDesc: new FormControl('', Validators.required)
    });
    this.formData = new FormData();
  }

  ngOnInit(): void {
    this.formData = new FormData();

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));


  
    this.loadAbout();
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

  
  loadAbout(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
          // const aboutme = response.payload;
       
      },
      (error) => {
        console.error('Error loading about:', error);
      }
    );
}




  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  Insert() {
    this.formData.append('aboutText', this.applyForm.value.aboutText);
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('aboutImg', this.selectedFile);

    this.ds
      .sendRequestWithMedia('addaboutme', this.formData)
      .subscribe(
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

  Edit() {
    // Assuming you have access to the aboutId
    // const aboutId = this.selectedAboutId; // Update this with the actual variable holding the aboutId
    const formData = new FormData();
    formData.append('aboutID', this.applyForm.value.aboutID);
    formData.append('aboutText', this.applyForm.value.abouText);
    formData.append('studentID', this.userDetails.studentID);
    formData.append('aboutImg', this.selectedFile);
  
    this.ds
      .sendRequestWithMedia('editaboutme', formData)
      .subscribe(
        (response) => {
          // Handle successful response here if needed
          console.log('About Me edited successfully:', response);
          console.log(this.applyForm);
        },
        (error) => {
          // Handle error response here if needed
          console.error('Error editing about me:', error);
        }
      );
  }
  
  
  routeToEditAboutme(aboutID:any){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../editaboutme/${aboutID}`], { relativeTo: this.aRoute });
  }
}
