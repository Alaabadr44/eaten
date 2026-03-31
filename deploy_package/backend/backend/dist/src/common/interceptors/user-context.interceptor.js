"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const user_context_service_1 = require("../user-context/user-context.service");
let UserContextInterceptor = class UserContextInterceptor {
    userContextService;
    constructor(userContextService) {
        this.userContextService = userContextService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const store = new Map();
        if (user && user.userId) {
            store.set('userId', user.userId);
        }
        return new rxjs_1.Observable((subscriber) => {
            this.userContextService.run(store, () => {
                next.handle().subscribe(subscriber);
            });
        });
    }
};
exports.UserContextInterceptor = UserContextInterceptor;
exports.UserContextInterceptor = UserContextInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_service_1.UserContextService])
], UserContextInterceptor);
//# sourceMappingURL=user-context.interceptor.js.map