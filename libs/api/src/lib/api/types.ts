export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface Page {
  total: number;
  skip: number;
  limit: number;
}

export interface ListTodosResponse extends Page {
  todos: Todo[];
}

export type ApiResponse<TData> =
  | {
      status: 'success';
      data: TData;
    }
  | {
      status: 'error';
      message: string;
    };
