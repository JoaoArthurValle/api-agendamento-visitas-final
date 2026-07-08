import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserType = {
  id: number;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest();
    return {
      id: parseInt(request.headers['x-user-id'], 10) || 0,
      email: request.headers['x-user-email'] || '',
      role: request.headers['x-user-role'] || '',
    };
  },
);
