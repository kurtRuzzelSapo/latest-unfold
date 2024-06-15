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
  selector: 'app-editaboutme',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ReactiveFormsModule],
  templateUrl: './editaboutme.component.html',
  styleUrl: './editaboutme.component.css'
})
export class EditaboutmeComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: FormData;
  applyForm: FormGroup;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  aboutID: any;
  aboutData: any;
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
    this.applyForm = new FormGroup({
      aboutText: new FormControl('', Validators.required),
      aboutImg: new FormControl(null, Validators.required),
     
    });
    this.formData = new FormData();
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('aboutID');
      if (idParam) {
        this.aboutID = +idParam; // Convert string to number
        this.getData(this.aboutID);
      } else {
        console.error('About ID not found in route parameters');
      }
    });

    this.applyForm = new FormGroup({
      aboutText: new FormControl(null, Validators.required),
      aboutImg: new FormControl(null, Validators.required),
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

  // loadPortfolio(): void {
  //   this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
  //     (response: any) => {
  //       if (response && response.project) {
  //         this.studentPortfolio = response;
  //         console.log('View Portfolio details:', response);
  //       } else {
  //         console.error('Unexpected response structure:', response);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error loading portfolio:', error);
  //     }
  //   );
  // }

  getData(aboutID: any): void {
    this.ds.getRequestWithParams("get-about", { aboutID: aboutID }).subscribe(
      (response: any) => {
        if (response && response.about) {
          this.aboutData = response.about;
          console.log('AboutData', response);

          // Initialize the form with the fetched project data
          this.applyForm.patchValue({
            aboutText: this.aboutData.aboutText,
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
    this.formData.append('aboutText', this.applyForm.value.aboutText);
    this.formData.append('aboutID', this.aboutID);
    this.formData.append('aboutImg', this.selectedFile);

    this.ds.sendRequestWithMedia('edit-about', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        alert("Updated Successfully!");
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToAboutme() {
    this.route.navigate([`../../aboutme`], { relativeTo: this.aRoute });
  }
}