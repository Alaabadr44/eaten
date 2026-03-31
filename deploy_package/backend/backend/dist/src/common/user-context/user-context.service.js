"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
let UserContextService = class UserContextService {
    storage = new async_hooks_1.AsyncLocalStorage();
    run(store, callback) {
        return this.storage.run(store, callback);
    }
    set(key, value) {
        const store = this.storage.getStore();
        if (store) {
            store.set(key, value);
        }
    }
    get(key) {
        const store = this.storage.getStore();
        return store ? store.get(key) : undefined;
    }
    get userId() {
        return this.get('userId');
    }
};
exports.UserContextService = UserContextService;
exports.UserContextService = UserContextService = __decorate([
    (0, common_1.Injectable)()
], UserContextService);
//# sourceMappingURL=user-context.service.js.map