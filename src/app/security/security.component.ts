import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  studentID:any;
  studentData:any
  studentProfile:any
    // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/';
  
  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
  ) {
    // Initialize the form group
    this.applyForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
    });
    this.formData = new FormData();
  }


  ngOnInit(): void {

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('studentID');
      if (idParam) {
        this.studentID = +idParam; // Convert string to number
        this.getData(this.studentID);
      } else {
        console.error('Accomplishment ID not found in route parameters');
      }
    });

    this.applyForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
    });

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Competition details:', response);
      },
      (error) => {
        console.error('Error retrieving portfolio:', error);
      }
    );

  }

  getData(studentID: any): void {
    this.ds.getRequestWithParams("view-portfolio", { id: studentID }).subscribe(
      (response: any) => {
        if (response && response.student) { // Ensure it checks the correct property
          this.studentData = response.student; // Directly access the skill object
          this.studentProfile = response.about; // Directly access the skill object
          console.log('studentID', response);
          console.log(this.studentData);
          console.log(this.studentData.firstName  )
          
//                   this.applyForm.patchValue({
//           email: this.studentData.email,
//           oldPassword: this.studentData.password,
        
// });
      
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        console.error('Error Getting Data:', error);
      }
    );
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  Edit() {
 
    this.formData.append('studentID', this.studentID);
    
    this.formData.append('oldPassword', this.applyForm.value.oldPassword);
    this.formData.append('newPassword', this.applyForm.value.newPassword);

  

    this.ds.sendRequestWithMedia('edit-credentials', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        alert("Updated Successfully!");
        console.log(this.applyForm);

      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }


  routeToUploadProfile(studentID:any){
    this.route.navigate([`uploadprofile/${studentID}`], { relativeTo: this.aRoute });
  }

  routeToEditProfile(studentID: any) {
    this.route.navigate([`../../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
}
