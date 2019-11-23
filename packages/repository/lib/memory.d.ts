import { IExpirableRepository, SimpleRepository } from "./repository";
export declare class InMemoryRepository extends SimpleRepository implements IExpirableRepository {
    private readonly store;
    get<T>(key: string): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    setWithExpire<T>(key: string, value: T, expiresInMillis: number): Promise<void>;
}
