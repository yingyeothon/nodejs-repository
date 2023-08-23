import { Codec } from "@yingyeothon/codec";
import { ExpirableRepository, SimpleRepository } from "@yingyeothon/repository";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
interface RedisRepositoryArguments {
    redisConnection: RedisConnection;
    prefix?: string;
    codec?: Codec<string>;
}
export declare class RedisRepository extends SimpleRepository implements ExpirableRepository {
    private readonly redisConnection;
    private readonly prefix;
    private readonly codec;
    constructor({ redisConnection, prefix, codec }: RedisRepositoryArguments);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    setWithExpire<T>(key: string, value: T, expiresInMillis: number): Promise<void>;
    delete(key: string): Promise<void>;
    withPrefix(prefix: string): RedisRepository;
    private asRedisKey;
}
export {};
