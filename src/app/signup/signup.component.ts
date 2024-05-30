import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private ds: DataService, private route: Router) {}

  applyForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      // Validators.pattern('$'),
    ]),
    sex: new FormControl(null, Validators.required),
    birthdate: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    contacts: new FormControl(null, [Validators.required]),
    course: new FormControl(null, Validators.required),
    school: new FormControl(null, Validators.required),
  });

  get password() {
    return this.applyForm.get('password');
  }

  get email() {
    return this.applyForm.get('email');
  }

  Signup() {
    this.ds.sendRequest('addstudent', this.applyForm.value).subscribe(
      (response) => {
        // Handle successful response here if needed
        console.log('Application submitted successfully:', response);
        console.log(this.applyForm);
        this.route.navigateByUrl('login');
      },
      (error) => {
        // Handle error response here if needed
        console.error('Error submitting application:', error);
      }
    );
  }
}
