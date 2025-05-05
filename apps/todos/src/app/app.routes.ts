import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => {
      return import('./components/login.component').then(
        (m) => m.LoginComponent
      );
    },
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () => {
      return import('./components/todos.component').then(
        (m) => m.TodosComponent
      );
    },
    canActivate: [authGuard],
    children: [
      {
        path: ':id',
        loadComponent: () => {
          return import('./components/todo.component').then(
            (m) => m.TodoComponent
          );
        },
        canActivate: [authGuard],
      },
    ],
  },
];
