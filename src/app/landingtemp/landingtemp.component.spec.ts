import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingtempComponent } from './landingtemp.component';

describe('LandingtempComponent', () => {
  let component: LandingtempComponent;
  let fixture: ComponentFixture<LandingtempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingtempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingtempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
