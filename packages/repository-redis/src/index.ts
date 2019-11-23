import { ICodec, JsonCodec } from "@yingyeothon/codec";
import {
  IExpirableRepository,
  SimpleRepository
} from "@yingyeothon/repository";
import * as IORedis from "ioredis";

interface IRedisRepositoryArguments {
  redis: IORedis.Redis;
  prefix: string;
  codec: ICodec<string>;
}

export class RedisRepository extends SimpleRepository
  implements IExpirableRepository {
  private readonly redis: IORedis.Redis;
  private readonly prefix: string;
  private readonly codec: ICodec<string>;

  constructor({
    redis,
    prefix,
    codec
  }: Partial<IRedisRepositoryArguments> = {}) {
    super();
    this.redis = redis || new IORedis();
    this.codec = codec || new JsonCodec();
    this.prefix = prefix;
  }

  public async get<T>(key: string) {
    try {
      return this.codec.decode<T>(await this.redis.get(this.asRedisKey(key)));
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async set<T>(key: string, value: T) {
    if (value === undefined) {
      return this.delete(key);
    }
    await this.redis.set(this.asRedisKey(key), this.codec.encode(value));
  }

  public async setWithExpire<T>(
    key: string,
    value: T,
    expiresInMillis: number
  ) {
    if (value === undefined) {
      return this.delete(key);
    }
    if (expiresInMillis <= 0) {
      throw new Error('"expiresInMillis" should be greater than 0.');
    } else if (expiresInMillis % 1000 === 0) {
      await this.redis.setex(
        this.asRedisKey(key),
        Math.floor(expiresInMillis / 1000),
        this.codec.encode(value)
      );
    } else {
      await this.redis.set(this.asRedisKey(key), this.codec.encode(value));
      await this.redis.pexpire(this.asRedisKey(key), expiresInMillis);
    }
  }

  public async delete(key: string) {
    await this.redis.del(this.asRedisKey(key));
  }

  public withPrefix(prefix: string) {
    return new RedisRepository({
      redis: this.redis,
      prefix,
      codec: this.codec
    });
  }

  private asRedisKey(key: string) {
    return this.prefix ? `repo:${this.prefix}:${key}` : `repo:${key}`;
  }
}
