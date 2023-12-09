import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/constant';
import { PERMISSIONS_KEY } from '../decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.getAllAndOverride<Permissions[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!permissions) {
            return true;
        }
        if (permissions && permissions.includes(Permissions.Anonymous)) {
            return true;
        }
        const baseGuardResult = await super.canActivate(context);
        if (!permissions.length) {
            return true;
        }
        if (baseGuardResult) {
            const { user } = context.switchToHttp().getRequest();
            if (user.permissions.includes("SuperAdmin")) {
                return true
            } else {
                const validPermission = permissions.some((permission) => user.permissions.indexOf(permission) >= 0)
                if (validPermission) {
                    return true
                }
            }
        }
        return false
    }
}