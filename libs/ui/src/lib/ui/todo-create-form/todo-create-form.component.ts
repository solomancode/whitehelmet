import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-todo-create-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './todo-create-form.component.html',
  styleUrl: './todo-create-form.component.css',
})
export class TodoCreateFormComponent {
  onSave = output<{ todo: string; completed: boolean }>();

  fb = inject(FormBuilder);

  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      todo: ['', [Validators.required, Validators.minLength(4)]],
      completed: [false, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
