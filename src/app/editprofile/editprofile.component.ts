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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditprofileComponent implements OnInit {
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
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      birthdate: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      contacts: new FormControl(null, [Validators.required]),
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
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      birthdate: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      contacts: new FormControl(null, [Validators.required]),
      // course: new FormControl(null, Validators.required),
      // school: new FormControl(null, Validators.required),
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
          
          // Initialize the form with the fetched skill data
          this.applyForm.patchValue({
                      firstName: this.studentData.firstName,
                      lastName: this.studentData.lastName,
                      position: this.studentData.position,
                      birthdate: this.studentData.birthdate,
                      address: this.studentData.address,
                      contacts: this.studentData.contacts,
                    
          });
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
    this.formData.append('firstName', this.applyForm.value.firstName);
    this.formData.append('lastName', this.applyForm.value.lastName);
    this.formData.append('position', this.applyForm.value.position);
    this.formData.append('birthdate', this.applyForm.value.birthdate);
    this.formData.append('address', this.applyForm.value.address);
    this.formData.append('contacts', this.applyForm.value.contacts);
  

    this.ds.sendRequestWithMedia('edit-profile', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        Swal.fire({
          title: "Profile Updated Successfully",
          icon: "success"
        });
        this.route.navigate(['/newsfeed']);
        this.userDetails = JSON.parse(this.cookieService.get('user_details'));
        console.log(this.applyForm);
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToUploadProfile(studentID:any){
    this.route.navigate([`../../uploadprofile/${studentID}`], { relativeTo: this.aRoute });
  }
  routeToSecurity(studentID:any){
    this.route.navigate([`../../security/${studentID}`], { relativeTo: this.aRoute });
  }

  routeToEditProfile(studentID: any) {
    this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
  routeToFacSecurity(facID:any){
    this.route.navigate([`../facSecurity/${facID}`], { relativeTo: this.aRoute });
  }
}
