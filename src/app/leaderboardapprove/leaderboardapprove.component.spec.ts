import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardapproveComponent } from './leaderboardapprove.component';

describe('LeaderboardapproveComponent', () => {
  let component: LeaderboardapproveComponent;
  let fixture: ComponentFixture<LeaderboardapproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardapproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaderboardapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
