import { TestBed } from '@angular/core/testing';
import { TeacherStateService } from './teacher-state.service';
import { TeacherMockDataService } from './teacher-mock-data.service';

describe('TeacherStateService', () => {
  let service: TeacherStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeacherStateService, TeacherMockDataService]
    });
    service = TestBed.inject(TeacherStateService);
  });

  it('обновляет фильтры через patchFilters', () => {
    // Arrange
    const nextGroup = '22ИТ-ПИ(б/о) ПИП-2';

    // Act
    service.patchFilters({ group: nextGroup });

    // Assert
    expect(service.filtersValue.group).toBe(nextGroup);
  });

  it('обновляет выбранного студента', (done) => {
    // Arrange
    const expectedId = 'st-2';

    // Act
    service.setSelectedStudent(expectedId);
    service.selectedStudentId$.subscribe((studentId) => {
      // Assert
      expect(studentId).toBe(expectedId);
      done();
    });
  });
});
