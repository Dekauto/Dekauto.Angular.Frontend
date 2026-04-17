import { routes } from './app.routes';
import { RoleKeys } from './domain-models/Role';

describe('app routes', () => {
  it('содержит защищенный раздел преподавателя', () => {
    // Arrange
    const teacherRoute = routes.find((route) => route.path === 'teacher');

    // Act
    const requiredRoles = teacherRoute?.data?.['requiredRoles'] as string[];

    // Assert
    expect(teacherRoute).toBeTruthy();
    expect(requiredRoles).toContain(RoleKeys.TEACHER);
  });

  it('содержит маршрут отчета по студентам для преподавателя', () => {
    // Arrange
    const teacherRoute = routes.find((route) => route.path === 'teacher');
    const reportsRoute = teacherRoute?.children?.find((child) => child.path === 'reports');

    // Act
    const studentsRoute = reportsRoute?.children?.find((child) => child.path === 'students');

    // Assert
    expect(studentsRoute).toBeTruthy();
  });
});
