# NodeJS Repository abstractions for Yingyeothon

A bundle of simple repository libraries for [yingyeothon](https://yyt.life)'s infrastructure.

## List-up

Many of things would be deployed to [npmjs](https://www.npmjs.com/org/yingyeothon).

- [Repository interface](packages/repository)
- [Repository using AWS S3](packages/repository-s3)
- [Repository using Redis](packages/repository-redis)

## Development

It uses [`pnpm`](https://github.com/pnpm/pnpm) to manage multiple packages.

### Create a new

- Execute `create` command and copy `tsconfig.json` file from any other project.

```bash
mkdir -p packages/new-package
cd packages/new-package
pnpm init
cp ../codec/tsconfig.json .
ln -s ../../.eslint* .
cp ../../jest.config.js .
```

- Fill `package.json` file referencing any other project. Should fill up `typings`, `publishConfig` and `scripts.[tsc, build, test]`.

### Write a code and build

Please use `pnpm build` in the specific package directory.

### Test

Write some test codes that import a library from JavaScript that built by `tsc`. Run `pnpm test`.

### Use other packages

We can use `pnpm add @yingyeothon/package-name` to add a dependency. Please leave its version as `*` to use the latest version.

### Publish

- Check if its `README.md` is proper.
- Check if it can build to JavaScript properly.
- Check if it passes all tests we write.
- Check the version of this package.
- `pnpm publish`.

## License

MIT
