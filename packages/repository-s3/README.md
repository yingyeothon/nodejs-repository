# Repository using AWS S3

An implementation of `IRepository` interface using AWS S3.

## Usage

```typescript
import { S3Repository } from "@yingyeothon/repository-s3";

interface User {
  name: string;
  hp: number;
  x: number;
  y: number;
}

const s3 = new S3Repository({
  bucketName: process.env.BUCKET_NAME,
  prefix: "__users__/",
});

const moveUser = async (userId: string, dx: number, dy: number) => {
  const user = await s3.get<User>(userId);
  user.x += dx;
  user.y += dy;
  await s3.set(userId, user);
};
```

It also supports `ListDocument` and `MapDocument`, too.

```typescript
interface Server {
  ipAddress: string;
  hostName: string;
  lastAlive: number;
}

const s3 = new S3Repository({
  bucketName: process.env.BUCKET_NAME,
  prefix: "__meta__/",
});
const servers = s3.getMapDocument<Server>("servers");

const addServer = async (ipAddress: string, server: Server) => {
  await servers.insertOrUpdate(ipADdress, server);
};

const listServers = async (): { [ipAddress: string]: Server } => {
  /*
   * interface Versioned<T> {
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
