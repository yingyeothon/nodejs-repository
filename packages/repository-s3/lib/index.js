"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Repository = void 0;
const codec_1 = require("@yingyeothon/codec");
const client_s3_1 = require("@aws-sdk/client-s3");
const repository_1 = require("@yingyeothon/repository");
class S3Repository extends repository_1.SimpleRepository {
    constructor({ bucketName, s3, prefix, codec }) {
        super();
        this.bucketName = bucketName;
        this.s3 = s3 || new client_s3_1.S3();
        this.prefix = prefix || "";
        this.codec = codec || new codec_1.JsonCodec();
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield this.s3.getObject({
                    Bucket: this.bucketName,
                    Key: this.asS3Key(key),
                });
                if (!content || !content.Body) {
                    return undefined;
                }
                const encoded = yield content.Body.transformToString("utf-8");
                return this.codec.decode(encoded);
            }
            catch (error) {
                if (!/The specified key does not exist./.test(error.message)) {
                    throw error;
                }
            }
            return undefined;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value === undefined) {
                return this.delete(key);
            }
            yield this.s3.putObject({
                Bucket: this.bucketName,
                Key: this.asS3Key(key),
                Body: this.codec.encode(value),
            });
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.s3.deleteObject({
                Bucket: this.bucketName,
                Key: this.asS3Key(key),
            });
        });
    }
    withPrefix(prefix) {
        return new S3Repository({
            bucketName: this.bucketName,
            s3: this.s3,
            prefix,
            codec: this.codec,
        });
    }
    asS3Key(key) {
        return this.prefix ? `${this.prefix}${key}` : key;
    }
}
exports.S3Repository = S3Repository;
//# sourceMappingURL=index.js.map