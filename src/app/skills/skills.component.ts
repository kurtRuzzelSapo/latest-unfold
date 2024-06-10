declare var $: any;

import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ReactiveFormsModule,SidenavComponent,TopnavComponent, CommonModule, MatTableModule, MatIconModule,
    MatRowDef, MatHeaderRowDef, RouterLink,RouterLinkActive],
  providers: [CookieService],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})

export class SkillsComponent implements OnInit{
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  selectedskillTitle: string = "";
  selectedskillDesc: string = "";
  selectedskillID: any;
  studentPortfolio: any = {};

   // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'

  displayedColumns: string[] = ['skillTitle', 'skillDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService, private route: Router, private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {
    this.formData = new FormData();


    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      skillTitle: new FormControl(null, Validators.required),
      skillDesc: new FormControl(null, Validators.required),
      // skillID: new FormControl(null)
    });

    this.loadSkill();

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
          if (response && response.skill) { // Adjusted the key to 'skill'
            const skills = response.skill; // Accessing skills data using the correct key
            if (Array.isArray(skills)) {
              this.populateSkillTable(skills);
              console.log('View Skill details:', skills);
              console.log("Checking:", this.studentPortfolio); // Added for consistency with portfolio.ts
            } else {
              console.error('Skills data is not an array:', skills);
            }
          } else {
            console.error('Unexpected response structure, missing skills:', response);
          }
        },
        (error) => {
          console.error('Error loading skills:', error);
        }
      );
    }


    populateSkillTable(skills: any[]): void {
      this.dataSource.data = skills.map(skill => ({
        skillTitle: skill.skillTitle,
        skillDesc: skill.skillDesc,
        skillID: skill.skillID
      }));
    }



  // applyForm = new FormGroup ({
    // skillTitle: new FormControl(null, Validators.required),
    // skillDesc: new FormControl(null, Validators.required)
  // })

  Insert() {
    this.formData.append('skillTitle', this.applyForm.value.skillTitle);
    this.formData.append('skillDesc', this.applyForm.value.skillDesc);
    this.formData.append('studentID', this.userDetails.studentID);
    skillID: new FormControl(null)

    this.ds.sendRequestWithoutMedia('addskill', this.formData).subscribe(
      (response) => {
        // Handle successful response here if needed
        console.log('Application submitted successfully:', response);
        this.loadSkill()
        this.closePopup();
        $('#successModal').modal('show');
      },
      (error) => {
        console.error('Error submitting accomplishment:', error);
      }
    );
  }
  closeSuccessModal(): void {
    $('#successModal').modal('hide');
  }

  edit() {
    const skillID = this.selectedskillID;
    const formData = new FormData();

    formData.append('skillID', skillID);
    formData.append('skillTitle', this.applyForm.value.skillTitle);
    formData.append('skillDesc', this.applyForm.value.skillDesc);
    formData.append('studentId', this.userDetails.studentID);

    this.ds.sendRequestWithoutMedia('editskill', formData).subscribe(
      (response) => {
        console.log('Skill edited successfully:', response);
        this.loadSkill(); // Reload the skills to reflect changes
      },
      (error) => {
        console.error('Error editing skill:', error);
      }
    );
}


  openModalpopup(){
    this.applyForm.reset();
    $('#exampleModalCenter').modal('show')
  }

  closePopup(){
    $('#exampleModalCenter').modal('hide')
  }


  editOpenModalPopup(skillTitle: string, skillDesc: string, skillID: any) {
    const skills = this.dataSource.data.find((s: any) => s.skillID === skillID);
    if (skills) {
      this.selectedskillTitle = skills.skillTitle;
      this.selectedskillDesc = skills.skillDesc;
      this.selectedskillID = skills.skillID;

      this.applyForm.patchValue({
        skillID: skills.skillID,
        skillTitle: skills.skillTitle,
        skillDesc: skills.skillDesc
      });

      console.log('Received data:', {
        skillTitle: skillTitle,
        skillDesc: skillDesc,
        skillID: skillID
      });
      $('#editModalCenter').modal('show');
    } else {
      console.error('Skill not found with ID:', skillID);
    }
  }

  editclosePopup() {
    $('#editModalCenter').modal('hide');
  }
  deleteSkill(skillId: number): void {
    if (confirm("Are you sure you want to delete this skill?")) {
        this.ds.deleteSkill(skillId).subscribe(
            (response) => {
                console.log('Skill deleted successfully:', response);
                this.loadSkill(); // Reload the portfolio to reflect changes
            },
            (error) => {
                console.error('Error deleting skill:', error);
            }
        );
    }
}

routeToCreateSkill(){
  // this.route.navigateByUrl('../createportfolio');
  this.route.navigate([`/createskill`], { relativeTo: this.aRoute });
}

}
