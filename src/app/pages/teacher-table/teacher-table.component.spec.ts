import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherTableComponent } from './teacher-table.component';
import { TeacherStateService } from '../../services/teacher-state.service';
import { ApiTeachersService } from '../../api-services/teachers/api-teachers.service';
import { TeacherIdService } from '../../services/teacher-id.service';

describe('TeacherTableComponent', () => {
  let component: TeacherTableComponent;
  let fixture: ComponentFixture<TeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TeacherStateService,
        ApiTeachersService,
        TeacherIdService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherTableComponent);
    component = fixture.componentInstance;
  });

  it('создаётся', () => {
    expect(component).toBeTruthy();
  });
});
