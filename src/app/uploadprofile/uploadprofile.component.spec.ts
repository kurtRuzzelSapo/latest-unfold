import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadprofileComponent } from './uploadprofile.component';

describe('UploadprofileComponent', () => {
  let component: UploadprofileComponent;
  let fixture: ComponentFixture<UploadprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
