interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

interface TodosLocalStorage {
  setSessionTokens(accessToken: string, refreshToken: string): void;
  getSessionTokens(): SessionTokens | null;
}

export class LocalStorage implements TodosLocalStorage {
  private storage: Storage | null = null;

  constructor(private key = 'TODOS_SESSION_TOKENS') {
    try {
      if (localStorage) {
        this.storage = localStorage;
      }
    } catch {
      console.warn(
        '⚠️ Running in server environment, session not persisted locally!'
      );
    }
  }

  setSessionTokens(accessToken: string, refreshToken: string) {
    if (this.storage) {
      this.storage.setItem(
        this.key,
        JSON.stringify({ accessToken, refreshToken })
      );
    } else {
      console.warn(
        '⚠️ Running in server environment, tokens not persisted locally!'
      );
    }
  }

  getSessionTokens(): SessionTokens | null {
    if (this.storage) {
      const data = this.storage.getItem(this.key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}
