import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacSecurityComponent } from './fac-security.component';

describe('FacSecurityComponent', () => {
  let component: FacSecurityComponent;
  let fixture: ComponentFixture<FacSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacSecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
