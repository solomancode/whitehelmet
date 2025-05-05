import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { NotifyComponent } from '@todos/ui';

@Component({
  imports: [RouterModule, NotifyComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'todos';
  notifier = inject(NotifyService);
}
