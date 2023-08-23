import { ExpirableRepository, SimpleRepository } from "./repository";

interface ExpirableDocument {
  expired?: number;
  value: any;
}

export class InMemoryRepository
  extends SimpleRepository
  implements ExpirableRepository
{
  private readonly store: { [key: string]: ExpirableDocument } = {};

  public async get<T>(key: string) {
    const doc = this.store[key];
    if (!doc) {
      return undefined;
    }
    if (doc.expired && doc.expired > 0 && doc.expired < Date.now()) {
      return undefined;
    }
    return doc.value as T;
  }

  public async set<T>(key: string, value: T) {
    this.store[key] = {
      value,
    };
  }

  public async delete(key: string) {
    delete this.store[key];
  }

  public async setWithExpire<T>(
    key: string,
    value: T,
    expiresInMillis: number
  ) {
    this.store[key] = {
      expired: expiresInMillis > 0 ? Date.now() + expiresInMillis : 0,
      value,
    };
  }
}
