import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostClassAnnouncements } from './post-class-announcements';

describe('PostClassAnnouncements', () => {
  let component: PostClassAnnouncements;
  let fixture: ComponentFixture<PostClassAnnouncements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostClassAnnouncements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostClassAnnouncements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
