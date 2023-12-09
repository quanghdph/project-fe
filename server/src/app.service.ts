import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { superadminPermissions, userPermissions } from './constant';
import { role } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async onApplicationBootstrap() {
        // ** ur - user role, sar - superadmin role
        const [cr, sar, superadmin] = await Promise.all([
            this.prisma.role.findUnique({
                where: { role_code: "customer" }
            }),
            this.prisma.role.findUnique({
                where: { role_code: "superadmin" }
            }),
            this.prisma.users.findUnique({
                where: { email: "superadmin@gmail.com" },
                include: {
                    users_role: {
                        select: {
                            role_id: true
                        }
                    }
                }
            })
        ])
        if (!cr) {
            await this.createCustomerRole(false)
        }
        if (!sar && !superadmin) {
            const role = await this.createSuperadminRole(true) as role
            await this.prisma.users.create({
                data: {
                    email: "superadmin@gmail.com",
                    first_name: "super",
                    last_name: "admin",
                    active: true,
                    password: await argon2.hash("superadmin"),
                    users_role: {
                        createMany: {
                            data: [{ role_id: role.id }]
                        }
                    }
                }
            })
        }
        if (!sar && superadmin) {
            const role = await this.createSuperadminRole(true) as role
            // ** Delete all roles of user before
            await this.prisma.users.update({
                where: { id: superadmin.id },
                data: {
                    users_role: {
                        deleteMany: superadmin?.users_role.map((role) => {
                            return {
                                role_id: role.role_id
                            }
                        })
                    }
                }
            })
            // ** assign new roles for this user
            await this.prisma.users.update({
                where: { id: superadmin.id },
                data: {
                    users_role: {
                        createMany: {
                            data: [{ role_id: role.id }]
                        }
                    }
                }
            })
        }
        if (sar && !superadmin) {
            await this.prisma.users.create({
                data: {
                    email: "superadmin@gmail.com",
                    first_name: "super",
                    last_name: "admin",
                    active: true,
                    password: await argon2.hash("superadmin"),
                    users_role: {
                        createMany: {
                            data: [{ role_id: sar.id }]
                        }
                    }
                }
            })
        }
        if (sar && superadmin) {
            // ** Delete all roles of user before
            await this.prisma.users.update({
                where: { id: superadmin.id },
                data: {
                    users_role: {
                        deleteMany: superadmin?.users_role.map((role) => {
                            return {
                                role_id: role.role_id
                            }
                        })
                    }
                }
            })
            // ** assign new roles for this user
            await this.prisma.users.update({
                where: { id: superadmin.id },
                data: {
                    users_role: {
                        createMany: {
                            data: [{ role_id: sar.id }]
                        }
                    }
                }
            })
        }
    }

    private async createCustomerRole(isReturn: boolean): Promise<void | role> {
        try {
            const role = await this.prisma.role.create({
                data: {
                    role_code: "customer",
                    role_name: "Customer",
                    description: "customer",
                    permissions: userPermissions
                }
            })
            if (isReturn) {
                return role
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async createSuperadminRole(isReturn: boolean): Promise<void | role> {
        try {
            const role = await this.prisma.role.create({
                data: {
                    role_code: "superadmin",
                    role_name: "superadmin",
                    description: "superadmin",
                    permissions: superadminPermissions
                }
            })
            if (isReturn) {
                return role
            }
        } catch (error) {
            console.log(error);
        }
    }

}
