// import { Component, OnInit, inject } from '@angular/core';
// import { SidenavComponent } from '../sidenav/sidenav.component';
// import { TopnavComponent } from '../topnav/topnav.component';
// import { CookieService } from 'ngx-cookie-service';
// import { DataService } from '../data.service';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// @Component({
//   selector: 'app-viewport',
//   standalone: true,
//   imports: [TopnavComponent, CommonModule,  ReactiveFormsModule, RouterLink],
//   providers: [CookieService],
//   templateUrl: './viewport.component.html',
//   styleUrl: './viewport.component.css'
// })


// export class ViewportComponent {
//   formData:any  
//   userDetails: any;
//  studentImage: any;
//   cookieService = inject(CookieService);
//   studentList: any = [CommonModule];
//   studentID: any;
//   studentPortfolio: any = {};
//   baseAPI:string = 'https://unfoldap.online/unfold-api'
//   // baseAPI:string = 'https://unfoldap.online/unfold-api'
//   // baseAPI:string = 'https://unfoldap.online/unfold-api'
//   // baseAPI:string = 'http://localhost/unfold/unfold-api'
//   constructor(private ds: DataService,private route: ActivatedRoute){}

//   ngOnInit(): void {
//     this.formData = new FormData();
//       this.userDetails = JSON.parse(this.cookieService.get('user_details'));

//       this.ds.getRequest("get-all-students").subscribe(
//         (response: any) => {
//           this.studentList = response;  
//           console.log('User details:', response);
//         },
//         (error) => {
//           console.error('Error submitting application:', error);
//         }
//       )


//       this.route.params.subscribe(params => {
//         // Access parameter values
//         const studentID = params['studentID'];
//         console.log('Student ID:', studentID);

//         this.ds.getRequestWithParams("view-portfolio",{id: studentID}).subscribe(
//           (response: any) => {
//             this.studentPortfolio = response
//             console.log('View Portfolio details:', response);
//             console.log('aboutext', this.studentPortfolio.about.aboutext)
//             console.log('abouimage', this.studentPortfolio.about.aboutext)
//             this.studentImage = `${this.baseAPI}${this.studentPortfolio.about.aboutImg}`;
//           },
//           (error) => {
//             console.error('Error submitting application:', error);
//           }
//         )
//       });

//       // this.ds.getRequest("view-allportfolio").subscribe(
//       //   (response: any) => {
//       //     this.studentPortfolio = response
//       //     console.log("this is about me ",this.studentPortfolio.aboutme)
//       //     console.log('View ALL Portfolio details:', response);
//       //   },
//       //   (error) => {
//       //     console.error('Error submitting application:', error);
//       //   }
//       // )

      
     
//   }
// }
// ===========================
// import { Component, OnInit, inject } from '@angular/core';
// import { SidenavComponent } from '../sidenav/sidenav.component';
// import { TopnavComponent } from '../topnav/topnav.component';
// import { CookieService } from 'ngx-cookie-service';
// import { DataService } from '../data.service';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-viewport',
//   standalone: true,
//   imports: [TopnavComponent, CommonModule,  ReactiveFormsModule, RouterLink],
//   providers: [CookieService],
//   templateUrl: './viewport.component.html',
//   styleUrl: './viewport.component.css'
// })


// export class ViewportComponent {
//   formData:any  
//   userDetails: any;
//  studentImage: any;
//   cookieService = inject(CookieService);
//   studentList: any = [CommonModule];
//   studentPortfolio: any ={};
//   studentID: any;
//   baseAPI:string = 'https://unfoldap.online/unfold-api'
//   constructor(private ds: DataService,private route: ActivatedRoute){}

//   ngOnInit(): void {
//     this.formData = new FormData();
//       this.userDetails = JSON.parse(this.cookieService.get('user_details'));

//       this.ds.getRequest("get-all-students").subscribe(
//         (response: any) => {
//           this.studentList = response;  
//           console.log('User details:', response);
//         },
//         (error) => {
//           console.error('Error submitting application:', error);
//         }
//       )


