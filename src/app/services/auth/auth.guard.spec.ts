import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RoleKeys } from '../../domain-models/Role';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let routerNavigateSpy: jasmine.Spy;
  let authServiceMock: {
    isAuthenticated: jasmine.Spy;
    userHasAnyRole: jasmine.Spy;
  };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
      userHasAnyRole: jasmine.createSpy('userHasAnyRole')
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    routerNavigateSpy = TestBed.inject(Router).navigate as jasmine.Spy;
  });

  it('разрешает вход при корректной роли преподавателя', () => {
    // Arrange
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.userHasAnyRole.and.returnValue(true);
    const route: any = { data: { requiredRoles: [RoleKeys.TEACHER] } };

    // Act
    const result = executeGuard(route, {} as any);

    // Assert
    expect(result).toBeTrue();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('перенаправляет на access-denied без нужной роли', () => {
    // Arrange
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.userHasAnyRole.and.returnValue(false);
    const route: any = { data: { requiredRoles: [RoleKeys.TEACHER] } };

    // Act
    const result = executeGuard(route, {} as any);

    // Assert
    expect(result).toBeFalse();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/access-denied']);
  });

  it('перенаправляет на login для неавторизованного пользователя', () => {
    // Arrange
    authServiceMock.isAuthenticated.and.returnValue(false);
    const route: any = { data: { requiredRoles: [RoleKeys.TEACHER] } };

    // Act
    const result = executeGuard(route, {} as any);

    // Assert
    expect(result).toBeFalse();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
