import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectfeedComponent } from './projectfeed.component';

describe('ProjectfeedComponent', () => {
  let component: ProjectfeedComponent;
  let fixture: ComponentFixture<ProjectfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectfeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
