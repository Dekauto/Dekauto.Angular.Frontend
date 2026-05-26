import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';
import {
  ApiTeachersService,
  TeacherFilterOptionsApi,
  mapGradebookToHeatmap,
  mapGradebookToTableData,
  mapGroupMetrics,
  mapStudentMetricsToCards
} from '../api-services/teachers/api-teachers.service';
import {
  GroupHeatmapData,
  GroupReportMetrics,
  StudentReportCard,
  TeacherFilterState,
  TeacherTableData,
  TableLessonCell
} from '../domain-models/teacher/teacher.models';
import { TeacherIdService } from './teacher-id.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherStateService {
  private readonly filtersSubject: BehaviorSubject<TeacherFilterState>;
  readonly filters$: Observable<TeacherFilterState>;

  private readonly filterOptionsSubject = new BehaviorSubject<TeacherFilterOptionsApi | null>(null);
  readonly filterOptions$ = this.filterOptionsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  private loadingCount = 0;

  private readonly excludedIdsSubject = new BehaviorSubject<Set<string>>(new Set());
  readonly excludedStudentIds$ = this.excludedIdsSubject.asObservable();

  private tableData: TeacherTableData | null = null;
  private studentCards: StudentReportCard[] = [];
  private groupHeatmap: GroupHeatmapData | null = null;
  private groupMetrics: GroupReportMetrics | null = null;

  private readonly selectedStudentIdSubject = new BehaviorSubject<string | null>(null);
  readonly selectedStudentId$ = this.selectedStudentIdSubject.asObservable();

  constructor(
    private apiTeachers: ApiTeachersService,
    private teacherIdService: TeacherIdService
  ) {
    this.filtersSubject = new BehaviorSubject<TeacherFilterState>({
      academicYear: '',
      semester: '',
      group: '',
      subject: ''
    });
    this.filters$ = this.filtersSubject.asObservable();
  }

  get filtersValue(): TeacherFilterState {
    return this.filtersSubject.value;
  }

  get excludedStudentIds(): Set<string> {
    return this.excludedIdsSubject.value;
  }

  patchFilters(patch: Partial<TeacherFilterState>): void {
    this.setFilters({ ...this.filtersValue, ...patch });
  }

  private setFilters(next: TeacherFilterState): void {
    if (this.filtersCacheKey(this.filtersValue) !== this.filtersCacheKey(next)) {
      this.clearReportCaches();
    }
    this.filtersSubject.next(next);
  }

  /** Сброс кэша отчётов и табеля при смене фильтров или внешних изменениях данных. */
  clearReportCaches(): void {
    this.tableData = null;
    this.studentCards = [];
    this.groupHeatmap = null;
    this.groupMetrics = null;
  }

  private filtersCacheKey(f: TeacherFilterState): string {
    return `${f.academicYear}\0${f.semester}\0${f.group}\0${f.subject}`;
  }

  subjectsForGroup(group: string): string[] {
    const opts = this.filterOptionsSubject.value;
    if (!opts?.subjectsByGroup) {
      return opts?.subjects ?? [];
    }
    return opts.subjectsByGroup[group] ?? [];
  }

  applyGroupChange(group: string): void {
    const subjects = this.subjectsForGroup(group);
    const subject = subjects.includes(this.filtersValue.subject)
      ? this.filtersValue.subject
      : (subjects[0] ?? '');
    this.patchFilters({ group, subject });
  }

  hasValidFilters(): boolean {
    const f = this.filtersValue;
    return Boolean(f.group?.trim() && f.subject?.trim());
  }

  /** Загружает опции фильтров, если группа или предмет ещё не выбраны. */
  ensureFiltersReady(): Observable<void> {
    if (this.hasValidFilters()) {
      return of(undefined);
    }
    return this.loadFilterOptions();
  }

  runWithLoading<T>(source: Observable<T>): Observable<T> {
    this.loadingCount++;
    this.loadingSubject.next(true);
    return source.pipe(
      finalize(() => {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        this.loadingSubject.next(this.loadingCount > 0);
      })
    );
  }

  loadFilterOptions(semester?: string): Observable<void> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      return of(undefined);
    }

    const sem = semester ?? this.filtersValue.semester;
    return this.runWithLoading(
      this.apiTeachers.getFilters(teacherId, sem || undefined).pipe(
        tap((opts) => {
          this.filterOptionsSubject.next(opts);
          const group = opts.groups.includes(this.filtersValue.group)
            ? this.filtersValue.group
            : (opts.groups[0] ?? '');
          const subjects = opts.subjectsByGroup?.[group] ?? opts.subjects;
          const subject = subjects.includes(this.filtersValue.subject)
            ? this.filtersValue.subject
            : (subjects[0] ?? '');
          this.setFilters({
            academicYear: opts.academicYears.includes(this.filtersValue.academicYear)
              ? this.filtersValue.academicYear
              : (opts.academicYears[0] ?? ''),
            semester: sem || (opts.semesters[0] ?? ''),
            group,
            subject
          });
        }),
        map(() => undefined),
        catchError(() => of(undefined))
      )
    );
  }

  loadExclusions(): Observable<void> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      this.excludedIdsSubject.next(new Set());
      return of(undefined);
    }

    return this.apiTeachers.getExclusions(teacherId).pipe(
      tap((res) => this.excludedIdsSubject.next(new Set(res.studentIds ?? []))),
      map(() => undefined),
      catchError(() => {
        this.excludedIdsSubject.next(new Set());
        return of(undefined);
      })
    );
  }

  toggleStudentExclusion(studentId: string): Observable<void> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      return of(undefined);
    }

    const next = new Set(this.excludedStudentIds);
    if (next.has(studentId)) {
      next.delete(studentId);
    } else {
      next.add(studentId);
    }

    return this.runWithLoading(
      this.apiTeachers.setExclusions(teacherId, [...next]).pipe(
        tap(() => {
          this.excludedIdsSubject.next(next);
          if (this.tableData) {
            for (const row of this.tableData.rows) {
              row.isExcluded = next.has(row.id);
            }
          }
        }),
        map(() => undefined),
        catchError(() => of(undefined))
      )
    );
  }

  syncTimetable(): Observable<void> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      return of(undefined);
    }
    return this.runWithLoading(
      this.apiTeachers.syncTimetable(teacherId).pipe(
        tap(() => this.clearReportCaches()),
        map(() => undefined),
        catchError(() => of(undefined))
      )
    );
  }

  loadTableData(): Observable<TeacherTableData> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      this.tableData = { lessons: [], rows: [] };
      return of(this.tableData);
    }

    return this.ensureFiltersReady().pipe(
      switchMap(() =>
        this.runWithLoading(
          forkJoin({
            gradebook: this.apiTeachers.getGradebook(teacherId, this.filtersValue),
            exclusions: this.loadExclusions()
          }).pipe(
            map(({ gradebook }) => {
              this.tableData = mapGradebookToTableData(gradebook);
              return this.tableData;
            }),
            catchError(() => {
              this.tableData = { lessons: [], rows: [] };
              return of(this.tableData);
            })
          )
        )
      )
    );
  }

  getTableData(): TeacherTableData {
    return this.tableData ?? { lessons: [], rows: [] };
  }

  saveCell(lessonId: string, studentId: string, cell: TableLessonCell): Observable<void> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      return of(undefined);
    }

    const lessonIdNum = Number(lessonId);
    return this.apiTeachers
      .saveGradebook(teacherId, [
        {
          lessonId: lessonIdNum,
          studentId,
          mode: cell.mode,
          score: cell.score ?? null
        }
      ])
      .pipe(catchError(() => of(undefined)));
  }

  loadStudentReportCards(): Observable<StudentReportCard[]> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      this.studentCards = [];
      return of([]);
    }

    return this.ensureFiltersReady().pipe(
      switchMap(() =>
        this.runWithLoading(
          this.apiTeachers.getStudentMetrics(teacherId, this.filtersValue).pipe(
            map((items) => {
              this.studentCards = mapStudentMetricsToCards(items);
              return this.studentCards;
            }),
            catchError(() => {
              this.studentCards = [];
              return of([]);
            })
          )
        )
      )
    );
  }

  getStudentCards(): StudentReportCard[] {
    return this.studentCards;
  }

  loadGroupReport(): Observable<{ heatmap: GroupHeatmapData; metrics: GroupReportMetrics }> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      this.groupHeatmap = { sessions: [], rows: [] };
      this.groupMetrics = {
        averageGpa: 0,
        qualityPercent: 0,
        averageAttendance: 0,
        averageCorrelation: 0
      };
      return of({ heatmap: this.groupHeatmap, metrics: this.groupMetrics });
    }

    return this.ensureFiltersReady().pipe(
      switchMap(() =>
        this.runWithLoading(
          forkJoin({
            gradebook: this.apiTeachers.getGradebook(teacherId, this.filtersValue, true),
            metrics: this.apiTeachers.getGroupMetrics(teacherId, this.filtersValue),
            exclusions: this.loadExclusions()
          }).pipe(
            map(({ gradebook, metrics }) => {
              this.groupHeatmap = mapGradebookToHeatmap(gradebook);
              this.groupMetrics = mapGroupMetrics(metrics);
              return { heatmap: this.groupHeatmap, metrics: this.groupMetrics };
            }),
            catchError(() => {
              this.groupHeatmap = { sessions: [], rows: [] };
              this.groupMetrics = {
                averageGpa: 0,
                qualityPercent: 0,
                averageAttendance: 0,
                averageCorrelation: 0
              };
              return of({ heatmap: this.groupHeatmap, metrics: this.groupMetrics });
            })
          )
        )
      )
    );
  }

  loadGroupHeatmap(): Observable<GroupHeatmapData> {
    return this.loadGroupReport().pipe(map((r) => r.heatmap));
  }

  getGroupHeatmap(): GroupHeatmapData {
    return this.groupHeatmap ?? { sessions: [], rows: [] };
  }

  getGroupMetrics(): GroupReportMetrics {
    return (
      this.groupMetrics ?? {
        averageGpa: 0,
        qualityPercent: 0,
        averageAttendance: 0,
        averageCorrelation: 0
      }
    );
  }

  loadAllYearsMetrics(): Observable<{
    averageScore: number;
    qualityPercent: number;
    averageAttendance: number;
  }> {
    const teacherId = this.teacherIdService.getTeacherId();
    if (!teacherId) {
      return of({ averageScore: 0, qualityPercent: 0, averageAttendance: 0 });
    }

    return this.runWithLoading(
      this.apiTeachers.getAllGroupsMetrics(teacherId).pipe(
        map((groups) => {
          if (!groups.length) {
            return { averageScore: 0, qualityPercent: 0, averageAttendance: 0 };
          }
          return {
            averageScore: groups.reduce((s, g) => s + g.averageGpa, 0) / groups.length,
            qualityPercent: groups.reduce((s, g) => s + g.qualityPercent, 0) / groups.length,
            averageAttendance:
              groups.reduce((s, g) => s + g.averageAttendance, 0) / groups.length * 100
          };
        }),
        catchError(() => of({ averageScore: 0, qualityPercent: 0, averageAttendance: 0 }))
      )
    );
  }

  setSelectedStudent(studentId: string | null): void {
    this.selectedStudentIdSubject.next(studentId);
  }
}
