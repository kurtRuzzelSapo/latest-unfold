import { Component, OnInit, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [ CommonModule, RouterLinkActive],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  studentList: any = [];
  topThreeStudents: any[] = [];
  myRanking: number = -1;
  userDetails: any;
  cookieService = inject(CookieService);

  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.ds.getRequest("get-all-students").subscribe(
      (response: any) => {
        this.studentList = response;
        this.processLeaderboard();
      },
      (error) => {
        console.error('Error fetching student details:', error);
      }
    );
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
}
