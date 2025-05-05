import {
  Component,
  effect,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Notifier {
  notify: (msg: string) => void;
  dismiss: () => void;
  ready: WritableSignal<boolean>;
}

@Component({
  selector: 'lib-notify',
  imports: [CommonModule],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css',
  standalone: true,
})
export class NotifyComponent {
  open = false;

  snackbar = inject(MatSnackBar);

  readonly notifier = input<Notifier>();

  constructor() {
    effect(() => {
      const notifier = this.notifier();
      if (notifier && notifier.ready() === false) {
        notifier.notify = (msg: string) => {
          this.snackbar.open(msg, 'dismiss', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            duration: 3000,
          });
        };
        notifier.dismiss = this.snackbar.dismiss;
        notifier.ready.set(true);
      }
    });
  }
}
