import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-todo',
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatIconModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  readonly id = input<number>(-1);
  readonly todo = input<string>('');
  readonly completed = input<boolean>(false);

  onToggleCompleted = output<boolean>();
  onOpenTodo = output<number>();

  toggleCompleted() {
    this.onToggleCompleted.emit(!this.completed());
  }

  openTodo() {
    this.onOpenTodo.emit(this.id());
  }
}
