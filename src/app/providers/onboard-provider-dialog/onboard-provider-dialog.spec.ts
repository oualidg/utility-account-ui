import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardProviderDialog } from './onboard-provider-dialog';

describe('OnboardProviderDialog', () => {
  let component: OnboardProviderDialog;
  let fixture: ComponentFixture<OnboardProviderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardProviderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardProviderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
