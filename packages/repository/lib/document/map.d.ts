import { IRepository } from "..";
import { IVersioned } from "./versioned";
interface IKeyValues<V> {
    [key: string]: V;
}
export declare class MapDocument<V = string> {
    private readonly repository;
    private readonly tupleKey;
    constructor(repository: IRepository, tupleKey: string);
    insertOrUpdate(key: string, value: V | undefined): Promise<{
        content: IKeyValues<V>;
        version: number;
    }>;
    delete(key: string): Promise<{
        content: IKeyValues<V>;
        version: number;
    }>;
    truncate(): Promise<void>;
    read(): Promise<IVersioned<IKeyValues<V>>>;
    edit(modifier: (input: IKeyValues<V>) => IKeyValues<V>): Promise<{
        content: IKeyValues<V>;
        version: number;
    }>;
    view<U>(selector: (input: IKeyValues<V>) => U): Promise<U>;
    private ensureDocument;
}
export {};
