import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import Typed from 'typed.js';
import ScrollReveal from 'scrollreveal';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changetemplate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink , ReactiveFormsModule],
  providers: [CookieService],
  templateUrl: './changetemplate.component.html',
  styleUrls: ['./changetemplate.component.css']
})
export class ChangetemplateComponent implements OnInit, AfterViewInit {
  formData: any;
  fullName:any
  userDetails: any;
  applyForm: any;
  studentImage: any;
  studentList: any = [];
  facultyList: any = [];
  studentPortfolio: any = {};
  studentID: any;
  counts: { projects: number, technologies: number, competitions: number, contacts: number } = { projects: 0, technologies: 0, competitions: 0, contacts: 0 };
  // baseAPI: string = 'https://unfoldap.online/unfold-api';

   // ONLINE BASEAPI
// baseAPI: string = 'https://unfoldap.online/unfold-api';
// LOCALHOST BASEAPI
baseAPI:string = 'http://localhost/unfold/unfold-api/'

  constructor(private ds: DataService, private route: ActivatedRoute, private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

      // Redirect to default path if not logged in
// if (!this.userDetails || this.userDetails.is_admin === 0) {
//   this.router.navigate(['/']);
//   return;
// }

    this.applyForm = new FormGroup({
      testDesc: new FormControl(null, Validators.required),
    });

    this.ds.getRequest("get-all-students").subscribe(
      (response: any) => {
        this.studentList = response;
        console.log('User details:', response);
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );

    this.ds.getRequest("get-all-faculty").subscribe(
      (response: any) => {
        this.facultyList = response;
       
        console.log('Faculty details:', response);
      },
      (error) => {
        console.error('Error retrieving faculty:', error);
      }
    );

    this.route.params.subscribe(params => {
      const studentID = params['studentID'];

      this.ds.getRequestWithParams("view-portfolio", { id: studentID }).subscribe(
        (response: any) => {
          this.studentPortfolio = response;
          console.log('View Portfolio detailssss:', this.studentPortfolio);

          console.log(this.studentPortfolio.student.firstName)
          console.log(this.studentPortfolio.accomplishments.accomTitle)
          this.updateCounts(response);
          this.studentImage = `${this.baseAPI}${this.studentPortfolio.about[0].aboutImg}`;
        },
        (error) => {
          console.error('Error fetching portfolio:', error);
        }
      );
    });
  }
  updateCounts(data: any): void {
    this.counts.projects = data.project.length;
    this.counts.technologies = data.skill.length;
    this.counts.competitions = data.accomplishment.length;
    this.counts.contacts = data.contact.length;
  }

  ngAfterViewInit(): void {
    this.initTyped();
    this.initScrollReveal();
  }

  myMenuFunction() {
    const menuBtn = document.getElementById("myNavMenu");
    if (menuBtn) {
      if (menuBtn.className === "nav-menu") {
        menuBtn.className += " responsive";
      } else {
        menuBtn.className = "nav-menu";
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.headerShadow();
    this.scrollActive();
  }

  headerShadow() {
    const navHeader = document.getElementById("header");
    if (navHeader) {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
        navHeader.style.height = "70px";
        navHeader.style.lineHeight = "70px";
      } else {
        navHeader.style.boxShadow = "none";
        navHeader.style.height = "90px";
        navHeader.style.lineHeight = "90px";
      }
    }
  }

  initTyped() {

    this.route.params.subscribe(params => {
      const studentID = params['studentID'];

      this.ds.getRequestWithParams("view-portfolio", { id: studentID }).subscribe(
        (response: any) => {
          this.studentPortfolio = response;
          console.log('View Portfolio details:', response);
          console.log(this.studentPortfolio.student.firstName)
          this.updateCounts(response);
          this.studentImage = `${this.baseAPI}${this.studentPortfolio.about[0].aboutImg}`;
        },
        (error) => {
          console.error('Error fetching portfolio:', error);
        }
      );
    });


    // this.userDetails = JSON.parse(this.cookieService.get('user_details'));
    this.fullName = this.studentPortfolio.student.firstName + " "+ this.studentPortfolio.student.lastName;
    new Typed(".typedText", {
    //  identity:String = this.studentPortfolio.student.firstName,
      strings: [this.fullName, this.studentPortfolio.student.position],
      // strings: ["Designer", this.studentPortfolio.student.firstName, this.studentPortfolio.about.aboutext],
      loop: true,
      typeSpeed: 100,
      backSpeed: 80,
      backDelay: 1000
    });
  }

  initScrollReveal() {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '80px',
      duration: 2000,
      //INFITITE
      reset: false
    });

    sr.reveal('.featured-text-card', {});
    sr.reveal('.featured-name', { delay: 100 });
    sr.reveal('.featured-text-info', { delay: 200 });
    sr.reveal('.featured-text-btn', { delay: 200 });
    sr.reveal('.social_icons', { delay: 200 });
    sr.reveal('.featured-image', { delay: 300 });

    sr.reveal('.project-box', { interval: 200 });
    sr.reveal('.project-section', { interval: 200 });
    sr.reveal('.top-header', {});

    const srLeft = ScrollReveal({
      origin: 'left',
      distance: '80px',
      duration: 2000,
      reset: false
    });

    srLeft.reveal('.about-info', { delay: 100 });
    srLeft.reveal('.contact-info', { delay: 100 });

    const srRight = ScrollReveal({
      origin: 'right',
      distance: '80px',
      duration: 2000,
      reset: false
    });

    srRight.reveal('.skills-box', { delay: 100 });
    srRight.reveal('.form-control', { delay: 100 });
  }

