import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtConstants } from "../../auth/constants";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConstants.secret);
        req["user"] = decoded;
      } catch (error) {
        throw new UnauthorizedException("Invalid Token");
      }
    }
    next();
  }
}
