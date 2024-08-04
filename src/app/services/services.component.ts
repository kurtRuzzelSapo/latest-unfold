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
import { CommonModule } from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ReactiveFormsModule,SidenavComponent,TopnavComponent, CommonModule, MatTableModule, MatIconModule,
    MatRowDef, MatHeaderRowDef
  ],
  providers: [CookieService],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent implements OnInit{
  cookieService = inject(CookieService);
  formData: any;
  userDetails: any;
  applyForm: any;
  selectedserviceTitle: string = "";
  selectedserviceDesc: string = "";
  selectedserviceID: any;
  studentPortfolio: any = {};

  baseAPI:string = 'https://unfoldap.online/unfold-api-main'

  displayedColumns: string[] = ['serviceTitle', 'serviceDesc', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();


    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      serviceTitle: new FormControl(null, Validators.required),
      serviceDesc: new FormControl(null, Validators.required),
      // skillID: new FormControl(null)
    });

    this.loadService();
    }
    loadService(): void {
      this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
        (response: any) => {
          if (response && response.service && Array.isArray(response.service)) { // Adjusted the key to 'service' and added an additional check for array
            const services = response.service; // Accessing services data using the correct key
            this.populateServiceTable(services);
            console.log('View Service details:', services);
            console.log("Checking:", this.studentPortfolio); // Added for consistency with portfolio.ts
          } else {
            console.error('Unexpected response structure or missing services:', response);
          }
        },
        (error) => {
          console.error('Error loading services:', error);
        }
      );
    }


    populateServiceTable(services: any[]): void {
      const baseURL = `${this.baseAPI}`; // Adjust this to your server's base URL for images
      this.dataSource.data = services.map(service => ({
        serviceTitle: service.serviceTitle,
        serviceDesc: service.serviceDesc,
        serviceID: service.serviceID
      }));
    }




  // applyForm = new FormGroup ({
    // skillTitle: new FormControl(null, Validators.required),
    // skillDesc: new FormControl(null, Validators.required)
  // })

  Insert() {
    this.formData.append('serviceTitle', this.applyForm.value.serviceTitle);
    this.formData.append('serviceDesc', this.applyForm.value.serviceDesc);
    this.formData.append('studentID', this.userDetails.studentID);
    serviceID: new FormControl(null)

    this.ds.sendRequestWithoutMedia('addservice', this.formData).subscribe(
      (response) => {
        // Handle successful response here if needed
        console.log('Application submitted successfully:', response);
        this.loadService()
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
    const serviceID = this.selectedserviceID;
    const formData = new FormData();

    formData.append('serviceID', serviceID);
    formData.append('serviceTitle', this.applyForm.value.serviceTitle);
    formData.append('serviceDesc', this.applyForm.value.serviceDesc);
    formData.append('studentID', this.userDetails.studentID);

    this.ds.sendRequestWithoutMedia('editservice', formData).subscribe(
      (response) => {
        console.log('Service edited successfully:', response);
        this.loadService(); // Reload the services to reflect changes
      },
      (error) => {
        console.error('Error editing service:', error);
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


  editopenModalpopup(serviceTitle: string, serviceDesc: string, serviceID: any) {
    const service = this.dataSource.data.find((s: any) => s.serviceID === serviceID);
    if (service) {
      this.selectedserviceTitle = service.serviceTitle;
      this.selectedserviceDesc = service.serviceDesc;
      this.selectedserviceID = service.serviceID;

      this.applyForm.patchValue({
        serviceID: service.serviceID,
        serviceTitle: service.serviceTitle,
        serviceDescription: service.serviceDesc
      });

      console.log('Received data:', {
        serviceTitle: serviceTitle,
        serviceDesc: serviceDesc,
        serviceID: serviceID
      });
      $('#editModalCenter').modal('show');
    } else {
      console.error('Service not found with ID:', serviceID);
    }
  }

  editclosePopup() {
    $('#editModalCenter').modal('hide');
  }
  deleteService(serviceId: number): void {
    if (confirm("Are you sure you want to delete this service?")) {
        this.ds.deleteService(serviceId).subscribe(
            (response) => {
                console.log('Service deleted successfully:', response);
                this.loadService(); // Reload the portfolio to reflect changes
            },
            (error) => {
                console.error('Error deleting service:', error);
            }
        );
    }
}

}
