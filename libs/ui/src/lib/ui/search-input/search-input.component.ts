import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-search-input',
  imports: [CommonModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  onSearch = output<string>();
  onReset = output();

  value = new FormControl('');

  search() {
    if (this.value.value) {
      this.onSearch.emit(this.value.value);
    }
  }

  reset() {
    this.value.setValue('');
    this.onReset.emit();
  }
}
