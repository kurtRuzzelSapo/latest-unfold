import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
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
  selector: 'app-editaccomplishments',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './editaccomplishments.component.html',
  styleUrl: './editaccomplishments.component.css'
})
export class EditaccomplishmentsComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  accomID:any;
  accomData:any
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
      accomTitle: new FormControl('', Validators.required),
      accomLink: new FormControl('', Validators.required),
      accomImg: new FormControl(null, Validators.required),
      accomDate: new FormControl('', Validators.required),
      accomDesc: new FormControl('', Validators.required)
    });
    this.formData = new FormData();
  }


  ngOnInit(): void {

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('accomID');
      if (idParam) {
        this.accomID = +idParam; // Convert string to number
        this.getData(this.accomID);
      } else {
        console.error('Accomplishment ID not found in route parameters');
      }
    });

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

  getData(accomID: any): void {
    this.ds.getRequestWithParams("get-accomplishment", { accomID: accomID }).subscribe(
      (response: any) => {
        if (response && response.competition) { // Ensure it checks the correct property
          this.accomData = response.competition; // Directly access the skill object
          console.log('accomID', response);
          console.log(this.accomData);
          console.log(this.accomData.accomTitle)
          
          // Initialize the form with the fetched skill data
          this.applyForm.patchValue({
                      accomTitle: this.accomData.accomTitle,
                      accomLink: this.accomData.accomLink,
                      accomDate: this.accomData.accomDate,
                      accomDesc: this.accomData.accomDesc,
                    
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
 
    this.formData.append('accomTitle', this.applyForm.value.accomTitle);
    this.formData.append('accomDesc', this.applyForm.value.accomDesc);
    this.formData.append('accomLink', this.applyForm.value.accomLink);
    this.formData.append('accomDate', this.applyForm.value.accomDate);
    this.formData.append('accomID', this.accomID);
    this.formData.append('accomImg', this.selectedFile);

    this.ds.sendRequestWithMedia('edit-accomplishment', this.formData).subscribe(
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

  routeToAccomplishment(){
    // this.route.navigateByUrl('../createaccomplishment');
    this.route.navigate([`../../accomplishments`], { relativeTo: this.aRoute });
  }

}
