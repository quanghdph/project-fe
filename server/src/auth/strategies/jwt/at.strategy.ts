import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

type JwtPayload = {
    userId: number,
    email: string,
    iat: number,
    exp: number
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.users.findUnique({
            where: { id: payload.userId },
            include: {
                users_role: {
                    select: {
                        role_id: true
                    }
                }
            }
        })
        const roles = await this.prisma.role.findMany({
            where: {
                id: { in: user?.users_role.map((role) => role.role_id) },
            },
            select: {
                permissions: true
            }
        })
        return {
            ...payload,
            permissions: roles.map((role) => role.permissions).flat(1)
        }
    }
}