import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../../data.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editportfolio',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RouterLinkActive],
  templateUrl: './editportfolio.component.html',
  styleUrls: ['./editportfolio.component.css']
})
export class EditportfolioComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  projectID: any;
  projectData: any;
  // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI: string = 'http://localhost/unfold/unfold-api/';

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('projectID');
      if (idParam) {
        this.projectID = +idParam; // Convert string to number
        this.getData(this.projectID);
      } else {
        console.error('Project ID not found in route parameters');
      }
    });

    this.applyForm = new FormGroup({
      proTitle: new FormControl('', Validators.required),
      proLink: new FormControl('', Validators.required),
      proImg: new FormControl(null, Validators.required),
      proDate: new FormControl('', Validators.required),
      proDesc: new FormControl('', Validators.required)
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

  getData(projectID: number): void {
    this.ds.getRequestWithParams("get-project", { projectID: projectID }).subscribe(
      (response: any) => {
        if (response && response.project) {
          this.projectData = response;
          console.log('ProjectData', response);

          // Initialize the form with the fetched project data
          this.applyForm.patchValue({
            proTitle: this.projectData.project[0].projectTitle,
            proLink: this.projectData.project[0].projectLink,
            proDate: this.projectData.project[0].projectDate,
            proDesc: this.projectData.project[0].projectDesc
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
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('projectImg', this.selectedFile);

    this.ds.sendRequestWithMedia('add-project', this.formData).subscribe(
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

  Edit() {
    this.formData.append('projectTitle', this.applyForm.value.proTitle);
    this.formData.append('projectDesc', this.applyForm.value.proDesc);
    this.formData.append('projectLink', this.applyForm.value.proLink);
    this.formData.append('projectDate', this.applyForm.value.proDate);
    this.formData.append('projectID', this.projectID);
    this.formData.append('projectImg', this.selectedFile);

    this.ds.sendRequestWithMedia('edit-project', this.formData).subscribe(
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

  routeToPorfolio() {
    this.route.navigate([`../../portfolio`], { relativeTo: this.aRoute });
  }
}
