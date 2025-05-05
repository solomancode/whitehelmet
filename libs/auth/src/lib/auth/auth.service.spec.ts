import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';

import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  const username = 'emilys';
  const password = 'emilyspass';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor]))],
    });
    service = TestBed.inject(AuthService);
  });

  it('should acquire an access token', async () => {
    await service.login(username, password);
    const accessToken = service.getCurrentUserAccessToken();
    expect(accessToken).toBeTruthy();
  });

  it('should fail to login', async () => {
    const response = await service.login('', '');
    expect(response.status === 'error').toBeTruthy();
  });

  it('should store access token locally', async () => {
    const response = await service.login(username, password);
    if (response.status === 'success') {
      const tokens = service.storage.getSessionTokens();
      expect(tokens).toBeTruthy();
    }
  });

  it('should get current user', async () => {
    await service.login(username, password);
    const user = await service.getCurrentUser();
    expect(user.status === 'success').toBeTruthy();
  });

  it('should refresh access token', async () => {
    await service.login(username, password);
    const response = await service.refreshAuthToken();
    expect(response.status === 'success').toBeTruthy();
  });
});
