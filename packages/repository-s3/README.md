# Repository using AWS S3

An implementation of `IRepository` interface using AWS S3.

## Usage

```typescript
import { S3Repository } from "@yingyeothon/repository-s3";

interface IUser {
  name: string;
  hp: number;
  x: number;
  y: number;
}

const s3 = new S3Repository({
  bucketName: process.env.BUCKET_NAME,
  prefix: "__users__/"
});

const moveUser = async (userId: string, dx: number, dy: number) => {
  const user = await s3.get<IUser>(userId);
  user.x += dx;
  user.y += dy;
  await s3.set(userId, user);
};
```

It also supports `ListDocument` and `MapDocument`, too.

```typescript
interface IServer {
  ipAddress: string;
  hostName: string;
  lastAlive: number;
}

const s3 = new S3Repository({
  bucketName: process.env.BUCKET_NAME,
  prefix: "__meta__/"
});
const servers = s3.getMapDocument<IServer>("servers");

const addServer = async (ipAddress: string, server: IServer) => {
  await servers.insertOrUpdate(ipADdress, server);
};

const listServers = async (): { [ipAddress: string]: IServer } => {
  /*
   * interface IVersioned<T> {
   *   content: T;
   *   version: number;
   * }
   */
  const versioned = await servers.read();
  return versioned.content;
};
```

## License

MIT
