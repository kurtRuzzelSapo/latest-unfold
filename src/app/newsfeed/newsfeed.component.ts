import { Component, OnInit, inject, AfterViewInit, HostListener } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Typed from 'typed.js';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [TopnavComponent, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css'
})
export class NewsfeedComponent implements OnInit, AfterViewInit {
  formData: any;
  userDetails: any;
  cookieService = inject(CookieService);
  studentList: any = [];
  filteredStudents: any = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
  baseAPI: string = 'http://localhost/unfold/unfold-api/';

  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.ds.getRequest("get-all-students").subscribe(
      (response: any) => {
        this.studentList = response;
        this.filteredStudents = response;
        console.log('User details:', response);
        this.filterStudents(); // Filter after fetching data
      },
      (error) => {
        console.error('Error fetching student details:', error);
      }
    );
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
      strings: ["Student", "Dreamer", "mama mo"],
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

  ViewPortfolio(e: any, studentID: string) {
    e.preventDefault();
    this.route.navigateByUrl(`viewport/${studentID}`);
    console.log(studentID);
  }

  filterStudents(): void {
    console.log("Selected category:", this.selectedCategory);
    console.log("Search term:", this.searchTerm);

    this.filteredStudents = this.studentList.filter((student: any) => {
      // Check if student and its properties exist
      if (student && student.firstName && student.lastName && student.course && student.address && student.school) {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const course = student.course.toLowerCase();
        const address = student.address.toLowerCase();
        const school = student.school.toLowerCase();
        const searchTerm = this.searchTerm.toLowerCase();

        const skillTitles = (student.skills || []).map((skill: any) => skill.toLowerCase());
        const matchesSkills = skillTitles.some((title: string) => title.includes(searchTerm));

        const matchesSearch = fullName.includes(searchTerm) || course.includes(searchTerm) || address.includes(searchTerm) || school.includes(searchTerm) || matchesSkills;
        const matchesCategory = this.selectedCategory ? course === this.selectedCategory.toLowerCase() : true;

        const matchResult = matchesSearch && matchesCategory;

        if (!matchResult) {
          console.log("Account not shown:", student.firstName, student.lastName);
        }

        return matchResult;
      } else {
        return false;
      }
    });
  }
}
