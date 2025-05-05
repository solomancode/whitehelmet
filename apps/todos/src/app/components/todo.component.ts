import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodosApiModule, TodosApiService } from '@todos/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TodoEditFormComponent,
  TodoCreateFormComponent,
  LoaderComponent,
  ModalComponent,
} from '@todos/ui';
import { NotifyService } from '../services/notify.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-todo',
  imports: [
    CommonModule,
    TodosApiModule,
    LoaderComponent,
    TodoEditFormComponent,
    TodoCreateFormComponent,
    ModalComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  todosApi = inject(TodosApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  notifier = inject(NotifyService);
  user = inject(UserService);

  todo = signal<Todo | null>(null);
  error = signal<string | null>(null);

  openEditForm = signal(false);
  openCreateForm = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id === 'new') {
        this.openCreateForm.set(true);
      } else {
        this.todosApi.getTodo(id).then((response) => {
          if (response.status === 'success') {
            this.todo.set(response.data);
            this.openEditForm.set(true);
          } else {
            this.error.set(response.message);
          }
        });
      }
    });
  }

  async save(update: { todo: string; completed: boolean }) {
    const id = this.todo()?.id;
    if (id) {
      const todo = await this.todosApi.updateTodo(id, {
        ...update,
        userId: await this.user.getCurrentUserId(),
      });
      if (todo.status === 'success') {
        this.notifier.notify(`Todo: '${id}' was updated successfully`);
      } else {
        this.notifier.notify(`Failed to update todo: ${id}, Please try again`);
      }
    }
    this.closeEditForm();
  }

  async create(todo: { todo: string; completed: boolean }) {
    const result = await this.todosApi.createTodo({
      ...todo,
      userId: await this.user.getCurrentUserId(),
    });
    if (result.status === 'success') {
      this.notifier.notify(
        `Todo: '${result.data.id}' was created successfully`
      );
    } else {
      this.notifier.notify(`Failed to create todo, Please try again`);
    }
    this.closeEditForm();
  }

  closeEditForm() {
    this.openEditForm.set(false);
    this.router.navigate(['/todos']);
  }

  closeCreateForm() {
    this.openCreateForm.set(false);
    this.router.navigate(['/todos']);
  }
}
