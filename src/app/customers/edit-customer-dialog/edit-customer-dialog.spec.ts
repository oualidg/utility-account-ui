import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerDialog } from './edit-customer-dialog';

describe('EditCustomerDialog', () => {
  let component: EditCustomerDialog;
  let fixture: ComponentFixture<EditCustomerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCustomerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustomerDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
