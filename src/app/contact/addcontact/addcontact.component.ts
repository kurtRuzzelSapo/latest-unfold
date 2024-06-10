// import { Component, OnInit, inject } from '@angular/core';
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { DataService } from '../../data.service';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'app-addcontact',
//   standalone: true,
//   imports: [RouterLink, CommonModule, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
//   templateUrl: './addcontact.component.html',
//   styleUrl: './addcontact.component.css'
// })
// export class AddcontactComponent {
//   cookieService = inject(CookieService);
//   formData: any;
//   applyForm: any;
//   FormGroup: any;
//   userDetails: any;
//   studentPortfolio: any = {};
//   selectedFile: any;
//     // ONLINE BASEAPI
//   // baseAPI: string = 'https://unfoldap.online/unfold-api';
//   // LOCALHOST BASEAPI
//   baseAPI:string = 'http://localhost/unfold/unfold-api/'
//   constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}


//   ngOnInit(): void {
//     this.formData = new FormData();
//     this.userDetails = JSON.parse(this.cookieService.get('user_details'));

//     this.applyForm = new FormGroup({
//       contName: new FormControl(null, Validators.required),
//       contEmail: new FormControl(null, Validators.required),
//       contFB: new FormControl(null, Validators.required),
//       contIG: new FormControl(null, Validators.required),
//       contLinkedin: new FormControl(null, Validators.required),
//       contGithub: new FormControl(null, Validators.required),
//     });
//     // this.applyForm = new FormGroup({
//     //   contName: new FormControl('', Validators.required),
//     //   contEmail: new FormControl('', [Validators.required, Validators.email]),
//     //   contFB: new FormControl('', Validators.required),
//     //   contIG: new FormControl('', Validators.required),
//     //   contLinkedin: new FormControl('', Validators.required),
//     //   contGithub: new FormControl('', Validators.required),
//     // });
    
//     this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
//       (response: any) => {
//         this.studentPortfolio = response;
//         console.log('View Portfolio details:', response);
//       },
//       (error) => {
//         console.error('Error retrieving portfolio:', error);
//       }
//     );

//   }

//   loadContact(): void {
//     this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
//       (response: any) => {
//         if (response && response.contact) {
//           this.studentPortfolio = response;
       
//           console.log('View Contact details:', response);
//           console.log("Checking:", this.studentPortfolio);
//         } else {
//           console.error('Unexpected response structure:', response);
//         }
//       },
//       (error) => {
//         console.error('Error loading contact:', error);
//       }
//     );
//   } 

//   // onFileSelected(event: any) {
//   //   if (event.target.files.length > 0) {
//   //     this.selectedFile = event.target.files[0];
//   //   }
//   // }


//   Insert() {
//     this.formData.append('contName', this.applyForm.value.contName);
//     this.formData.append('contEmail', this.applyForm.value.contEmail);
//     this.formData.append('studentID', this.userDetails.studentID);
//     this.formData.append('contFB', this.applyForm.value.contFB);
//     this.formData.append('contIG', this.applyForm.value.contIG);
//     this.formData.append('contLinkedin', this.applyForm.value.contLinkedin);
//     this.formData.append('contGithub', this.applyForm.value.contGithub);
    
 

//     this.ds.sendRequestWithoutMedia('add-contact', this.formData).subscribe(
//       (response) => {
//         console.log('Application submitted successfully:', response);
//         alert("Inserted Successfully!");
//         console.log(this.applyForm);
       
//       },
//       (error) => {
//         console.error('Error submitting application:', error);
//       }
//     );
//   }



//   routeToContact(){
//     // this.route.navigateByUrl('../createportfolio');
//     this.route.navigate([`../contact`], { relativeTo: this.aRoute });
//   }
// }
