import redisConnect, {
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

import { RedisRepository } from "..";

const isRedisNotSupported = () =>
  !process.env.TEST_REDIS_PORT || !process.env.TEST_REDIS_HOST;

const redisWork = async (cb: (redis: RedisConnection) => Promise<any>) => {
  if (isRedisNotSupported()) {
    console.log(`No test env: TEST_REDIS_PORT, TEST_REDIS_HOST`);
    return;
  }
  const connection = redisConnect({
    host: process.env.TEST_REDIS_HOST!,
    port: +process.env.TEST_REDIS_PORT!,
  });
  try {
    await cb(connection);
  } finally {
    connection.socket.disconnect();
  }
};

export const testRedis = (
  name: string,
  cb: (repository: RedisRepository) => Promise<any>
) => {
  if (isRedisNotSupported()) {
    // A dummy test to ignore jest errors.
    test(name, () => expect(true).toEqual(true));
    return;
  }
  test(name, async () => {
    await redisWork((redisConnection) =>
      cb(new RedisRepository({ redisConnection }))
    );
  });
};
