# Repository layer

An abstraction layer for repository and document.

## Usage

It provides simple needed methods for repository like `get`, `set` and `delete` so we can write general codes working with this persistent features like this.

```typescript
import { IRepository } from "@yingyeothon/repository";

interface ICredential {
  id: string;
  pw: string;
}

export class Authorizer {
  constructor(private readonly repo: IRepository) {}

  public async login(id: string, pw: string) {
    const tuple = await this.repo.get<ICredential>(id);
    return tuple && tuple.pw === pw;
  }
}
```

It provides the only interface so please use actual implementation like `@yingyeothon/repository-s3`.

```typescript
import { S3Repository } from "@yingyeothon/repository-s3";

const authorizer = new Authorizer(
  new S3Repository({
    bucketName: process.env.BUCKET_NAME,
    prefix: "__credential__/"
  })
);
```

## License

MIT
