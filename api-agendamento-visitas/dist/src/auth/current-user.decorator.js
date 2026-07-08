"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        id: parseInt(request.headers['x-user-id'], 10) || 0,
        email: request.headers['x-user-email'] || '',
        role: request.headers['x-user-role'] || '',
    };
});
//# sourceMappingURL=current-user.decorator.js.map