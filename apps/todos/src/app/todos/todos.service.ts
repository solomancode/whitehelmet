import { inject, Injectable, signal } from '@angular/core';
import { Todo, TodosApiService } from '@todos/api';
import { UserService } from '../services/user.service';

export interface PostUpdateAction {
  todo: Todo;
  prev: Todo;
  execute(todosApi: TodosApiService, user: UserService): Promise<boolean>;
}

export class ToggleTodoAction implements PostUpdateAction {
  constructor(public todo: Todo, public prev: Todo) {}

  async execute(api: TodosApiService, user: UserService): Promise<boolean> {
    const response = await api.updateTodo(this.todo.id, {
      completed: this.todo.completed,
      userId: await user.getCurrentUserId(),
    });
    return response.status === 'success';
  }
}

export class LocalTodo {
  constructor(public todo: Todo) {}
}

class LocalTodos {
  constructor(public todos: LocalTodo[], public completed: LocalTodo[]) {}
}

const AlwaysMatchFilter = (todo: Todo) => true;

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  public status = signal<'ready' | 'loading' | 'loaded' | 'error'>('ready');
  public processingActions = signal<boolean>(false);

  todos = signal(new LocalTodos([], []));
  actions = signal<PostUpdateAction[]>([]);
  filter = signal(AlwaysMatchFilter);

  todosApi = inject(TodosApiService);
  user = inject(UserService);

  async fetchUserTodos() {
    this.status.set('loading');
    const userId = await this.user.getCurrentUserId();
    try {
      const response = await this.todosApi.listTodos(userId);
      if (response.status === 'success') {
        this.load(response.data);
        this.status.set('loaded');
      } else {
        this.status.set('error');
      }
    } catch (err) {
      this.status.set('error');
    }
  }

  insert(todo: Todo) {
    if (todo.completed) {
      this.todos.set(
        new LocalTodos(this.todos().todos, [
          ...this.todos().completed,
          new LocalTodo(todo),
        ])
      );
    } else {
      this.todos.set(
        new LocalTodos(
          [...this.todos().todos, new LocalTodo(todo)],
          this.todos().completed
        )
      );
    }
  }

  load(todos: Todo[]) {
    const next = new LocalTodos([], []);
    for (const todo of todos) {
      if (todo.completed) {
        next.completed.push(new LocalTodo(todo));
      } else {
        next.todos.push(new LocalTodo(todo));
      }
    }
    this.todos.set(next);
  }

  pluck(todo: Todo) {
    const todos = todo.completed ? this.todos().completed : this.todos().todos;

    let todoIndex = todos.findIndex((current) => current.todo.id === todo.id);
    const plucked = todos[todoIndex];

    if (todoIndex === -1) {
      return; // do nothing
    } else {
      if (todo.completed) {
        this.todos.set(
          new LocalTodos(this.todos().todos, [
            ...this.todos().completed.slice(0, todoIndex),
            ...this.todos().completed.slice(todoIndex + 1),
          ])
        );
      } else {
        this.todos.set(
          new LocalTodos(
            [
              ...this.todos().todos.slice(0, todoIndex),
              ...this.todos().todos.slice(todoIndex + 1),
            ],
            this.todos().completed
          )
        );
      }
    }

    return plucked;
  }

  toggle(todo: Todo): Todo {
    const plucked = this.pluck(todo);
    if (plucked) {
      const next: Todo = {
        ...plucked.todo,
        completed: !plucked.todo.completed,
      };
      this.insert(next);
      // post update - sync remote
      this.actions.set([...this.actions(), new ToggleTodoAction(next, todo)]);
      return next;
    } else {
      throw new Error(`Failed to toggle todo: '${todo.id}'`);
    }
  }

  async applyActions() {
    this.processingActions.set(true);
    for (const action of this.actions()) {
      const success = await action.execute(this.todosApi, this.user);
      if (success) {
        this.actions.set(
          this.actions().filter((_action) => {
            return action !== _action;
          })
        );
      } else {
        this.processingActions.set(false);
        return; // abort
      }
    }
    this.processingActions.set(false);
  }

  setFilterTerm(term: string) {
    this.filter.set((todo) => {
      return todo.todo.toLowerCase().includes(term.toLowerCase());
    });
  }

  resetFilter() {
    this.filter.set(AlwaysMatchFilter);
  }

  getFilteredTodos(todos: LocalTodo[]) {
    return todos.filter((todo) => {
      return this.filter()(todo.todo);
    });
  }

  getTodo(id: number, list: 'todos' | 'completed') {
    return this.todos()[list].find((todo) => todo.todo.id === id);
  }
}
