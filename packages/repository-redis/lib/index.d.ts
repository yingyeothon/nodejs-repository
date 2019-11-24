import { ICodec } from "@yingyeothon/codec";
import { IExpirableRepository, SimpleRepository } from "@yingyeothon/repository";
import * as IORedis from "ioredis";
interface IRedisRepositoryArguments {
    redis: IORedis.Redis;
    prefix: string;
    codec: ICodec<string>;
}
export declare class RedisRepository extends SimpleRepository implements IExpirableRepository {
    private readonly redis;
    private readonly prefix;
    private readonly codec;
    constructor({ redis, prefix, codec }?: Partial<IRedisRepositoryArguments>);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    setWithExpire<T>(key: string, value: T, expiresInMillis: number): Promise<void>;
    delete(key: string): Promise<void>;
    withPrefix(prefix: string): RedisRepository;
    private asRedisKey;
}
export {};
