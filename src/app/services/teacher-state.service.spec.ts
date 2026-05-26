import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherStateService } from './teacher-state.service';
import { ApiTeachersService } from '../api-services/teachers/api-teachers.service';
import { TeacherIdService } from './teacher-id.service';

describe('TeacherStateService', () => {
  let service: TeacherStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TeacherStateService,
        ApiTeachersService,
        TeacherIdService
      ]
    });
    service = TestBed.inject(TeacherStateService);
  });

  it('обновляет фильтры через patchFilters', () => {
    const nextGroup = '22ИТ-ПИ(б/о) ПИП-2';
    service.patchFilters({ group: nextGroup });
    expect(service.filtersValue.group).toBe(nextGroup);
  });

  it('обновляет выбранного студента', (done) => {
    const expectedId = 'st-2';
    service.setSelectedStudent(expectedId);
    service.selectedStudentId$.subscribe((studentId) => {
      expect(studentId).toBe(expectedId);
      done();
    });
  });
});
