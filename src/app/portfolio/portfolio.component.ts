declare var $: any;

import { Component, OnInit, inject, HostListener } from '@angular/core';
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
import Swal from 'sweetalert2';




@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, CommonModule, MatTableModule, MatButtonModule,
    MatHeaderRowDef, MatRowDef, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive],
    providers: [CookieService],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  selectedFile: any;
  cookieService = inject(CookieService);
  formData: any;
  applyForm: any;
  userDetails: any;
  studentPortfolio: any = {};
  selectedProjectTitle: string = '';
  selectedProjectDesc: string = '';
  selectedProjectImg: string = '';
  selectedprojectID: any;
  templateID: any = {};
  viewedPortfolioIds: string[] = [];
  // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI:string = 'http://localhost/unfold/unfold-api/'

  displayedColumns: string[] = ['projectImg', 'projectTitle', 'projectDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      proTitle: new FormControl(null, Validators.required),
      proDesc: new FormControl(null, Validators.required),
      proImg: new FormControl(null, Validators.required),
    });

    this.loadPortfolio();

    // this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
    //   (response: any) => {
    //     this.studentPortfolio = response;
    //     console.log('View Portfolio details:', response);
    //   },
    //   (error) => {
    //     console.error('Error retrieving portfolio:', error);
    //   }
    // );
    // this.loadPortfolio();

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
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('projectImg', this.selectedFile);

    this.ds.sendRequestWithMedia('add-project', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        console.log(this.applyForm);
        this.route.navigateByUrl('/portfolio');
        this.route.navigateByUrl('../../portfolio');
        this.loadPortfolio(); // Reload the portfolio to reflect new project

      },
      (error) => {
        console.error('Error submitting application:', error);
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

  // Edit() {
  //   const projectId = this.selectedprojectID;
  //   const formData = new FormData();

  //   formData.append('projectID', projectId);
  //   formData.append('projectTitle', this.applyForm.value.proTitle);
  //   formData.append('projectDesc', this.applyForm.value.proDesc);
  //   formData.append('studentID', this.userDetails.studentID);
  //   formData.append('projectImg', this.selectedFile);

  //   this.ds.sendRequestWithMedia('edit-project', formData).subscribe(
  //     (response) => {
  //       console.log('Project edited successfully:', response);
  //       console.log(this.applyForm);
  //       this.loadPortfolio(); // Reload the portfolio to reflect changes
  //     },
  //     (error) => {
  //       console.error('Error editing project:', error);
  //     }
  //   );
  // }

  // deleteProject(id: string) {
  //   if (confirm("Are you sure you want to delete this project?")) {
  //     this.ds.sendRequestWitoutMedia('deleteproject', { projectID: id }).subscribe(
  //       (response) => {
  //         console.log('Project deleted successfully:', response);
  //         this.loadPortfolio(); // Reload the portfolio after deletion
  //       },
  //       (error) => {
  //         console.error('Error deleting project:', error);
  //       }
  //     );
  //   }
  // }

  // deleteProject(id: string): void {
  //   if (confirm('Are you sure you want to delete this project?')) {
  //     this.ds.sendRequestWitoutMedia('deleteproject', { projectID: id }).subscribe(
  //       (response) => {
  //         console.log('Project deleted successfully:', response);
  //         this.loadPortfolio(); // Reload the portfolio after deletion
  //       },
  //       (error) => {
  //         console.error('Error deleting project:', error);
  //       }
  //     );
  //   }
  // }

// Delete(projectID: any): void{
//   this.ds.sendRequestWithMedia('delete-project', {projectID: projectID}).subscribe(
//     (response) => {
//       console.log('Project delete successfully:', response);
//       alert("Deleted Successfully!");
//       this.loadPortfolio(); // Reload the portfolio to reflect changes
//     },
//     (error) => {
//       console.error('Error editing project:', error);
//     }
//   );

// }

// Delete(studentPortfolio: any): void {
//   const projectID = studentPortfolio.projectID;
//   console.log('Project ID:', projectID);
  
//   this.ds.sendRequestWithMedia('delete-project', { projectID: projectID }).subscribe(
//     (response) => {
//       console.log('Project deleted successfully:', response);
//       alert("Deleted Successfully!");
//       this.loadPortfolio(); // Reload the portfolio to reflect changes
//     },
//     (error) => {
//       console.error('Error deleting project:', error);
//     }
//   );
// }

// Delete(data: any): void {
//   console.log("click");
//   console.log(data.projectID);
//   const payload = {
//     id: data.projectID,
    
//   };

//   this.ds.deleteRequest("delete-project", payload).subscribe(
//     (response: any) => {
//       if (response.status_code === 200) {
//         alert("Student Deleted Successfully");
//         this.route.navigateByUrl('/portfolio');
//         this.loadPortfolio();
//       }
//     },
//     (error) => {
//       console.error('Error deleting student:', error);
//     }
//   );
// }

deleteProject(projectId: number): void {

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

      this.ds.deleteProject(projectId).subscribe(
        (response) => {
            console.log('Accomplishment deleted successfully:', response);
            // Reload the portfolio to reflect changes
            this.loadPortfolio();
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
        text: "Your Project has been deleted.",
        icon: "success"
      });
    }
  });
  
  

}

  
  routeToCreatePorfolio(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../createportfolio`], { relativeTo: this.aRoute });
  }

  routeToEditPorfolio(projectID:any){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../editportfolio/${projectID}`], { relativeTo: this.aRoute });
  }
  routeToEditProfile(studentID: any) {
    this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
  
}
