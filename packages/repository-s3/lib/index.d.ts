import { ICodec } from "@yingyeothon/codec";
import { SimpleRepository } from "@yingyeothon/repository";
import { S3 } from "aws-sdk";
interface IS3RepositoryArguments {
    bucketName: string;
    s3?: S3;
    prefix?: string;
    codec?: ICodec<string>;
}
export declare class S3Repository extends SimpleRepository {
    private readonly bucketName;
    private readonly s3;
    private readonly prefix;
    private readonly codec;
    constructor({ bucketName, s3, prefix, codec }: IS3RepositoryArguments);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    withPrefix(prefix: string): S3Repository;
    private asS3Key;
}
export {};
