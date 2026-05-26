import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherReportMainStudentsComponent } from './teacher-report-main-students.component';
import { TeacherStateService } from '../../services/teacher-state.service';
import { ApiTeachersService } from '../../api-services/teachers/api-teachers.service';
import { TeacherIdService } from '../../services/teacher-id.service';

describe('TeacherReportMainStudentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherReportMainStudentsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TeacherStateService,
        ApiTeachersService,
        TeacherIdService
      ]
    }).compileComponents();
  });

  it('создаётся', () => {
    const fixture = TestBed.createComponent(TeacherReportMainStudentsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('metricRygStyle: красный при 0, зелёный при 1', () => {
    const fixture = TestBed.createComponent(TeacherReportMainStudentsComponent);
    const cmp = fixture.componentInstance;
    expect(cmp.metricRygStyle(0).background).toContain('0deg');
    expect(cmp.metricRygStyle(1).background).toContain('120deg');
  });
});
