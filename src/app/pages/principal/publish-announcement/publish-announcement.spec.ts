import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAnnouncement } from './publish-announcement';

describe('PublishAnnouncement', () => {
  let component: PublishAnnouncement;
  let fixture: ComponentFixture<PublishAnnouncement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishAnnouncement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishAnnouncement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
