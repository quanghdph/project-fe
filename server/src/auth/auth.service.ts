import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IResponse, JwtPayload } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { users } from '@prisma/client';
import { LoginDto, RegisterDto } from './dto';
import * as argon2 from 'argon2';

type Tokens = {
    access_token: string;
    refresh_token: string;
};

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    public async registerAdministrator(input: RegisterDto): Promise<IResponse<users>> {
        try {
            const {
                active,
                date_of_birth,
                email,
                first_name,
                gender,
                last_name,
                password,
                phone,
            } = input;
            const isExistingUser = await this.prisma.users.findUnique({
                where: { email },
            });
            if (isExistingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicated email!',
                    fieldError: 'email',
                };
            }
            const hashedPassword = await argon2.hash(password);
            const user = await this.prisma.users.create({
                data: {
                    email,
                    phone,
                    date_of_birth,
                    first_name,
                    gender,
                    last_name,
                    password: hashedPassword,
                    active,
                },
            });
            delete user.password
            delete user.hashed_rt
            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return {
                code: 200,
                success: true,
                message: 'Success!',
                ...tokens,
                data: user
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async logout(userId: number): Promise<IResponse<{}>> {
        try {
            await this.prisma.users.updateMany({
                where: {
                    id: userId,
                    hashed_rt: {
                        not: null,
                    },
                },
                data: {
                    hashed_rt: null,
                },
            });
            return {
                code: 200,
                message: "Logout successfully!",
                success: true,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }

    }

    public async login(input: LoginDto): Promise<IResponse<users>> {
        try {
            const { email, password } = input;
            const user = await this.prisma.users.findUnique({
                where: { email: email },
                include: {
                    address: true,
                    users_role: {
                        include: {
                            role: true
                        }
                    }
                }
            })
            if (!user) {
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong email!',
                    fieldError: 'email'
                }
            }
            const isPasswordValid = await argon2.verify(user.password, password);
            if (!isPasswordValid) {
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password!',
                    fieldError: 'password'
                }
            }
            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);
            delete user.password
            delete user.hashed_rt
            return {
                code: 200,
                success: true,
                message: 'Success!',
                ...tokens,
                data: user
            };
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    async refreshTokens(userId: number, rt: string): Promise<IResponse<{}>> {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                },
            })
            if (!user || !user.hashed_rt) {
                return {
                    code: 400,
                    success: false,
                    message: "Access Denied!"
                }
            }
            const rtMatches = await argon2.verify(user.hashed_rt, rt);
            if (!rtMatches) {
                return {
                    code: 400,
                    success: false,
                    message: "Access Denied!"
                }
            }
            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return {
                code: 200,
                success: true,
                message: 'Success!',
                ...tokens,
            };
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async registerCustomer(input: RegisterDto): Promise<IResponse<users>> {
        try {
            const {
                active,
                date_of_birth,
                email,
                first_name,
                gender,
                last_name,
                password,
                phone,
            } = input;
            const [isExistingUser, customerRole] = await Promise.all([
                await this.prisma.users.findUnique({
                    where: { email },
                }),
                await this.prisma.role.findUnique({ where: { role_code: 'customer' } })
            ])

            if (isExistingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicated email!',
                    fieldError: 'email',
                };
            }
            const hashedPassword = await argon2.hash(password);
            const customer = await this.prisma.users.create({
                data: {
                    email,
                    ...(phone && { phone }),
                    ...date_of_birth && { date_of_birth },
                    ...first_name && { first_name },
                    gender,
                    ...last_name && { last_name },
                    password: hashedPassword,
                    active,
                    users_role: {
                        createMany: {
                            data: [{ role_id: customerRole.id }]
                        }
                    }

                },
            });
            delete customer.password
            const tokens = await this.getTokens(customer.id, customer.email);
            await this.updateRtHash(customer.id, tokens.refresh_token);
            return {
                code: 200,
                success: true,
                message: 'Success!',
                ...tokens,
                data: customer
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    private async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await argon2.hash(rt);
        await this.prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                hashed_rt: hash,
            },
        });
    }

    private async getTokens(userId: number, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            userId,
            email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '7d',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    public async me(userId: number): Promise<IResponse<users>> {
        try {
            const me = await this.prisma.users.findUnique({
                where: { id: userId },
                include: {
                    address: true
                }
            })
            delete me.password
            delete me.hashed_rt
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: me
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }
}
