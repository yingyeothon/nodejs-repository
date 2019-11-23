"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
class InMemoryRepository extends repository_1.SimpleRepository {
    constructor() {
        super(...arguments);
        this.store = {};
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.store[key];
            if (!doc) {
                return null;
            }
            if (doc.expired > 0 && doc.expired < Date.now()) {
                return null;
            }
            return doc.value;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store[key] = {
                value
            };
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this.store[key];
        });
    }
    setWithExpire(key, value, expiresInMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store[key] = {
                expired: expiresInMillis > 0 ? Date.now() + expiresInMillis : 0,
                value
            };
        });
    }
}
exports.InMemoryRepository = InMemoryRepository;
//# sourceMappingURL=memory.js.map