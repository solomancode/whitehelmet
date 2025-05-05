import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { LocalTodo, TodosService, ToggleTodoAction } from './todos.service';
import { Todo } from '@todos/api';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TodosService);
  });

  it('should load local todos', () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    const t2: Todo = { id: 2, todo: '2', completed: true, userId: 2 };
    service.load([t1, t2]);
    const { todos, completed } = service.todos();
    expect(todos.map((t) => t.todo)).toEqual([t1]);
    expect(completed.map((t) => t.todo)).toEqual([t2]);
  });

  it('should pluck local todos', () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    const t2: Todo = { id: 2, todo: '2', completed: true, userId: 2 };
    service.load([t1, t2]);
    const plucked = service.pluck(t1);
    const { todos, completed } = service.todos();
    expect(todos.map((t) => t.todo)).toEqual([]);
    expect(completed.map((t) => t.todo)).toEqual([t2]);
    expect(plucked?.todo).toEqual(t1);
  });

  it('should insert local todos', () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    const t2: Todo = { id: 2, todo: '2', completed: true, userId: 2 };
    service.insert(t1);
    service.insert(t2);
    const { todos, completed } = service.todos();
    expect(todos.map((t) => t.todo)).toEqual([t1]);
    expect(completed.map((t) => t.todo)).toEqual([t2]);
  });

  it('should toggle local todos', () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    const t2: Todo = { id: 2, todo: '2', completed: true, userId: 2 };
    service.load([t1, t2]);
    service.toggle(t1);
    expect(service.todos().todos.map((t) => t.todo)).toEqual([]);
    expect(service.todos().completed.map((t) => t.todo)).toEqual([
      t2,
      { ...t1, completed: true },
    ]);
    service.toggle({ ...t1, completed: true });
    expect(service.todos().todos.map((t) => t.todo)).toEqual([t1]);
    expect(service.todos().completed.map((t) => t.todo)).toEqual([t2]);
  });

  it('should register toggle action', () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    service.load([t1]);
    service.toggle(t1);
    expect(service.todos().todos.length).toEqual(0);
    const toggled = { ...t1, completed: true };
    expect(service.todos().completed.map((t) => t.todo)).toEqual([toggled]);
    expect(service.actions()).toEqual([new ToggleTodoAction(toggled, t1)]);
  });

  it('should apply action', async () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    service.load([t1]);
    service.toggle(t1);
    expect(service.actions().length).toEqual(1);
    service.actions()[0].execute = () => Promise.resolve(true);
    await service.applyActions();
    expect(service.actions().length).toEqual(0);
  });

  it('should apply actions partially', async () => {
    const t1: Todo = { id: 1, todo: '1', completed: false, userId: 1 };
    service.load([t1]);
    const toggled = service.toggle(t1);
    service.toggle(toggled);
    expect(service.actions().length).toEqual(2);
    service.actions()[0].execute = () => Promise.resolve(true);
    service.actions()[1].execute = () => Promise.resolve(false);
    await service.applyActions();
    expect(service.actions().length).toEqual(1);
  });

  it('should match filter term', async () => {
    const t1: Todo = {
      id: 1,
      todo: 'Error Handling',
      completed: false,
      userId: 1,
    };
    const t2: Todo = {
      id: 1,
      todo: 'Form Validation',
      completed: false,
      userId: 1,
    };
    service.load([t1, t2]);
    service.setFilterTerm('valid');
    expect(service.getFilteredTodos(service.todos().todos)).toEqual([
      new LocalTodo(t2),
    ]);
  });

  it('should reset filter', async () => {
    const t1: Todo = {
      id: 1,
      todo: 'Error Handling',
      completed: false,
      userId: 1,
    };
    const t2: Todo = {
      id: 1,
      todo: 'Form Validation',
      completed: false,
      userId: 1,
    };
    service.load([t1, t2]);
    service.setFilterTerm('valid');
    service.resetFilter();
    expect(service.todos().todos.length).toEqual(2);
  });
});
