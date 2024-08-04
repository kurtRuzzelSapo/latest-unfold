import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaccomplishmentsComponent } from './editaccomplishments.component';

describe('EditaccomplishmentsComponent', () => {
  let component: EditaccomplishmentsComponent;
  let fixture: ComponentFixture<EditaccomplishmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditaccomplishmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditaccomplishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
