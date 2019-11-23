import { ListDocument, MapDocument } from "./document";
export interface IRepository {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
}
export interface IExpirableRepository extends IRepository {
    setWithExpire<T>(key: string, value: T, expiresInMillis: number): Promise<void>;
}
export declare abstract class SimpleRepository {
    abstract get<T>(key: string): Promise<T | undefined>;
    abstract set<T>(key: string, value: T): Promise<void>;
    abstract delete(key: string): Promise<void>;
    getListDocument<V>(key: string): ListDocument<V>;
    getMapDocument<V>(key: string): MapDocument<V>;
}
