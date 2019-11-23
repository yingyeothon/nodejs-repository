import { testRedis } from ".";

interface ISession {
  id: string;
  expiresIn: number;
}

testRedis("get-set", async repo => {
  const key = "test-key-1";
  const value: ISession = {
    id: "tester",
    expiresIn: 600
  };

  const maybeNull = await repo.get<ISession>(key);
  expect(maybeNull).toBeNull();

  await repo.set(key, value);
  const maybeSession = await repo.get<ISession>(key);
  expect(maybeSession).toEqual(value);

  await repo.delete(key);
  const deleted = await repo.get<ISession>(key);
  expect(deleted).toBeNull();
});

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

testRedis("set-with-expire", async repo => {
  const key = "test-key-2";
  const value: ISession = {
    id: "tester",
    expiresIn: 600
  };

  const maybeNull = await repo.get<ISession>(key);
  expect(maybeNull).toBeNull();

  const ttl = 50;
  await repo.setWithExpire(key, value, ttl);
  const maybeSession = await repo.get<ISession>(key);
  expect(maybeSession).toEqual(value);

  await sleep(ttl + 1);
  const maybeExpired = await repo.get<ISession>(key);
  expect(maybeExpired).toBeNull();
});
