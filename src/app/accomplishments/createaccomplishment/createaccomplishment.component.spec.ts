import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateaccomplishmentComponent } from './createaccomplishment.component';

describe('CreateaccomplishmentComponent', () => {
  let component: CreateaccomplishmentComponent;
  let fixture: ComponentFixture<CreateaccomplishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateaccomplishmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateaccomplishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
