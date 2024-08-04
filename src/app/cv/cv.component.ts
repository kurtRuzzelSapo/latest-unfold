declare var $: any;

import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//import { Component, OnInit, inject, AfterViewInit, HostListener } from '@angular/core';
//import { SidenavComponent } from '../sidenav/sidenav.component';
//import { TopnavComponent } from '../topnav/topnav.component';
//import { CookieService } from 'ngx-cookie-service';
//import { DataService } from '../data.service';
//import { CommonModule } from '@angular/common';
//import { Router, RouterLink, RouterLinkActive } from '@angular/router';
//import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Typed from 'typed.js';
import ScrollReveal from 'scrollreveal';
//import { DataService } from '../data.service';
//import { ActivatedRoute, Router } from '@angular/router';
//import { CookieService } from 'ngx-cookie-service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, CommonModule, MatTableModule, MatButtonModule,
  MatHeaderRowDef, MatRowDef, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [CookieService],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit{
  [x: string]: any;
ViewPortfolio($event: MouseEvent,arg1: any) {
throw new Error('Method not implemented.');
}
  studentID: any; 
  modalOpen: boolean = false;
  studentList: any = [];
  studentPortfolio: any = {};
  userDetails: any;
  // baseAPI: any;
  formData: any;
  applyForm: any;
  selectedProjectTitle: string = '';
  selectedProjectDesc: string = '';
  selectedprojectID: any;
  selectedskillTitle: string = "";
  selectedskillDesc: string = "";
  selectedskillID: any;
  selectedAccomplishmentId: any;
  selectedAccomplishmentTitle: string = '';
  selectedAccomplishmentDesc: string = '';
   baseAPI:string = 'http://localhost/unfold/unfold-api/';
   templateID: any = {};
   viewedPortfolioIds: string[] = [];

  filteredStudents: any = [];

  displayedColumns: string[] = ['projectTitle', 'projectDesc', 'skillTitle', 'skillDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();


  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute) {}
  

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({

      accomTitle: new FormControl(null, Validators.required),
      accomDesc: new FormControl(null, Validators.required),
      skillTitle: new FormControl(null, Validators.required),
      skillDesc: new FormControl(null, Validators.required),
      proTitle: new FormControl(null, Validators.required),
      proDesc: new FormControl(null, Validators.required),

      
    });

    this.ds.getRequest('get-all-students').subscribe(
      (response: any) => {
        this.studentList = response;
        this.filteredStudents = response;
        console.log('User details:', response);
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );

    this.ds.getRequest('view-allportfolio').subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View ALL Portfolio details:', response);
      },
      (error) => {
        console.error('Error fetching portfolio:', error);
      }
    );

    const studentID = this.route.snapshot.params['studentID'];
    if (studentID) {
      this.loadPortfolio(studentID);
    } else {
      console.error('Invalid studentID:', studentID);
      // Handle the error or display a message to the user
    }

        const viewedPortfolioCookie = this.cookieService.get('viewed_portfolios');
    this.viewedPortfolioIds = viewedPortfolioCookie ? JSON.parse(viewedPortfolioCookie) : [];
  }

  
  loadPortfolio(studentID: string): void {
    this.ds.getRequestWithParams('view-portfolio', { id: studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
        console.log(`${this.baseAPI}${this.studentPortfolio.about[0].aboutImg}`);
        console.log(this.studentPortfolio.student.firstName);
        this['updateCounts'](response);
        this['studentImage'] = `${this.baseAPI}${this.studentPortfolio.about[0].aboutImg}`;
      },
      (error) => {
        console.error('Error fetching portfolio:', error);
      }
    );
}

  ngAfterViewInit(): void {
    // Implement any logic that needs to run after view initialization here
  }

  BackPortfolio(e: any, studentID: string) {
    e.preventDefault();

    
    const redirectToPortfolio = (templateID: any) => {
      if (templateID === "2") {
        this.router.navigateByUrl(`template/${studentID}`);
      } else {
        this.router.navigateByUrl(`viewport/${studentID}`);
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
                this.router.navigateByUrl('/login');
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

  downloadCV(event: Event, studentId: string): void {
    console.log('Student ID:', studentId);

    const cvContent = document.getElementById('cv-content');
    if (cvContent) {
      html2canvas(cvContent).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('CV.pdf');
      });
    }
  }


  filterStudents(): void {
    console.log("Selected category:", this['selectedCategory']);
    console.log("Search term:", this['searchTerm']);

    this.filteredStudents = this.studentList.filter((student: any) => {
        // Check if student and its properties exist
        if (student && student.firstName && student.lastName && student.course && student.address && student.school && student.position) {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const course = student.course.toLowerCase();
            const address = student.address.toLowerCase();
            const school = student.school.toLowerCase();
            const position = student.position.toLowerCase();
            const searchTerm = this['searchTerm'].toLowerCase();

            const skillTitles = (student.skills || []).map((skill: any) => skill.toLowerCase());
            const matchesSkills = skillTitles.some((title: string) => title.includes(searchTerm));

            const matchesSearch = fullName.includes(searchTerm) || 
                                  course.includes(searchTerm) || 
                                  address.includes(searchTerm) || 
                                  school.includes(searchTerm) || 
                                  position.includes(searchTerm) || 
                                  matchesSkills;
            const matchesCategory = this['selectedCategory'] ? course === this['selectedCategory'].toLowerCase() : true;

            const matchResult = matchesSearch && matchesCategory;

            if (!matchResult) {
                console.log("Account not shown:", student.firstName, student.lastName);
            }

            return matchResult;
        } else {
            return false;
        }
    });
}

  openModal(): void {
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }
}
