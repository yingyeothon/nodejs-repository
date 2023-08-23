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
exports.RedisRepository = void 0;
const codec_1 = require("@yingyeothon/codec");
const repository_1 = require("@yingyeothon/repository");
const del_1 = require("@yingyeothon/naive-redis/lib/del");
const get_1 = require("@yingyeothon/naive-redis/lib/get");
const set_1 = require("@yingyeothon/naive-redis/lib/set");
class RedisRepository extends repository_1.SimpleRepository {
    constructor({ redisConnection, prefix, codec }) {
        super();
        this.redisConnection = redisConnection;
        this.codec = codec || new codec_1.JsonCodec();
        this.prefix = prefix || "";
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield (0, get_1.default)(this.redisConnection, this.asRedisKey(key));
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
            yield (0, set_1.default)(this.redisConnection, this.asRedisKey(key), this.codec.encode(value));
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
            yield (0, set_1.default)(this.redisConnection, this.asRedisKey(key), this.codec.encode(value), {
                expirationMillis: expiresInMillis,
            });
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, del_1.default)(this.redisConnection, this.asRedisKey(key));
        });
    }
    withPrefix(prefix) {
        return new RedisRepository({
            redisConnection: this.redisConnection,
            prefix,
            codec: this.codec,
        });
    }
    asRedisKey(key) {
        return this.prefix ? `repo:${this.prefix}:${key}` : `repo:${key}`;
    }
}
exports.RedisRepository = RedisRepository;
//# sourceMappingURL=index.js.map