import { Component, inject, input, output } from '@angular/core';
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
import { PropsComponent } from '../props/props.component';

@Component({
  selector: 'lib-todo-edit-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    PropsComponent,
  ],
  templateUrl: './todo-edit-form.component.html',
  styleUrl: './todo-edit-form.component.css',
})
export class TodoEditFormComponent {
  readonly id = input(-1);
  readonly userId = input(-1);
  readonly todo = input('');
  readonly completed = input(false);

  onSave = output<{ todo: string; completed: boolean }>();

  fb = inject(FormBuilder);

  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      todo: ['', [Validators.required, Validators.minLength(4)]],
      completed: [false, Validators.required],
    });
  }

  ngOnChanges() {
    this.form.patchValue({
      todo: this.todo(),
      completed: this.completed(),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
