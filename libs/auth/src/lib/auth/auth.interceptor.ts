import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@todos/auth';

const execludes = ['/auth/login'];

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const url = new URL(req.url);
  if (execludes.includes(url.pathname)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const accessToken = auth.getCurrentUserAccessToken();
  if (!accessToken) return next(req);

  const reqWithAuthToken = req.clone({
    headers: req.headers.append('Authorization', 'Bearer ' + accessToken),
  });

  return next(reqWithAuthToken);
}
