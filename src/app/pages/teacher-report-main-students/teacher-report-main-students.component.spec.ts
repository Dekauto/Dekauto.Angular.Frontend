import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherReportMainStudentsComponent } from './teacher-report-main-students.component';
import { TeacherStateService } from '../../services/teacher-state.service';
import { TeacherMockDataService } from '../../services/teacher-mock-data.service';

describe('TeacherReportMainStudentsComponent', () => {
  let component: TeacherReportMainStudentsComponent;
  let fixture: ComponentFixture<TeacherReportMainStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherReportMainStudentsComponent],
      providers: [TeacherStateService, TeacherMockDataService]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherReportMainStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('раскрывает карточку студента по клику', () => {
    // Arrange
    const targetId = component.cards[1].studentId;

    // Act
    component.toggleStudent(targetId);

    // Assert
    expect(component.openedStudentId).toBe(targetId);
  });

  it('сворачивает уже открытую карточку', () => {
    // Arrange
    const targetId = component.cards[0].studentId;
    component.openedStudentId = targetId;

    // Act
    component.toggleStudent(targetId);

    // Assert
    expect(component.openedStudentId).toBeNull();
  });
});
