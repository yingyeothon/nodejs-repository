import { S3Repository } from "../..";

test("map-doc", async () => {
  if (!process.env.AWS_PROFILE || !process.env.TEST_BUCKET) {
    console.log(`No test env: AWS_PROFILE, TEST_BUCKET`);
    return;
  }
  const s3 = new S3Repository({
    bucketName: process.env.TEST_BUCKET,
    prefix: "__test__/"
  });

  await s3.delete("map-doc");
  const mapDoc = s3.getMapDocument<string>("map-doc");

  const empty = await mapDoc.read();
  expect(empty.version).toEqual(0);
  expect(empty.content).toEqual({});

  await mapDoc.insertOrUpdate("hello", "world");
  const one = await mapDoc.read();
  expect(one.version).toEqual(1);
  expect(one.content).toEqual({ hello: "world" });

  await mapDoc.insertOrUpdate("hi", "world");
  const two = await mapDoc.read();
  expect(two.version).toEqual(2);
  expect(two.content).toEqual({ hello: "world", hi: "world" });

  await mapDoc.insertOrUpdate("hi", "there");
  const three = await mapDoc.read();
  expect(three.version).toEqual(3);
  expect(three.content).toEqual({ hello: "world", hi: "there" });

  await mapDoc.delete("hello");
  const oneAgain = await mapDoc.read();
  expect(oneAgain.version).toEqual(4);
  expect(oneAgain.content).toEqual({ hi: "there" });

  await mapDoc.truncate();
  const emptyAgain = await mapDoc.read();
  expect(emptyAgain.version).toEqual(0);
  expect(emptyAgain.content).toEqual({});
});
