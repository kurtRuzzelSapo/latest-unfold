import { Component, OnInit, inject, HostListener } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-design',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent implements OnInit {
  selectedCard: string = '';  // Provide a default value
  selectedFile: any;
  cookieService = inject(CookieService);
  formData: any;
  applyForm!: FormGroup;
  userDetails: any;
  studentPortfolio: any = {};
  selectedProjectTitle: string = '';
  selectedProjectDesc: string = '';
  selectedProjectImg: string = '';
  selectedprojectID: any;
  templateID: any = {};
  viewedPortfolioIds: string[] = [];
  baseAPI: string = 'http://localhost/unfold/unfold-api/';

  constructor(private ds: DataService, private route: Router, private aRoute: ActivatedRoute) {
    this.selectedCard = '1';
  }

  selectCard(cardType: string): void {
    this.selectedCard = cardType;
    this.applyForm.patchValue({ templateID: cardType });
  }

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      templateID: new FormControl(null, Validators.required),
    });

    this.loadPortfolio();

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
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

    this.ds.getRequestWithParams("get-template", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.templateID = response.templateID;
        this.selectedCard = this.templateID;
        this.applyForm.patchValue({ templateID: this.templateID });
      },
      (error) => {
        console.error('Error retrieving template:', error);
      }
    );

    
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

  changeTemplate() {
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('templateID', this.selectedCard);

    this.ds.sendRequestWithoutMedia('change-template', this.formData).subscribe(
      (response) => {
        console.log('Template changed successfully:', response);
        Swal.fire({
          title: "Template Changed Successfully",
          icon: "success",
          confirmButtonText: "View Portfolio",
          cancelButtonText: "Save",
          cancelButtonColor: "green",
          confirmButtonColor: "#ee8d59",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.ViewPortfolio(this.userDetails.studentID);
          }
        });
      },
      (error) => {
        console.error('Error changing template:', error);
      }
    );
  }

  ViewPortfolio(studentID: string) {
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

        if (this.viewedPortfolioIds.includes(studentID)) {
          console.log('Portfolio already viewed in this session');
          redirectToPortfolio(this.templateID);
        } else {
          this.ds.addViews(studentID).subscribe(
            (response) => {
              console.log('Views added successfully:', response);

              this.viewedPortfolioIds.push(studentID);
              this.cookieService.set('viewed_portfolios', JSON.stringify(this.viewedPortfolioIds));

              redirectToPortfolio(this.templateID);
            },
            (error) => {
              console.error('Error adding views:', error);
              if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                this.route.navigateByUrl('/login');
              } else {
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

  cancel() {
    this.route.navigate(['/Home']); // Change the route as per your application's requirement
  }

  routeToEditProfile(studentID: any) {
    this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
}
