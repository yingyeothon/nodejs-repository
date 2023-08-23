import { Codec, JsonCodec } from "@yingyeothon/codec";
import { ExpirableRepository, SimpleRepository } from "@yingyeothon/repository";

import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisDel from "@yingyeothon/naive-redis/lib/del";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisSet from "@yingyeothon/naive-redis/lib/set";

interface RedisRepositoryArguments {
  redisConnection: RedisConnection;
  prefix?: string;
  codec?: Codec<string>;
}

export class RedisRepository
  extends SimpleRepository
  implements ExpirableRepository
{
  private readonly redisConnection: RedisConnection;
  private readonly prefix: string;
  private readonly codec: Codec<string>;

  constructor({ redisConnection, prefix, codec }: RedisRepositoryArguments) {
    super();
    this.redisConnection = redisConnection;
    this.codec = codec || new JsonCodec();
    this.prefix = prefix || "";
  }

  public async get<T>(key: string) {
    try {
      const value = await redisGet(this.redisConnection, this.asRedisKey(key));
      if (!value) {
        return undefined;
      }
      return this.codec.decode<T>(value);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async set<T>(key: string, value: T) {
    if (value === undefined) {
      return this.delete(key);
    }
    await redisSet(
      this.redisConnection,
      this.asRedisKey(key),
      this.codec.encode(value)
    );
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
    }
    await redisSet(
      this.redisConnection,
      this.asRedisKey(key),
      this.codec.encode(value),
      {
        expirationMillis: expiresInMillis,
      }
    );
  }

  public async delete(key: string) {
    await redisDel(this.redisConnection, this.asRedisKey(key));
  }

  public withPrefix(prefix: string) {
    return new RedisRepository({
      redisConnection: this.redisConnection,
      prefix,
      codec: this.codec,
    });
  }

  private asRedisKey(key: string) {
    return this.prefix ? `repo:${this.prefix}:${key}` : `repo:${key}`;
  }
}
