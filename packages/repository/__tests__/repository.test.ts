import { IExpirableRepository, InMemoryRepository, IRepository } from "..";

test("get-after-set", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  await mem.set(key, expected);
  expect(await mem.get(key)).toEqual(expected);
});

test("get-null-if-absent", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  expect(await mem.get(key)).toBeNull();
});

test("get-null-if-deleted", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  await mem.set(key, expected);
  expect(await mem.get(key)).toEqual(expected);

  await mem.delete(key);
  expect(await mem.get(key)).toBeNull();
});

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

test("get-null-after-expired", async () => {
  const mem: IExpirableRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  const ttl = 10;
  await mem.setWithExpire(key, expected, ttl);
  expect(await mem.get(key)).toEqual(expected);

  await sleep(ttl * 2);
  expect(await mem.get(key)).toBeNull();
});
