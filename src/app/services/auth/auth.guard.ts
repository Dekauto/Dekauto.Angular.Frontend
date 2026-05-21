import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/** Берём requiredRoles с текущего снимка или с предков (у дочерних маршрутов /teacher/... data может быть пустым). */
function requiredRolesFrom(route: ActivatedRouteSnapshot): string[] | undefined {
  let r: ActivatedRouteSnapshot | null = route;
  while (r) {
    const roles = r.data['requiredRoles'] as string[] | undefined;
    if (Array.isArray(roles) && roles.length > 0) {
      return roles;
    }
    r = r.parent;
  }
  return undefined;
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = requiredRolesFrom(route);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!requiredRoles?.length) {
    return true;
  }

  if (authService.userHasAnyRole(requiredRoles)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};