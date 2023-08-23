import { Repository } from "..";
import { Versioned } from "./versioned";
interface KeyValues<V> {
    [key: string]: V;
}
export declare class MapDocument<V = string> {
    private readonly repository;
    private readonly tupleKey;
    constructor(repository: Repository, tupleKey: string);
    insertOrUpdate(key: string, value: V | undefined): Promise<{
        content: KeyValues<V>;
        version: number;
    }>;
    delete(key: string): Promise<{
        content: KeyValues<V>;
        version: number;
    }>;
    truncate(): Promise<void>;
    read(): Promise<Versioned<KeyValues<V>>>;
    edit(modifier: (input: KeyValues<V>) => KeyValues<V>): Promise<{
        content: KeyValues<V>;
        version: number;
    }>;
    view<U>(selector: (input: KeyValues<V>) => U): Promise<U>;
    private ensureDocument;
}
export {};
