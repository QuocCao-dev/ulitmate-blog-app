import { Injectable, NestMiddleware } from '@nestjs/common';
import { type User } from '@prisma/client';
import { type NextFunction, type Request, type Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { verifyJwt } from 'src/users/utils';

type RequestWithUser = Request & { user: null | User };

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const [, token] = req.headers.authorization.split(' ');

    try {
      const decoded = verifyJwt(token);
      const user = await this.userService.findUserById(decoded.userId);

      req.user = user;
    } catch (error) {
      req.user = null;
    } finally {
      next();
    }
  }
}
