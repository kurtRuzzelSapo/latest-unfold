import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangetemplateComponent } from './changetemplate.component';

describe('ChangetemplateComponent', () => {
  let component: ChangetemplateComponent;
  let fixture: ComponentFixture<ChangetemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangetemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
