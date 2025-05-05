import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  public ready = signal(false);

  notify = (msg: string): void => {
    throw new Error('Notifier not attached');
  };

  dismiss = (): void => {
    throw new Error('Notifier not attached');
  };
}
