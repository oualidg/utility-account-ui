import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProviderDialog } from './edit-provider-dialog';

describe('EditProviderDialog', () => {
  let component: EditProviderDialog;
  let fixture: ComponentFixture<EditProviderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProviderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProviderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