//       this.route.params.subscribe(params => {
//         // Access parameter values
//         const studentID = params['studentID'];
//         // console.log('Student ID:', studentID);

//         this.ds.getRequestWithParams("view-portfolio",{id: studentID}).subscribe(
//           (response: any) => {
//             this.studentPortfolio = response
//             console.log('View Portfolio details:', response);
//             console.log(this.studentPortfolio.firstName);
//             console.log('About Text:', response.about[0].aboutText);
//             this.studentImage = `${this.baseAPI}${this.studentPortfolio.about.aboutImg}`;
//           },
//           (error) => {
//             console.error('Error submitting application:', error);
//           }
//         )
//       });


      // +++++++++++++++++++++++++
      // this.ds.getRequest("view-allportfolio").subscribe(
      //   (response: any) => {
      //     this.studentPortfolio = response
      //     console.log("this is about me ",this.studentPortfolio.aboutme)
      //     console.log('View ALL Portfolio details:', response);
      //   },
      //   (error) => {
      //     console.error('Error submitting application:', error);
      //   }
      // )

      import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
      import Typed from 'typed.js';
      import ScrollReveal from 'scrollreveal';
      import { CookieService } from 'ngx-cookie-service';
      import { DataService } from '../data.service';
      import { CommonModule } from '@angular/common';
      import { RouterLink } from '@angular/router';
      import { ReactiveFormsModule } from '@angular/forms';
      import { ActivatedRoute } from '@angular/router';
      
      @Component({
        selector: 'app-viewport',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink],
        providers: [CookieService],
        templateUrl: './viewport.component.html',
        styleUrls: ['./viewport.component.css']
      })
      export class ViewportComponent implements OnInit, AfterViewInit {
        formData: any;
        userDetails: any;
        studentImage: any;
        studentList: any = [];
        studentPortfolio: any = {};
        studentID: any;
        counts: { projects: number, technologies: number, competitions: number, contacts: number } = { projects: 0, technologies: 0, competitions: 0, contacts: 0 };
        // baseAPI: string = 'https://unfoldap.online/unfold-api';

         // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
   baseAPI:string = 'http://localhost/unfold/unfold-api/'
      
        constructor(private ds: DataService, private route: ActivatedRoute, private cookieService: CookieService) {}
      
        ngOnInit(): void {
          this.formData = new FormData();
          this.userDetails = JSON.parse(this.cookieService.get('user_details'));
      
          this.ds.getRequest("get-all-students").subscribe(
            (response: any) => {
              this.studentList = response;
              console.log('User details:', response);
            },
            (error) => {
              console.error('Error fetching students:', error);
            }
          );
      
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
          new Typed(".typedText", {
          //  identity:String = this.studentPortfolio.student.firstName,
            strings: ["Student", "Dreamer"],
            // strings: ["Designer", this.studentPortfolio.student.firstName, this.studentPortfolio.about.aboutext],
            loop: true,
            typeSpeed: 100,
            backSpeed: 80,
            backDelay: 4000
          });
        }
      
        initScrollReveal() {
          const sr = ScrollReveal({
            origin: 'top',
            distance: '80px',
            duration: 2000,
            reset: true
          });
      
          sr.reveal('.featured-text-card', {});
          sr.reveal('.featured-name', { delay: 100 });
          sr.reveal('.featured-text-info', { delay: 200 });
          sr.reveal('.featured-text-btn', { delay: 200 });
          sr.reveal('.social_icons', { delay: 200 });
          sr.reveal('.featured-image', { delay: 300 });
      
          sr.reveal('.project-box', { interval: 200 });
          sr.reveal('.top-header', {});
      
          const srLeft = ScrollReveal({
            origin: 'left',
            distance: '80px',
            duration: 2000,
            reset: true
          });
      
          srLeft.reveal('.about-info', { delay: 100 });
          srLeft.reveal('.contact-info', { delay: 100 });
      
          const srRight = ScrollReveal({
            origin: 'right',
            distance: '80px',
            duration: 2000,
            reset: true
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
      }
      

      
     
//   }
// }

