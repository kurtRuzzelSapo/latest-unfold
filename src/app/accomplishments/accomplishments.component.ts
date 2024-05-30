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
import { HttpHeaders } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accomplishments',
  standalone: true,
  imports: [ReactiveFormsModule, SidenavComponent, TopnavComponent, MatTableModule, MatIconModule, CommonModule],
  providers: [CookieService],
  templateUrl: './accomplishments.component.html',
  styleUrl: './accomplishments.component.css',
})
export class AccomplishmentsComponent implements OnInit {
  selectedFile: any;
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  studentAccomplishment: any ={};
  selectedAccomplishmentTitle: string = '';
  selectedAccomplishmentDesc: string = '';
  selectedAccomplishmentImg: string = '';
  selectedAccomplishmentId: any;
  baseAPI: string = 'https://unfoldap.online/unfold-api'

  displayedColumns: string[] = ['accomImg', 'accomTitle', 'accomDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();

    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      accomTitle: new FormControl(null, Validators.required),
      accomDesc: new FormControl(null, Validators.required),
      accomImg: new FormControl(null, Validators.required),
      accomID: new FormControl(null, Validators.required),
    });

    this.loadAccomplishment();
  }


  loadAccomplishment(): void {
    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        if (response && response.accomplishment) {
          this.populateAccomplishmentTable(response.accomplishment);
          console.log('View Accomplishment details:', response.accomplishment);
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      (error) => {
        console.error('Error loading accomplishment:', error);
      }
    );
  }

  populateAccomplishmentTable(accomplishments: any[]): void {
    this.dataSource.data = accomplishments.map(accomplishment => {
      const imageURL = `${this.baseAPI}${accomplishment.accomImg}`;
      console.log('Image URL:', imageURL);
      return {
      accomImg: imageURL,
      accomTitle: accomplishment.accomTitle,
      accomDesc: accomplishment.accomDesc,
      accomID: accomplishment.accomID,
      }
    });
  }


onFileSelected(event: any) {
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
  }
}

Insert() {
  this.formData.append('accomTitle', this.applyForm.value.accomTitle);
  this.formData.append('accomDesc', this.applyForm.value.accomDesc);
  this.formData.append('studentID', this.userDetails.studentID);
  this.formData.append('accomImg', this.selectedFile);
  this.ds
    .sendRequestWithMedia('addaccomplishment', this.formData)
    .subscribe(
      (response) => {
        // Handle successful response here if needed
        console.log('Application submitted successfully:', response);
        this.route.navigateByUrl('/accomplishments');
        this.loadAccomplishment();
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
  const accomplishmentId = this.selectedAccomplishmentId;
  const formData = new FormData();

  formData.append('accomID', accomplishmentId);
  formData.append('accomTitle', this.applyForm.value.accomTitle);
  formData.append('accomDesc', this.applyForm.value.accomDesc);
  formData.append('studentID', this.userDetails.studentID);
  formData.append('accomImg', this.selectedFile);

  this.ds.sendRequestWithMedia('editaccomplishment', formData).subscribe(
    (response) => {
      console.log('Accomplishment edited successfully:', response);
      console.log(this.applyForm);
      this.loadAccomplishment(); // Reload the accomplishments to reflect changes
    },
    (error) => {
      console.error('Error editing accomplishment:', error);
    }
  );
}


// editopenModalpopup(accomplishmentTitle: string, accomplishmentDesc: string, accomplishmentImg: string, accomplishmentId:any) {
//   this.selectedAccomplishmentTitle = accomplishmentTitle;
//   this.selectedAccomplishmentDesc = accomplishmentDesc;
//   this.selectedAccomplishmentImg = accomplishmentImg;
//   this.selectedAccomplishmentId = accomplishmentId;
//   $('#editModalCenter').modal('show');
//   // You can also perform other actions related to opening the modal popup here
// }

editopenModalpopup(accomTitle: string, accomDesc: string, accomImg: string, accomID: any) {
  const accomplishment = this.dataSource.data.find((a: any) => a.accomID === accomID);
  if (accomplishment) {
    this.selectedAccomplishmentTitle = accomplishment.accomTitle;
    this.selectedAccomplishmentDesc = accomplishment.accomDesc;
    this.selectedAccomplishmentImg = accomplishment.accomImg;
    this.selectedAccomplishmentId = accomplishment.accomID;

    this.applyForm.patchValue({
      accomTitle: accomplishment.accomTitle,
      accomDesc: accomplishment.accomDesc,
      accomImg: null
    });

    console.log('Received data:', {
      accomTitle: accomTitle,
      accomDesc: accomDesc,
      accomImg: accomImg,
      accomID: accomID
    });
    $('#editModalCenter').modal('show');
  } else {
    console.error('Accomplishment not found with ID:', accomID);
  }
}

editclosePopup() {
  $('#editModalCenter').modal('hide');
}
  openModalpopup() {
    this.applyForm.reset();
    $('#exampleModalCenter').modal('show');
  }

  closePopup() {
    $('#exampleModalCenter').modal('hide');
  }

  deleteAccomplishment(accomplishmentId: number): void {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
        this.ds.deleteAccomplishment(accomplishmentId).subscribe(
            (response) => {
                console.log('Accomplishment deleted successfully:', response);
                this.loadAccomplishment(); // Reload the portfolio to reflect changes
            },
            (error) => {
                console.error('Error deleting accomplishment:', error);
            }
        );
    }
}

}

