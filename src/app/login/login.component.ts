import { Component, inject } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';

export interface Status {
  status: {
    message: string;
  };
  // Other properties if exist
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  response: any;
  message: any;
Error: any;
test:any;
userDetails: any;
studentList: any = [];
  cookieService = inject(CookieService);
  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    
      this.userDetails = JSON.parse(this.cookieService.get('user_details'));

      this.ds.getRequest("get-all-students").subscribe(
        (response: any) => {
          this.studentList = response;  
          console.log('User details:', response);
        },
        (error) => {
          console.error('Error submitting application:', error);
        }
      )

    }

  applyForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
    Login() {
      this.ds.sendRequestWitoutMedia('login', this.applyForm.value).subscribe(
        (response: any) => {
          // this.ds.setUserData(response.payload);
          this.Error = response.status.message;
          console.log(response.status.message);
          console.log(response.payload);
          // console.log(response.payload.address);
          console.log('Application submitted successfully:', response);
          if (response.status.message == 'Login successful.') {
            this.cookieService.set("user_details", JSON.stringify(response.payload));        
             this.route.navigateByUrl('/portfolio');
            console.log(this.applyForm);
          }
        },
        (error) => {
          // Handle error response here if needed
          console.log(this.response.status.message);
          console.error('Error submitting application:', error);
        }
      );
    }
  }
