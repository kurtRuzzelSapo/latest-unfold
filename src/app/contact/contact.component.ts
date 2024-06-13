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
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,SidenavComponent,TopnavComponent, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  studentPortfolio: any = {};
   // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'
  counts: { projects: number, technologies: number, competitions: number, contacts:number } = { projects: 0, technologies: 0, competitions: 0, contacts: 0 };
  constructor(private ds: DataService, private route: Router, private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      contName: new FormControl(null, Validators.required),
      contEmail: new FormControl(null, Validators.required),
      contFB: new FormControl(null, Validators.required),
      contIG: new FormControl(null, Validators.required),
      contLinkedin: new FormControl(null, Validators.required),
      contGithub: new FormControl(null, Validators.required),
    });

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
        this.updateCounts(response);
      },
      (error) => {
        console.error('Error retrieving portfolio:', error);
      }
    );

  }
  
  loadContact(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.contact) {
          this.studentPortfolio = response;
       
          console.log('View Contact details:', response);
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
    
    // this.formData.append('contName', this.applyForm.contName);
    // this.formData.append('contEmail', this.applyForm.contEmail);
    this.formData.append('contFB', this.applyForm.value.contFB);
    this.formData.append('contIG', this.applyForm.value.contIG);
    this.formData.append('contLinkedin', this.applyForm.value.contLinkedin);
    this.formData.append('contGithub', this.applyForm.value.contGithub);
    this.formData.append('studentID', this.userDetails.studentID);
 

    this.ds.sendRequestWithoutMedia('add-contact', this.formData).subscribe(
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

  updateCounts(data: any): void {
    this.counts.projects = data.project.length;
    this.counts.technologies = data.skill.length;
    this.counts.competitions = data.accomplishment.length;
    this.counts.contacts = data.contacts.length;
  }

  deleteContact(contId: number): void {
  
    this.ds.deleteContact(contId).subscribe(
        (response) => {
            console.log('Accomplishment deleted successfully:', response);
            // Reload the portfolio to reflect changes
            this.loadContact();
        },
        (error) => {
            console.error('Error deleting accomplishment:', error);
            if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                this.route.navigateByUrl('/login'); // Or your login route
            }
        }
    );

}

  routeToAddContact(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`/createcontact`], { relativeTo: this.aRoute });
  }
  routeToEditContact(contID:number){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../editcontact/${contID}`], { relativeTo: this.aRoute });
  }
}
