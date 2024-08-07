import { Component, OnInit, inject, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SidenavComponent,
    TopnavComponent,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatRowDef,
    MatHeaderRowDef,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [CookieService],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  selectedskillTitle: string = "";
  selectedskillDesc: string = "";
  selectedskillID: any;
  studentPortfolio: any = {};
  templateID: any = {};
  viewedPortfolioIds: string[] = [];

  baseAPI: string = 'http://localhost/unfold/unfold-api/';

  displayedColumns: string[] = ['skillTitle', 'skillDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      skillTitle: new FormControl(null, Validators.required),
      skillDesc: new FormControl(null, Validators.required),
    });

    this.loadAccomplishment();

    this.ds.getRequestWithParams('view-portfolio', { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
      },
      (error) => {
        console.error('Error retrieving portfolio:', error);
      }
    );

    const viewedPortfolioCookie = this.cookieService.get('viewed_portfolios');
    this.viewedPortfolioIds = viewedPortfolioCookie ? JSON.parse(viewedPortfolioCookie) : [];
  }
  isDropdownVisible = false;

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isDropdownVisible) {
      this.isDropdownVisible = false;
    }
  }

  loadAccomplishment(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.accomplishment) {
          this.studentPortfolio = response;
       
          console.log('View Accomplishment details:', response);
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

  ViewPortfolio(e: any, studentID: string) {
    e.preventDefault();
  
    
    const redirectToPortfolio = (templateID: any) => {
      if (templateID === "2") {
        this.route.navigateByUrl(`template/${studentID}`);
      }else if(templateID === "3"){
        this.route.navigateByUrl(`changetemplate/${studentID}`);
      }
       else {
        this.route.navigateByUrl(`viewport/${studentID}`);
      }
    };
  
    this.ds.getRequestWithParams("get-template", { id: studentID }).subscribe(
      (response: any) => {
        this.templateID = response.templateID;
        console.log('Template ID:', this.templateID);
  
        // Check if the portfolio is already viewed
        if (this.viewedPortfolioIds.includes(studentID)) {
          console.log('Portfolio already viewed in this session');
          // Redirect to the portfolio without adding a view
          redirectToPortfolio(this.templateID);
        } else {
          // Add views after fetching the template ID
          this.ds.addViews(studentID).subscribe(
            (response) => {
              console.log('Views added successfully:', response);
  
              // Update viewedPortfolioIds and store in cookie
              this.viewedPortfolioIds.push(studentID);
              this.cookieService.set('viewed_portfolios', JSON.stringify(this.viewedPortfolioIds));
  
              // Redirect to the portfolio
              redirectToPortfolio(this.templateID);
            },
            (error) => {
              console.error('Error adding views:', error);
              if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                this.route.navigateByUrl('/login');
              } else {
                // Redirect to the portfolio even if there was an error adding views
                redirectToPortfolio(this.templateID);
              }
            }
          );
        }
      },
      (error) => {
        console.error('Error retrieving template:', error);
      }
    );
  }

  Insert() {
    this.formData.append('skillTitle', this.applyForm.value.skillTitle);
    this.formData.append('skillDesc', this.applyForm.value.skillDesc);
    this.formData.append('studentID', this.userDetails.studentID);

    this.ds.sendRequestWithoutMedia('addskill', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        this.loadAccomplishment();
      },
      (error) => {
        console.error('Error submitting accomplishment:', error);
      }
    );
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
        this.loadAccomplishment(); // Reload the skills to reflect changes
      },
      (error) => {
        console.error('Error editing skill:', error);
      }
    );
  }

deleteSkill(accomplishmentId: number): void {

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.ds.deleteSkill(accomplishmentId).subscribe(
        (response) => {
            console.log('Accomplishment deleted successfully:', response);
            // Reload the portfolio to reflect changes
            this.loadAccomplishment();
            Swal.fire({
              title: "Deleted Successfully",
              icon: "success"
            });
        },
        (error) => {
            console.error('Error deleting accomplishment:', error);
            if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                this.route.navigateByUrl('/login'); // Or your login route
            }
        }
    );

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });
  
     
  
}

  routeToCreateSkill() {
    this.route.navigate(['../createskill'], { relativeTo: this.aRoute });
  }

  routeToEditSkill(skillID: any) {
    this.route.navigate([`../editskill/${skillID}`], { relativeTo: this.aRoute });
  }
  
routeToEditProfile(studentID: any) {
  this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
}
}
