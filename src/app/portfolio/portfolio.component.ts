declare var $: any;

import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, CommonModule, MatTableModule, MatButtonModule,
    MatHeaderRowDef, MatRowDef, MatIconModule
  ],
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
  baseAPI: string = 'https://unfoldap.online/unfold-api'

  displayedColumns: string[] = ['projectImg', 'projectTitle', 'projectDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.formData = new FormData();

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      proTitle: new FormControl(null, Validators.required),
      proDesc: new FormControl(null, Validators.required),
      proImg: new FormControl(null, Validators.required),
      proID: new FormControl(null, Validators.required)
    });

    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.project) {
          this.studentPortfolio = response;
          this.populateProjectTable(response.project);
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

  populateProjectTable(projects: any[]): void {
    this.dataSource.data = projects.map(project => {
      const imageURL = `${this.baseAPI}${project.projectImg}`;
      console.log('Image URL:', imageURL);
      return {
        projectImg: imageURL,
        projectTitle: project.projectTitle,
        projectDesc: project.projectDesc,
        projectID: project.projectID,
      };
    });
  }
  

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  Insert(): void {
    this.formData.append('projectTitle', this.applyForm.value.proTitle);
    this.formData.append('projectDesc', this.applyForm.value.proDesc);
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('projectImg', this.selectedFile);
 
    this.ds
    .sendRequestWithMedia('add-project', this.formData)
    .subscribe(
      (response) => {
        console.log('Project submitted successfully:', response);
        this.loadPortfolio();
        this.closePopup();
        $('#successModal').modal('show');
      },
      (error) => {
        console.error('Error submitting project:', error);
      }
    );
  }
  closeSuccessModal(): void {
    $('#successModal').modal('hide');
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

  openModalpopup() {
    this.applyForm.reset();
    $('#exampleModalCenter').modal('show');
  }

  closePopup() {
    $('#exampleModalCenter').modal('hide');
  }

  editopenModalpopup(projectTitle: string, projectDesc: string, projectImg: string, projectID: any) {
    const project = this.dataSource.data.find((p: any) => p.projectID === projectID);
    if (project) {
      this.selectedProjectTitle = project.projectTitle;
      this.selectedProjectDesc = project.projectDesc;
      this.selectedProjectImg = project.projectImg;
      this.selectedprojectID = project.projectID;

      this.applyForm.patchValue({
        proTitle: project.projectTitle,
        proDesc: project.projectDesc,
        proImg: null,
      });

      console.log('Received data:', {
        projectTitle: projectTitle,
        projectDesc: projectDesc,
        projectImg: projectImg,
        projectID: projectID
      });
      $('#editModalCenter').modal('show');
    } else {
      console.error('Project not found with ID:', projectID);
    }
  }

  editclosePopup() {
    this.selectedprojectID = null;
    $('#editModalCenter').modal('hide');
  }
  

  deleteProject(projectId: number): void {
    if (confirm("Are you sure you want to delete this project?")) {
        this.ds.deleteProject(projectId).subscribe(
            (response) => {
                console.log('Project deleted successfully:', response);
                this.loadPortfolio(); // Reload the portfolio to reflect changes
            },
            (error) => {
                console.error('Error deleting project:', error);
            }
        );
    }
}

}
