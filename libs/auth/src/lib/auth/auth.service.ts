import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LocalStorage } from '@todos/local-storage';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserData = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

type AuthResponse<T> =
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      error: string;
    };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  public expiresInMins = 60;
  public storage = new LocalStorage();

  getCurrentUserAccessToken() {
    const tokens = this.storage.getSessionTokens();
    return tokens ? tokens.accessToken : null;
  }

  getCurrentUserRefreshToken() {
    const tokens = this.storage.getSessionTokens();
    return tokens ? tokens.refreshToken : null;
  }

  async login(
    username: string,
    password: string
  ): Promise<AuthResponse<Tokens>> {
    try {
      const observable = this.http.post(
        'https://dummyjson.com/auth/login',
        { username, password, expiresInMins: this.expiresInMins },
        { observe: 'response' }
      );
      const response = await firstValueFrom(observable);
      if (response.ok) {
        const data = response.body as Tokens;
        this.storage.setSessionTokens(data.accessToken, data.refreshToken);
        return {
          status: 'success',
          data,
        };
      } else {
        return {
          status: 'error',
          error: 'Invalid username or password',
        };
      }
    } catch {
      return {
        status: 'error',
        error: 'Invalid username or password',
      };
    }
  }

  isExpiredAccessToken(token: string) {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  async getCurrentUser(): Promise<AuthResponse<UserData>> {
    try {
      const response = await firstValueFrom(
        this.http.get('https://dummyjson.com/auth/me', {
          observe: 'response',
        })
      );
      if (response.ok) {
        const user = response.body as UserData;
        return { status: 'success', data: user };
      } else {
        return {
          status: 'error',
          error: 'Unauthorized',
        };
      }
    } catch (error: any) {
      if (error.status === 401) {
        return {
          status: 'error',
          error: 'Unauthorized',
        };
      }
      return {
        status: 'error',
        error: 'Failed to get current user, Please try again',
      };
    }
  }

  async refreshAuthToken(): Promise<AuthResponse<Tokens>> {
    const tokens = this.storage.getSessionTokens();
    if (!tokens) {
      return {
        status: 'error',
        error: 'Refresh token not found',
      };
    }
    const observable = this.http.post(
      'https://dummyjson.com/auth/refresh',
      { refreshToken: tokens.refreshToken, expiresInMins: this.expiresInMins },
      { observe: 'response' }
    );
    const response = await firstValueFrom(observable);
    if (response.ok) {
      const data = response.body as Tokens;
      this.storage.setSessionTokens(data.accessToken, data.refreshToken);
      return {
        status: 'success',
        data,
      };
    } else {
      return {
        status: 'error',
        error: 'Failed to refresh access token',
      };
    }
  }
}
