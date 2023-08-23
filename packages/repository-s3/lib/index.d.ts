import { Codec } from "@yingyeothon/codec";
import { S3 } from "@aws-sdk/client-s3";
import { SimpleRepository } from "@yingyeothon/repository";
interface S3RepositoryArguments {
    bucketName: string;
    s3?: S3;
    prefix?: string;
    codec?: Codec<string>;
}
export declare class S3Repository extends SimpleRepository {
    private readonly bucketName;
    private readonly s3;
    private readonly prefix;
    private readonly codec;
    constructor({ bucketName, s3, prefix, codec }: S3RepositoryArguments);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    withPrefix(prefix: string): S3Repository;
    private asS3Key;
}
export {};
