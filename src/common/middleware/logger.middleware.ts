import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";

    res.on("close", () => {
      const contentLength = res.get("content-length");

      this.logger.log(
        `${method} ${originalUrl} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
