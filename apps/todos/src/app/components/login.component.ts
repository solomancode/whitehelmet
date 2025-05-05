import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '@todos/ui';
import { AuthService } from '@todos/auth';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  notifier = inject(NotifyService);

  async login({ username, password }: { username: string; password: string }) {
    const response = await this.auth.login(username, password);
    console.log(response);
    if (response.status === 'success') {
      this.router.navigate(['/todos']);
    } else {
      console.log(this.notifier);
      this.notifier.notify(response.error);
    }
  }
}
