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

@Component({
  selector: 'app-design',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent {
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
        this.loadPortfolio(); // Reload the portfolio to reflect new project
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  Edit() {
    const projectId = this.selectedprojectID;
    const formData = new FormData();

    formData.append('projectID', projectId);
    formData.append('projectTitle', this.applyForm.value.proTitle);
    formData.append('projectDesc', this.applyForm.value.proDesc);
    formData.append('studentID', this.userDetails.studentID);
    formData.append('projectImg', this.selectedFile);

    this.ds.sendRequestWithMedia('edit-project', formData).subscribe(
      (response) => {
        console.log('Project edited successfully:', response);
        console.log(this.applyForm);
        this.loadPortfolio(); // Reload the portfolio to reflect changes
      },
      (error) => {
        console.error('Error editing project:', error);
      }
    );
  }

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

  deleteProject(id: string): void {
    console.log('Deleting project with ID:', id); // Log the project ID for debugging
    if (confirm('Are you sure you want to delete this project?')) {
      const payload = { projectID: id };
      console.log('Payload being sent:', payload); // Log the payload for debugging
      this.ds.deleteRequest('deleteproject', payload).subscribe(
        (response) => {
          console.log('Project deleted successfully:', response);
          this.loadPortfolio(); // Reload the portfolio after deletion
        },
        (error) => {
          console.error('Error deleting project:', error);
        }
      );
    }
  }
  
  routeToCreatePorfolio(){
    // this.route.navigateByUrl('../createportfolio');
    this.route.navigate([`../createportfolio`], { relativeTo: this.aRoute });
  }
  
routeToEditProfile(studentID: any) {
  this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
}

}
