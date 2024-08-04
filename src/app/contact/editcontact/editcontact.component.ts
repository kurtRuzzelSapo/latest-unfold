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
  selector: 'app-editcontact',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RouterLinkActive],
  templateUrl: './editcontact.component.html',
  styleUrl: './editcontact.component.css'
})
export class EditcontactComponent {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  contID:any;
  contData:any
    // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'
  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('contID');
      if (idParam) {
        this.contID = +idParam; // Convert string to number
        this.getData(this.contID);
      } else {
        console.error('cont ID not found in route parameters');
      }
    });

    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      contFB: new FormControl(null, Validators.required),
      contIG: new FormControl(null, Validators.required),
      contLinkedin: new FormControl(null, Validators.required),
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



  getData(contID: any): void {
    this.ds.getRequestWithParams("get-contact", { contID: contID }).subscribe(
      (response: any) => {
        if (response && response.contact) { // Ensure it checks the correct property
          this.contData = response.contact; // Directly access the cont object
          console.log('contID', response);
          console.log(this.contData);
          console.log(this.contData.contFB)
          // Initialize the form with the fetched cont data
          this.applyForm.patchValue({
            contLinkedin: this.contData.contLinkedin,
            contFB: this.contData.contFB,
            contIG: this.contData.contIG,
            contGithub: this.contData.contGithub
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

  Edit() {
    this.formData.append('contFB', this.applyForm.value.contFB);
    this.formData.append('contIG', this.applyForm.value.contIG);
    this.formData.append('contLinkedin', this.applyForm.value.contLinkedin);
    this.formData.append('contGithub', this.applyForm.value.contGithub);
    this.formData.append('contID', this.contID);

    this.ds.sendRequestWithMedia('edit-contact', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Updated Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: "Edited Successfully",
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
    this.route.navigate([`../../contact`], { relativeTo: this.aRoute });
  }
}
