import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherTableComponent } from './teacher-table.component';
import { TeacherStateService } from '../../services/teacher-state.service';
import { TeacherMockDataService } from '../../services/teacher-mock-data.service';

describe('TeacherTableComponent', () => {
  let component: TeacherTableComponent;
  let fixture: ComponentFixture<TeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherTableComponent],
      providers: [TeacherStateService, TeacherMockDataService]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('переключает посещаемость в ячейке', () => {
    // Arrange
    const rowId = component.data.rows[0].id;
    const lessonId = component.data.lessons[0].id;
    const initial = component.data.rows[0].attendanceByLesson[lessonId];

    // Act
    component.toggleAttendance(rowId, lessonId);

    // Assert
    expect(component.data.rows[0].attendanceByLesson[lessonId]).toBe(!initial);
  });

  it('выставляет балл активности в ячейке', () => {
    // Arrange
    const rowId = component.data.rows[0].id;
    const lessonId = component.data.lessons[0].id;

    // Act
    component.setActivity(rowId, lessonId, 4);

    // Assert
    expect(component.data.rows[0].activityByLesson[lessonId]).toBe(4);
  });
});
