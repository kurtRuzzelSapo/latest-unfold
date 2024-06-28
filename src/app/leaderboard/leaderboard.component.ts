import { Component, OnInit, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [ CommonModule, RouterLinkActive, ReactiveFormsModule, FormsModule, RouterLink ],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  studentList: any = [];
  topThreeStudents: any[] = [];
  studentPortfolio: any = {};
  myRanking: number = -1;
  userDetails: any;
  cookieService = inject(CookieService);
  baseAPI: string = 'http://localhost/unfold/unfold-api/';

  constructor(private ds: DataService, private route: Router,  private aRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.ds.getRequest("get-all-students").subscribe(
      (response: any) => {
        this.studentList = response;
        console.log('GET ALL STUDENTS', response);
        this.processLeaderboard();
      },
      (error) => {
        console.error('Error fetching student details:', error);
      }
    );

    this.ds.getRequestWithParams("view-portfolio", { id: this.userDetails.studentID }).subscribe(
      (response: any) => {
        this.studentPortfolio = response;
        console.log('View Portfolio details:', response);
        
      
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

  processLeaderboard(): void {
    // Sort the students by portfolioView in descending order
    const sortedStudents = [...this.studentList].sort((a, b) => b.portfolioView - a.portfolioView);

    // Get the top 3 students
    this.topThreeStudents = sortedStudents.slice(0, 3);

    // Find my ranking
    this.myRanking = sortedStudents.findIndex(student => student.studentID === this.userDetails.studentID) + 1;

    // Update the studentList with the sorted list
    this.studentList = sortedStudents;
    
    console.log('Top 3 Students:', this.topThreeStudents);
    console.log('My Ranking:', this.myRanking);
  }


  ViewPortfolio(e: any, studentID: string) {
    this.ds.addViews(studentID).subscribe(
        (response) => {
            console.log('Accomplishment deleted successfully:', response);
            // Reload the portfolio to reflect changes
        },
        (error) => {
            console.error('Error deleting accomplishment:', error);
            if (error.status === 401) {
                console.warn('Unauthorized access - redirecting to login');
                this.route.navigateByUrl('/login'); // Or your login route
            }
        }
    );
  e.preventDefault();
  this.route.navigateByUrl(`viewport/${studentID}`);
  console.log(studentID);

}

  routeToEditProfile(studentID: any) {
    this.route.navigate([`../editprofile/${studentID}`], { relativeTo: this.aRoute });
  }
}
