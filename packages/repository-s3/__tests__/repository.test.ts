import { S3Repository } from "..";

interface IMessage {
  payload: {
    value1: number;
    value2: string;
  };
}

test("repository-s3", async () => {
  if (!process.env.AWS_PROFILE || !process.env.TEST_BUCKET) {
    console.log(`No test env: AWS_PROFILE, TEST_BUCKET`);
    return;
  }
  const s3 = new S3Repository({
    bucketName: process.env.TEST_BUCKET,
    prefix: "__test__/"
  });

  const key = "hello";
  const message: IMessage = {
    payload: {
      value1: 100,
      value2: "typescript"
    }
  };
  expect(await s3.get<IMessage>(key)).toBeFalsy();

  await s3.set(key, message);
  expect(await s3.get<IMessage>(key)).toEqual(message);

  await s3.delete(key);
  expect(await s3.get<IMessage>(key)).toBeFalsy();
});
