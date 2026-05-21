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

  it('первый клик по пустой ячейке ставит присутствие', () => {
    const rowId = component.data.rows[0].id;
    const lessonId = component.data.lessons[0].id;
    const ev = new MouseEvent('click');

    component.onCellClick(ev, rowId, lessonId);

    expect(component.data.rows[0].lessonCells[lessonId].mode).toBe('present');
  });

  it('выставляет оценку через оверлей', () => {
    const rowId = component.data.rows[0].id;
    const lessonId = component.data.lessons[0].id;
    component.data.rows[0].lessonCells[lessonId] = { mode: 'present' };
    component.openOverlay(rowId, lessonId, 'Тест');

    component.pickScore(4);

    expect(component.overlay).toBeNull();
    expect(component.data.rows[0].lessonCells[lessonId].mode).toBe('scored');
    expect(component.data.rows[0].lessonCells[lessonId].score).toBe(4);
  });
});
