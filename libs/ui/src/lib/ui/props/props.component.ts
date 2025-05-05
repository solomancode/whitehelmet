import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Prop {
  key: string;
  value: string | number;
}

@Component({
  selector: 'lib-props',
  imports: [CommonModule],
  templateUrl: './props.component.html',
  styleUrl: './props.component.css',
})
export class PropsComponent {
  readonly props = input<Prop[]>([]);
}
