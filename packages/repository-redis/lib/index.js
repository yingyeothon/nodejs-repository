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
const codec_1 = require("@yingyeothon/codec");
const repository_1 = require("@yingyeothon/repository");
const IORedis = require("ioredis");
class RedisRepository extends repository_1.SimpleRepository {
    constructor({ redis, prefix, codec } = {}) {
        super();
        this.redis = redis || new IORedis();
        this.codec = codec || new codec_1.JsonCodec();
        this.prefix = prefix || "";
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield this.redis.get(this.asRedisKey(key));
                if (!value) {
                    return undefined;
                }
                return this.codec.decode(value);
            }
            catch (error) {
                console.error(error);
                return undefined;
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value === undefined) {
                return this.delete(key);
            }
            yield this.redis.set(this.asRedisKey(key), this.codec.encode(value));
        });
    }
    setWithExpire(key, value, expiresInMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value === undefined) {
                return this.delete(key);
            }
            if (expiresInMillis <= 0) {
                throw new Error('"expiresInMillis" should be greater than 0.');
            }
            else if (expiresInMillis % 1000 === 0) {
                yield this.redis.setex(this.asRedisKey(key), Math.floor(expiresInMillis / 1000), this.codec.encode(value));
            }
            else {
                yield this.redis.set(this.asRedisKey(key), this.codec.encode(value));
                yield this.redis.pexpire(this.asRedisKey(key), expiresInMillis);
            }
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.del(this.asRedisKey(key));
        });
    }
    withPrefix(prefix) {
        return new RedisRepository({
            redis: this.redis,
            prefix,
            codec: this.codec
        });
    }
    asRedisKey(key) {
        return this.prefix ? `repo:${this.prefix}:${key}` : `repo:${key}`;
    }
}
exports.RedisRepository = RedisRepository;
//# sourceMappingURL=index.js.map