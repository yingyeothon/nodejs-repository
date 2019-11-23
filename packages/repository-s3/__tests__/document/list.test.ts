import { S3Repository } from "../..";

interface IKeyValue {
  key: string;
  value: string;
}

test("list-doc", async () => {
  if (!process.env.AWS_PROFILE || !process.env.TEST_BUCKET) {
    console.log(`No test env: AWS_PROFILE, TEST_BUCKET`);
    return;
  }
  const s3 = new S3Repository({
    bucketName: process.env.TEST_BUCKET,
    prefix: "__test__/"
  });

  await s3.delete("list-doc");
  const listDoc = s3.getListDocument<IKeyValue>("list-doc");

  const first = { key: "hello", value: "world" };
  const second = { key: "hi", value: "world" };
  const third = { key: "hi", value: "there" };

  const empty = await listDoc.read();
  expect(empty.version).toEqual(0);
  expect(empty.content).toEqual([]);

  await listDoc.insert(first);
  const one = await listDoc.read();
  expect(one.version).toEqual(1);
  expect(one.content).toEqual([first]);

  await listDoc.insert(second);
  const two = await listDoc.read();
  expect(two.version).toEqual(2);
  expect(two.content).toEqual([first, second]);

  await listDoc.insert(third);
  const three = await listDoc.read();
  expect(three.version).toEqual(3);
  expect(three.content).toEqual([first, second, third]);

  await listDoc.deleteIf(each => each.value === "world");
  const oneAgain = await listDoc.read();
  expect(oneAgain.version).toEqual(4);
  expect(oneAgain.content).toEqual([third]);

  await listDoc.truncate();
  const emptyAgain = await listDoc.read();
  expect(emptyAgain.version).toEqual(0);
  expect(emptyAgain.content).toEqual([]);
});
