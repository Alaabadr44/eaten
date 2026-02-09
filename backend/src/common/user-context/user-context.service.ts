import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserContextService {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  run(store: Map<string, any>, callback: () => any) {
    return this.storage.run(store, callback);
  }

  set(key: string, value: any) {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string): any {
    const store = this.storage.getStore();
    return store ? store.get(key) : undefined;
  }

  get userId(): string | undefined {
    return this.get('userId');
  }
}
