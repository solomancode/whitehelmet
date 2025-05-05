import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-nav',
  imports: [CommonModule, MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  onCreateTodo = output();
  readonly username = input('');

  createTodo() {
    this.onCreateTodo.emit();
  }
}
