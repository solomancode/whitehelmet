import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TodoComponent } from '@todos/ui';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

export interface TodoEvent {
  id: number;
  list: 'todos' | 'completed';
}

@Component({
  selector: 'lib-todos-layout',
  imports: [
    CommonModule,
    TodoComponent,
    MatButtonToggleModule,
    CdkDropList,
    CdkDrag,
    ScrollingModule,
  ],
  templateUrl: './todos-layout.component.html',
  styleUrl: './todos-layout.component.css',
})
export class TodosLayoutComponent {
  readonly compact = input(false);
  readonly todos = input<Todo[]>([]);
  readonly completed = input<Todo[]>([]);

  viewport = inject(ViewportRuler);
  height = signal(100);
  active = signal<'todos' | 'completed'>('todos');

  onToggleCompleted = output<TodoEvent>();
  onOpenTodo = output<number>();

  ngOnInit() {
    const height = this.viewport.getViewportSize().height;
    const navHeight = getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')
      .trim()
      .replace('px', '');
    this.height.set(height - Number(navHeight) - 80);
  }

  drop(event: CdkDragDrop<string[]>) {
    const element = event.item.element.nativeElement;
    const id = Number(element.dataset['todoId']);
    const list = element.dataset['list'] as TodoEvent['list'];
    this.onToggleCompleted.emit({ id, list });
  }
}
