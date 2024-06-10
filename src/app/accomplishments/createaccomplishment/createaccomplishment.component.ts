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


@Component({
  selector: 'app-createaccomplishment',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
  templateUrl: './createaccomplishment.component.html',
  styleUrl: './createaccomplishment.component.css'
})
export class CreateaccomplishmentComponent {
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
     accomTitle: new FormControl(null, Validators.required),
     accomDesc: new FormControl(null, Validators.required),
     accomImg: new FormControl(null, Validators.required),
     accomLink: new FormControl(null, Validators.required),
     accomDate: new FormControl(null, Validators.required),
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

  loadAccomplishment(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.accomplishment) {
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
    this.formData.append('accomTitle', this.applyForm.value.accomTitle);
    this.formData.append('accomDesc', this.applyForm.value.accomDesc);
    this.formData.append('accomLink', this.applyForm.value.accomLink);
    this.formData.append('accomDate', this.applyForm.value.accomDate);
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('accomImg', this.selectedFile);

    this.ds.sendRequestWithMedia('addaccomplishment', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        alert("Inserted Successfully!");
        console.log(this.applyForm);
       
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToAccomplishment(){
    // this.route.navigateByUrl('../createaccomplishment');
    this.route.navigate([`../accomplishments`], { relativeTo: this.aRoute });
  }
}
