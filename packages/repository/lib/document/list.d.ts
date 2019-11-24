import { IRepository } from "..";
import { IVersioned } from "./versioned";
export declare type IValues<V> = V[];
export declare class ListDocument<V = string> {
    private readonly repository;
    private readonly tupleKey;
    constructor(repository: IRepository, tupleKey: string);
    insert(value: V): Promise<{
        content: V[];
        version: number;
    }>;
    deleteIf(filter: (input: V) => boolean): Promise<{
        content: V[];
        version: number;
    }>;
    truncate(): Promise<void>;
    read(): Promise<IVersioned<IValues<V>>>;
    edit(modifier: (input: V[]) => V[]): Promise<{
        content: V[];
        version: number;
    }>;
    view<U>(selector: (input: V[]) => U): Promise<U>;
    private ensureDocument;
}
