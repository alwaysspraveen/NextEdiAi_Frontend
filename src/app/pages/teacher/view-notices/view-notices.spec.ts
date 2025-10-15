import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotices } from './view-notices';

describe('ViewNotices', () => {
  let component: ViewNotices;
  let fixture: ComponentFixture<ViewNotices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNotices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNotices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
