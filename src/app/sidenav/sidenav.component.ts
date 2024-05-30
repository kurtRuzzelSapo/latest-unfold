import { Component, OnInit, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  providers: [CookieService],
  templateUrl: 'sidenav.component.html',
  styleUrl: 'sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
  cookieService = inject(CookieService);
  userDetails: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));
  }

  logoutUser(): void {

    this.cookieService.delete("user_details")

    this.router.navigateByUrl('');
  }

}
