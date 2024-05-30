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
import { HttpHeaders } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, CommonModule, MatTableModule, MatIconModule],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.scss',
})
export class AboutmeComponent implements OnInit {
  selectedFile: any;
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  studentList: any = [];
  studentPortfolio: any ={};
  studentAbout: any ={};
  selectedAboutText: string = '';
  selectedAboutImg: string = '';
  selectedAboutId: any;
  baseAPI: string = 'https://unfoldap.online/unfold-api'

  displayedColumns: string[] = ['aboutImg', 'aboutText', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));


    this.applyForm = new FormGroup({
      aboutText: new FormControl(null, Validators.required),
      aboutImg: new FormControl(null, Validators.required),
    });
    this.loadAbout();
    // this.ds.getRequestWithParams("view-portfolio",{id: this.userDetails.studentID}).subscribe(
    //   (response: any) => {
    //     this.studentPortfolio = response
    //     console.log('View Portfolio details:', response);
    //   },
    //   (error) => {
    //     console.error('Error submitting application:', error);
    //   }
    // )
  }

  
  loadAbout(): void {
    this.ds.getRequestWithParams("studentaboutme", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.payload) {
          const aboutme = response.payload;
          if (Array.isArray(aboutme)) { // Check if payload is an array
            this.populateAboutTable(aboutme);
            console.log('View About details:', aboutme);
          } else {
            console.error('Payload does not contain array of about:', aboutme);
          }
        } else {
          console.error('Unexpected response structure, missing payload:', response);
        }
      },
      (error) => {
        console.error('Error loading about:', error);
      }
    );
}
// loadAbout(): void {
//   this.ds.getRequestWithParams('view-portfolio', { id: this.userDetails.studentID }).subscribe(
//     (response: any) => {
//       if (response && response.payload && Array.isArray(response.payload.about)) {
//         this.populateAboutTable(response.payload.about);
//         console.log('View About details:', response.payload.about);
//       } else {
//         console.error('Unexpected response structure:', response);
//       }
//     },
//     (error) => {
//       console.error('Error loading about:', error);
//     }
//   );
// }


populateAboutTable(about: any[]): void {
  const baseURL = 'http://localhost/unfold/unfold-api-main/files/aboutme';
  this.dataSource.data = about.map(about => ({
    aboutImg: `${baseURL}${about.aboutImg}`,
    aboutText: about.aboutText,
    aboutID: about.aboutID
  }));
}
// populateAboutTable(about: any[]): void {
//   this.dataSource.data = about.map(item => {
//     const imageURL = `${this.baseAPI}${item.aboutImg}`;
//     console.log('Image URL:', imageURL);
//     return {
//       aboutImg: imageURL,
//       aboutText: item.aboutText,
//       aboutID: item.aboutID,
//     };
//   });
// }


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  Insert() {

    this.formData.append('aboutText', this.applyForm.value.aboutText);
    this.formData.append('studentID', this.userDetails.studentID);
    this.formData.append('aboutImg', this.selectedFile);

    this.ds
      .sendRequestWithMedia('addaboutme', this.formData)
      .subscribe(
        (response) => {
          // Handle successful response here if needed
          console.log('Application submitted successfully:', response);
          console.log(this.applyForm);
        },
        (error) => {
          // Handle error response here if needed
          console.error('Error submitting application:', error);
        }
      );
  }

  Edit() {
    // Assuming you have access to the aboutId
    const aboutId = this.selectedAboutId; // Update this with the actual variable holding the aboutId
  
    this.formData.append('aboutID', this.applyForm.value.aboutID);
    this.formData.append('aboutText', this.applyForm.value.abouText);
    this.formData.append('aboutID', this.userDetails.studentID);
    this.formData.append('aboutImg', this.selectedFile);
  
    this.ds
      .sendRequestWithMedia('editaboutme', this.formData)
      .subscribe(
        (response) => {
          // Handle successful response here if needed
          console.log('About Me edited successfully:', response);
          console.log(this.applyForm);
        },
        (error) => {
          // Handle error response here if needed
          console.error('Error editing about me:', error);
        }
      );
  }
  
  
  editopenModalpopup( aboutText: string, aboutImg: string, aboutId:any) {
    this.selectedAboutText = aboutText;
    this.selectedAboutImg = aboutImg;
    this.selectedAboutId = aboutId;
    $('#editModalCenter').modal('show');
    // You can also perform other actions related to opening the modal popup here
  }
  
  editclosePopup() {
    $('#editModalCenter').modal('hide');
  }

  openModalpopup() {
    $('#exampleModalCenter').modal('show');
  }

  closePopup() {
    $('#exampleModalCenter').modal('hide');
  }

  openModalpopupbio() {
    $('#exampleModalCenterBio').modal('show');
  }

  closePopupbio() {
    $('#exampleModalCenterBio').modal('hide');
  }
  

  deleteabout(id: string) {
    // Implement the function to delete a about
  }
}
