# Repository using Redis

An implementation of `IRepository` interface using Redis.

## Usage

This is a simple example that manages a login session with Redis.

```typescript
import redisConnect from "@yingyeothon/naive-redis/lib/connect";
import { RedisRepository } from "@yingyeothon/repository-redis";

interface Session {
  id: string;
  expiredAt: number;
}

const redis = new RedisRepository({
  redisConnection: redisConnect({
    host: redisHost,
    post: redisPort,
    password: redisPassword,
  }),
  prefix: "session:",
});

const login = async (id: string, pw: string) => {
  // Check if the credential is correct.
  const expiredAt = Date.now() + 30 * 60 * 1000;
  const session: Session = {
    id,
    expiredAt,
  };
  const sessionId = hash(session, salt);
  await redis.set(sessionId, session);

  // Or we can use "setWithExpire" function instead.
  // await redis.setWithExpire(sessionId, session, 30 * 60 * 1000);
  return sessionId;
};

const authorize = async (sessionId: string) => {
  const session = await redis.get<Session>(sessionId);
  return session && session.expiredAt >= Date.now();
};
```

## License

MIT
