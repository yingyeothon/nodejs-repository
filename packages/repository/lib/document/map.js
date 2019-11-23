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
class MapDocument {
    constructor(repository, tupleKey) {
        this.repository = repository;
        this.tupleKey = tupleKey;
    }
    insertOrUpdate(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.edit(values => (Object.assign({}, values, { [key]: value })));
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.insertOrUpdate(key, undefined);
        });
    }
    truncate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.delete(this.tupleKey);
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const actual = yield this.repository.get(this.tupleKey);
            return this.ensureDocument(actual);
        });
    }
    edit(modifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.read();
            const newDoc = {
                content: modifier(doc.content),
                version: doc.version + 1
            };
            yield this.repository.set(this.tupleKey, newDoc);
            return newDoc;
        });
    }
    view(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return selector((yield this.read()).content);
        });
    }
    ensureDocument(doc) {
        const version = doc && doc.version ? doc.version : 0;
        const content = doc && doc.content ? doc.content : {};
        return { version, content };
    }
}
exports.MapDocument = MapDocument;
//# sourceMappingURL=map.js.map