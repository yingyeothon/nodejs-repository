"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("./document");
class SimpleRepository {
    getListDocument(key) {
        return new document_1.ListDocument(this, key);
    }
    getMapDocument(key) {
        return new document_1.MapDocument(this, key);
    }
}
exports.SimpleRepository = SimpleRepository;
//# sourceMappingURL=repository.js.map