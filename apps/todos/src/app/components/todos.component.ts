import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosModule } from '../todos/todos.module';
import { LocalTodo, TodosService } from '../todos/todos.service';
import {
  SearchInputComponent,
  NavComponent,
  BannerComponent,
  TodosLayoutComponent,
  TodoEvent,
} from '@todos/ui';
import { Router, RouterModule } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { UserService } from '../services/user.service';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-todos',
  imports: [
    CommonModule,
    RouterModule,
    TodosModule,
    SearchInputComponent,
    NavComponent,
    BannerComponent,
    TodosLayoutComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  todos = inject(TodosService);
  router = inject(Router);
  notifier = inject(NotifyService);
  user = inject(UserService);
  viewport = inject(ViewportRuler);

  username = signal('');

  compact = signal(false);

  ngOnInit(): void {
    this.todos.fetchUserTodos();
    // 🧨
    // this.todos.load(
    //   Array.from({ length: 1e5 }).map((_, i) => {
    //     return { id: i, todo: i + 'th', completed: false, userId: 1 };
    //   })
    // );
    this.user.getCurrentUserName().then((username) => {
      this.username.set(username);
    });
    const size = this.viewport.getViewportSize();
    if (size.width <= 400) {
      this.compact.set(true);
    }
  }

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.todos.setFilterTerm(input.value);
  }

  openTodo(id: number) {
    this.router.navigate(['todos', id]);
  }

  createTodo() {
    this.router.navigate(['/todos/new']);
  }

  toggle(event: TodoEvent) {
    const found = this.todos.getTodo(event.id, event.list);
    if (found) {
      this.todos.toggle(found.todo);
    }
  }

  withFilter(todos: LocalTodo[]) {
    return this.todos.getFilteredTodos(todos).map((todo) => todo.todo);
  }
}
