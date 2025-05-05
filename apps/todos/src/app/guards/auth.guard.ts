import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@todos/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getCurrentUserAccessToken();
  if (!token) {
    return router.createUrlTree(['/login']);
  }
  if (auth.isExpiredAccessToken(token)) {
    return router.createUrlTree(['/login']);
  }
  return true;
};
