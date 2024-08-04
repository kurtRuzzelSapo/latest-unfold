import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../../data.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createfaculty',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './createfaculty.component.html',
  styleUrl: './createfaculty.component.css'
})
export class CreatefacultyComponent {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
    // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'
  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}


  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      facFirstname: new FormControl(null, Validators.required),
      facLastname: new FormControl(null, Validators.required),
      facEmail: new FormControl(null, Validators.required),
      facPassword: new FormControl(null, Validators.required),
      facPosition: new FormControl(null, Validators.required),
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

  loadPortfolio(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.project) {
          this.studentPortfolio = response;
       
          console.log('View Portfolio details:', response);
          console.log("Checking:", this.studentPortfolio);
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        console.error('Error loading portfolio:', error);
      }
    );
  } 

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

 

  Insert() {
    this.formData.append('facFirstname', this.applyForm.value.facFirstname);
    this.formData.append('facLastname', this.applyForm.value.facLastname);
    this.formData.append('facEmail', this.applyForm.value.facEmail);
    this.formData.append('facPassword', this.applyForm.value.facPassword);
    this.formData.append('facPosition', this.applyForm.value.facPosition);

    this.ds.sendRequestWithMedia('add-faculty', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Inserted Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: "Inserted Successfully",
          icon: "success"
        });
        this.route.navigate(['/faculty']);
       
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToFaculty(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../faculty`], { relativeTo: this.aRoute });
  }
  routeToEditPorfolio(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../editportfolio`], { relativeTo: this.aRoute });
  }
}