  scrollActive() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = (current as HTMLElement).offsetHeight;
      const sectionTop = (current as HTMLElement).offsetTop - 50;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.add('active-link');
      } else {
        document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.remove('active-link');
      }
    });
  }

  downloadCV(e: any, studentID: string): void {
    e.preventDefault();
    if (studentID) {
      this.router.navigateByUrl(`cv/${studentID}`);
      console.log(studentID);
    } else {
      console.error('Invalid studentID:', studentID);
      // Handle the error or display a message to the user
    }
  }

  Insert() {
    this.formData.append('testDesc', this.applyForm.value.testDesc);
    this.formData.append('studentID', this.studentPortfolio.student.studentID);
    this.formData.append('testFirstname', this.userDetails.facFirstname);
    this.formData.append('testLastname', this.userDetails.facLastname);
    this.formData.append('testPosition', this.userDetails.facPosition);
    this.formData.append('testImg', this.userDetails.facImg);

    this.ds.sendRequestWithMedia('add-testimony', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Inserted Successfully!");
        Swal.fire({
          title: "Thank you!",
          text: "Your testimony has been submitted.",
          icon: "success"
        });
        console.log(this.applyForm);
        this.applyForm.reset();

        this.formData = new FormData();
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }


  Approved(studentID: string) {
    this.ds.Approved(studentID).subscribe(
        (response) => {
            console.log('Student Approved successfully:', response);
            // alert("You approved a student!")
            Swal.fire({
              title: "You approved a student!",
              icon: "success"
            });
            // Reload the portfolio to reflect changes
        },
        (error) => {
            console.error('Error deleting accomplishment:', error);
            if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                // Or your login route
            }
        }
    );


}

toHome(){
  document.getElementById("homes")?.scrollIntoView()
}
toAbout(){
  document.getElementById("about")?.scrollIntoView()
}
toContacts(){
  document.getElementById("contact")?.scrollIntoView()
}
toProjects(){
  document.getElementById("projects")?.scrollIntoView()
}
toComp(){
  document.getElementById("competitions")?.scrollIntoView()
}
toTest(){
  document.getElementById("testimonies")?.scrollIntoView()
}
}




//   }
// }

