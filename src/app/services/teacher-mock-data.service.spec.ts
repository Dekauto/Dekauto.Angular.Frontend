import { TestBed } from '@angular/core/testing';
import { TeacherMockDataService } from './teacher-mock-data.service';

describe('TeacherMockDataService', () => {
  let service: TeacherMockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherMockDataService);
  });

  it('возвращает фильтры по умолчанию', () => {
    // Arrange

    // Act
    const filters = service.getDefaultFilters();

    // Assert
    expect(filters.academicYear).toBeTruthy();
    expect(filters.semester).toBeTruthy();
    expect(filters.group).toBeTruthy();
    expect(filters.subject).toBeTruthy();
  });

  it('возвращает данные табеля с уроками и строками', () => {
    // Arrange
    const filters = service.getDefaultFilters();

    // Act
    const tableData = service.getTableData(filters);

    // Assert
    expect(tableData.lessons.length).toBeGreaterThan(0);
    expect(tableData.rows.length).toBeGreaterThan(0);
  });
});
