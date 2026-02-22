import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCustomerDialog } from './delete-customer-dialog';

describe('DeleteCustomerDialog', () => {
  let component: DeleteCustomerDialog;
  let fixture: ComponentFixture<DeleteCustomerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCustomerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCustomerDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
