import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles) {
      return true;
    }

    const hasRole = () =>
      user.roles.some((role) => !!roles.find((item) => item === role.name));

    return user && user.roles && hasRole();
  }
}
