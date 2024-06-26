import { Component, OnInit, inject, HostListener } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, TopnavComponent, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  providers: [CookieService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  filteredStudents: any = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedFile: any;
  userDetails: any;
  formData: any;
  cookieService = inject(CookieService);
  studentList: any = [];
  facultyList: any = [];
  studentPortfolio: any = {};
  // ONLINE BASEAPI
  // baseAPI: string = 'https://unfoldap.online/unfold-api';
  // LOCALHOST BASEAPI
   baseAPI:string = 'http://localhost/unfold/unfold-api/'
  bsitCount: number = 0;
  bscsCount: number = 0;
  actCount: number = 0;
  bsemcCount: number = 0;
  counts: { projects: number, technologies: number, competitions: number } = { projects: 0, technologies: 0, competitions: 0 };

  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute,) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.ds.getRequest("get-all-students").subscribe(
      (response: any) => {
        this.studentList = response;
        this.countBSITStudents();
        this.filterStudents();
        console.log('User details:', response);
      },
      (error) => {
        console.error('Error retrieving students:', error);
      }
    );

    this.ds.getRequest("get-all-faculty").subscribe(
      (response: any) => {
        this.facultyList = response;
        this.countBSITStudents();
        console.log('Faculty details:', response);
      },
      (error) => {
        console.error('Error retrieving faculty:', error);
      }
    );

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
        this.updateCounts(response);
      
      },
      (error) => {
        console.error('Error retrieving portfolio:', error);
      }
    );

    
  }
  isDropdownVisible = false;

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isDropdownVisible) {
      this.isDropdownVisible = false;
    }
  }
  countBSITStudents(): void {
    this.bsitCount = this.studentList.filter((student: any) => student.course === 'BSIT').length;
    this.bscsCount = this.studentList.filter((student: any) => student.course === 'BSCS').length;
    this.actCount = this.studentList.filter((student: any) => student.course === 'ACT').length;
    this.bsemcCount = this.studentList.filter((student: any) => student.course === 'BSEMC').length;
  }

  updateCounts(data: any): void {
    this.counts.projects = data.project.length;
    this.counts.technologies = data.skill.length;
    this.counts.competitions = data.accomplishment.length;
  }

  editProject(index: number): void {
    const selectedProject = this.studentPortfolio.project[index];
    console.log("Editing project:", selectedProject);
  }

  deleteStudent(data: any): void {
    console.log("click");
    console.log(data);
    const payload = {
      id: data.studentID,
      is_admin: this.userDetails.is_admin
    };

    this.ds.deleteRequest("delete-student", payload).subscribe(
      (response: any) => {
        if (response.status_code === 200) {
          Swal.fire({
            title: "Deleted Successfully",
            icon: "success"
          });
          // alert("Student Deleted Successfully");
          window.location.reload();
         
        }
      },
      (error) => {
        console.error('Error deleting student:', error);
      }
    );
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  filterStudents(): void {
    console.log("Selected category:", this.selectedCategory);
    console.log("Search term:", this.searchTerm);

    this.filteredStudents = this.studentList.filter((student: any) => {
      if (student && student.firstName && student.lastName && student.course && student.address && student.school && student.position) {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const course = student.course.toLowerCase();
        const address = student.address.toLowerCase();
        const school = student.school.toLowerCase();
        const position = student.position.toLowerCase();
        const searchTerm = this.searchTerm.toLowerCase();

        const skillTitles = (student.skills || []).map((skill: any) => skill.toLowerCase());
        const matchesSkills = skillTitles.some((title: string) => title.includes(searchTerm));

        const matchesSearch =
          fullName.includes(searchTerm) ||
          course.includes(searchTerm) ||
          address.includes(searchTerm) ||
          school.includes(searchTerm) ||
          position.includes(searchTerm) ||
          matchesSkills;
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

  routeToEditProfile(studentID: any) {
    this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
  
}