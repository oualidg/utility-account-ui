import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCustomerDialog } from './onboard-customer-dialog';

describe('OnboardCustomerDialog', () => {
  let component: OnboardCustomerDialog;
  let fixture: ComponentFixture<OnboardCustomerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardCustomerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardCustomerDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
