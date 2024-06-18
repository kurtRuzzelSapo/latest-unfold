import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../../data.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-createcontact',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './createcontact.component.html',
  styleUrl: './createcontact.component.css'
})
export class CreatecontactComponent {
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
      contLinkedin: new FormControl(null, Validators.required),
      contFB: new FormControl(null, Validators.required),
      contIG: new FormControl(null, Validators.required),
      contGithub: new FormControl(null, Validators.required),
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

  loadSkill(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.skill) {
          this.studentPortfolio = response;
       
          console.log('View Skill details:', response);
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


  Insert() {
    this.formData.append('contLinkedin', this.applyForm.value.contLinkedin);
    this.formData.append('contFB', this.applyForm.value.contFB);
    this.formData.append('contIG', this.applyForm.value.contIG);
    this.formData.append('contGithub', this.applyForm.value.contGithub);
    
  
    this.formData.append('studentID', this.userDetails.studentID);
 

    this.ds.sendRequestWithoutMedia('add-contact', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Inserted Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: "Inserted Successfully",
          icon: "success"
        });
        this.route.navigate(['/contact']);
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToContact(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../contact`], { relativeTo: this.aRoute });
  }
}
