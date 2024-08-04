import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateskillComponent } from './createskill.component';

describe('CreateskillComponent', () => {
  let component: CreateskillComponent;
  let fixture: ComponentFixture<CreateskillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateskillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
