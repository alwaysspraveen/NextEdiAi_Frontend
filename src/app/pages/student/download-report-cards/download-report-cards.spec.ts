import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportCards } from './download-report-cards';

describe('DownloadReportCards', () => {
  let component: DownloadReportCards;
  let fixture: ComponentFixture<DownloadReportCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadReportCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadReportCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
