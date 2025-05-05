import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiResponse, Page, Todo } from '../types';
import { firstValueFrom, Observable } from 'rxjs';

type ResponseTransformer<T, U> = (response: ApiResponse<T>) => ApiResponse<U>;

const intoPromise = async <T, U = T>(
  observable: Observable<HttpResponse<object>>,
  transformResponse: ResponseTransformer<T, U> = (r) => r as ApiResponse<U>
): Promise<ApiResponse<U>> => {
  try {
    const response = await firstValueFrom(observable);
    if (response.ok) {
      return transformResponse({ status: 'success', data: response.body as T });
    } else {
      return transformResponse({ status: 'error', message: '' });
    }
  } catch (err: any) {
    return transformResponse({ status: 'error', message: err.toString() });
  }
};

interface ListTodosApiResponse extends Page {
  todos: Todo[];
}

interface UpdateTodo {
  userId: number;
  todo?: string;
  completed?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodosApiService {
  private http = inject(HttpClient);

  page: Page = {
    total: 0,
    skip: 0,
    limit: 0,
  };

  async getTodo(id: number) {
    return intoPromise<Todo>(
      this.http.get('https://dummyjson.com/todos/' + id, {
        observe: 'response',
      }),
      (response) => {
        if (response.status === 'success') {
          return response;
        } else {
          if (response.message === '') {
            return {
              ...response,
              message: `Failed to load todo '${id}', Please try again`,
            };
          } else {
            return response;
          }
        }
      }
    );
  }

  async listTodos(userId: number): Promise<ApiResponse<Todo[]>> {
    return intoPromise<ListTodosApiResponse, Todo[]>(
      this.http.get('https://dummyjson.com/todos/user/' + userId, {
        observe: 'response',
      }),
      (response) => {
        if (response.status === 'success') {
          const { todos, ...page } = response.data;
          this.page = page;
          return { status: 'success', data: todos };
        } else {
          if (response.message === '') {
            return {
              ...response,
              message: 'Failed to load todos, Please try again',
            };
          } else {
            return response;
          }
        }
      }
    );
  }

  async updateTodo(id: number, body: UpdateTodo): Promise<ApiResponse<Todo>> {
    return intoPromise<Todo>(
      this.http.put('https://dummyjson.com/todos/' + id, body, {
        observe: 'response',
      }),
      (response) => {
        if (response.status === 'error' && response.message === '') {
          return {
            ...response,
            message: 'Failed to update todo, Please try again',
          };
        } else {
          return response;
        }
      }
    );
  }

  async createTodo(body: Omit<Todo, 'id'>): Promise<ApiResponse<Todo>> {
    return intoPromise<Todo>(
      this.http.post('https://dummyjson.com/todos/add', body, {
        observe: 'response',
      }),
      (response) => {
        if (response.status === 'error' && response.message === '') {
          return {
            ...response,
            message: 'Failed to create todo, Please try again',
          };
        } else {
          return response;
        }
      }
    );
  }
}
