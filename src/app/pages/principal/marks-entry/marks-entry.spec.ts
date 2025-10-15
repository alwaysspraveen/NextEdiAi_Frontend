import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntry } from './marks-entry';

describe('MarksEntry', () => {
  let component: MarksEntry;
  let fixture: ComponentFixture<MarksEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
