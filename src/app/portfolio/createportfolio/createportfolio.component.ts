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
  selector: 'app-createportfolio',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
  templateUrl: './createportfolio.component.html',
  styleUrl: './createportfolio.component.css'
})
export class CreateportfolioComponent {
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
      proTitle: new FormControl(null, Validators.required),
      proDesc: new FormControl(null, Validators.required),
      proImg: new FormControl(null, Validators.required),
      proLink: new FormControl(null, Validators.required),
      proDate: new FormControl(null, Validators.required),
      proType: new FormControl(null, Validators.required),
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
    this.formData.append('projectTitle', this.applyForm.value.proTitle);
    this.formData.append('projectDesc', this.applyForm.value.proDesc);
    this.formData.append('projectLink', this.applyForm.value.proLink);
    this.formData.append('projectDate', this.applyForm.value.proDate);
    this.formData.append('projectType', this.applyForm.value.proType);
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('projectImg', this.selectedFile);

    this.ds.sendRequestWithMedia('add-project', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Inserted Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: "Inserted Successfully",
          icon: "success"
        });
        this.route.navigate(['/portfolio']);
       
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToPorfolio(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../portfolio`], { relativeTo: this.aRoute });
  }
  routeToEditPorfolio(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../editportfolio`], { relativeTo: this.aRoute });
  }
}
