import { inject, Injectable } from '@angular/core';
import { AuthService, UserData } from '@todos/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private auth = inject(AuthService);

  currentUser: UserData | null = null;

  async getCurrentUser() {
    if (!this.currentUser) {
      const response = await this.auth.getCurrentUser();
      if (response.status === 'success') {
        this.currentUser = response.data;
      }
    }
    return this.currentUser;
  }

  async getCurrentUserName() {
    const currentUser = await this.getCurrentUser();
    return currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : '';
  }

  async getCurrentUserId() {
    const currentUser = await this.getCurrentUser();
    return currentUser ? currentUser.id : -1;
  }
}
