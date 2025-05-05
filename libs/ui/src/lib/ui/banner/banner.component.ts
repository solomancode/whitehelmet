import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'lib-banner',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  readonly loading = input(true);
  readonly count = input(0);
  onApply = output();
}
