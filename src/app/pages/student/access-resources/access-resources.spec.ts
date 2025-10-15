import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessResources } from './access-resources';

describe('AccessResources', () => {
  let component: AccessResources;
  let fixture: ComponentFixture<AccessResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
