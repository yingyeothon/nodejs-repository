import { Repository } from "..";
import { Versioned } from "./versioned";
export type Values<V> = V[];
export declare class ListDocument<V = string> {
    private readonly repository;
    private readonly tupleKey;
    constructor(repository: Repository, tupleKey: string);
    insert(value: V): Promise<{
        content: V[];
        version: number;
    }>;
    deleteIf(filter: (input: V) => boolean): Promise<{
        content: V[];
        version: number;
    }>;
    truncate(): Promise<void>;
    read(): Promise<Versioned<Values<V>>>;
    edit(modifier: (input: V[]) => V[]): Promise<{
        content: V[];
        version: number;
    }>;
    view<U>(selector: (input: V[]) => U): Promise<U>;
    private ensureDocument;
}
