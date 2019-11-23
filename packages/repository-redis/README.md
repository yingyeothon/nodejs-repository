# Repository using Redis

An implementation of `IRepository` interface using Redis.

## Usage

This is a simple example that manages a login session with Redis.

```typescript
import * as IORedis from "ioredis";
import { RedisRepository } from "@yingyeothon/repository-redis";

interface ISession {
  id: string;
  expiredAt: number;
}

const redis = new RedisRepository({
  redis: new IORedis(redisPort, redisHost, {
    password: redisPassword
  }),
  prefix: "session:"
});

const login = async (id: string, pw: string) => {
  // Check if the credential is correct.
  const expiredAt = Date.now() + 30 * 60 * 1000;
  const session: ISession = {
    id,
    expiredAt
  };
  const sessionId = hash(session, salt);
  await redis.set(sessionId, session);

  // Or we can use "setWithExpire" function instead.
  // await redis.setWithExpire(sessionId, session, 30 * 60 * 1000);
  return sessionId;
};

const authorize = async (sessionId: string) => {
  const session = await redis.get<ISession>(sessionId);
  return session && session.expiredAt >= Date.now();
};
```

## License

MIT
