import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignStamperComponent } from './sign-stamper.component';

describe('SignStamperComponent', () => {
  let component: SignStamperComponent;
  let fixture: ComponentFixture<SignStamperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignStamperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignStamperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
