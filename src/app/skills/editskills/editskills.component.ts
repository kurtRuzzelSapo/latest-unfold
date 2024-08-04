

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
  selector: 'app-editskills',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, RouterLinkActive, RouterOutlet],
  templateUrl: './editskills.component.html',
  styleUrl: './editskills.component.css'
})
export class EditskillsComponent {
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedFile: any;
  skillID:any;
  skillData:any
    // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'
  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {

    this.aRoute.paramMap.subscribe(params => {
      const idParam = params.get('skillID');
      if (idParam) {
        this.skillID = +idParam; // Convert string to number
        this.getData(this.skillID);
      } else {
        console.error('Skill ID not found in route parameters');
      }
    });

    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      skillTitle: new FormControl(null, Validators.required),
      // skillDesc: new FormControl(null, Validators.required),
      skillProf: new FormControl(null, Validators.required),
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



  getData(skillID: any): void {
    this.ds.getRequestWithParams("get-skill", { skillID: skillID }).subscribe(
      (response: any) => {
        if (response && response.skill) { // Ensure it checks the correct property
          this.skillData = response.skill; // Directly access the skill object
          console.log('skillID', response);
          console.log(this.skillData);
          console.log(this.skillData.skillTitle)
          // Initialize the form with the fetched skill data
          this.applyForm.patchValue({
            skillTitle: this.skillData.skillTitle,
            // skillDesc: this.skillData.skillDesc,
            skillProf: this.skillData.skillProf
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
    this.formData.append('skillTitle', this.applyForm.value.skillTitle);
    this.formData.append('skillProf', this.applyForm.value.skillProf);
    // this.formData.append('skillDesc', this.applyForm.value.skillDesc);
    this.formData.append('skillID', this.skillID);

    this.ds.sendRequestWithMedia('edit-skill', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Updated Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: "Edited Successfully",
          icon: "success"
        });
        this.route.navigate(['/skills']);
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }
  

  // getData(skillID: any): void {
  //   this.ds.getRequestWithParams("get-skill", { skillID: skillID }).subscribe(
  //     (response: any) => {
  //       if (response && response.project) {
  //         this.skillData= response;
  //         console.log('skillID', response);
  //         console.log(this.skillData)
  //         // Initialize the form with the fetched project data 
  //         this.applyForm.patchValue({
  //           proTitle: this.skillData.skill.skillTitle,
  //           proDesc: this.skillData.skill.skillDesc
  //         });
  //       } else {
  //         console.error('Unexpected response structure:', response);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error Getting Data:', error);
  //     }
  //   );
  // }

  // onFileSelected(event: any) {
  //   if (event.target.files.length > 0) {
  //     this.selectedFile = event.target.files[0];
  //   }
  // }


  Insert() {
    this.formData.append('skillTitle', this.applyForm.value.skillTitle);
    this.formData.append('skillDesc', this.applyForm.value.skillDesc);
    this.formData.append('studentID', this.userDetails.studentID);
 

    this.ds.sendRequestWithoutMedia('addskill', this.formData).subscribe(
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

  routeToSkill(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../../skills`], { relativeTo: this.aRoute });
  }
}




