import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/types';
import { role } from '@prisma/client';
import { RoleCreateDto, RoleUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class RoleService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async create(input: RoleCreateDto): Promise<IResponse<role>> {
        try {
            const { role_code, role_name, description, permissions } = input;
            const isRoleCodeExist = await this.prisma.role.findUnique({
                where: { role_code },
            });
            if (isRoleCodeExist) {
                return {
                    code: 400,
                    success: false,
                    message: 'Role code already exist!',
                    fieldError: "role_code",
                };
            }
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: await this.prisma.role.create({
                    data: {
                        role_code,
                        role_name,
                        description,
                        permissions
                    }
                })
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async delete(id: number): Promise<IResponse<role>> {
        try {
            const role = await this.prisma.role.findUnique({
                where: { id }
            })
            if (role) {
                if (role.role_code === "customer" || role.role_code === "superadmin") {
                    return {
                        code: 400,
                        message: 'You cannot perform this action!',
                        success: false,
                    }
                }
                await this.prisma.users_role.deleteMany({
                    where: { role_id: id }
                })
                return {
                    code: 200,
                    message: 'Delete successfully!',
                    success: true,
                    data: await this.prisma.role.delete({ where: { id } })
                }

            }
            return {
                code: 404,
                message: 'Role does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }

    }

    public async role(id: number): Promise<IResponse<role>> {
        try {
            const role = await this.prisma.role.findUnique({
                where: { id }
            })
            if (role) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: role
                }
            }
            return {
                code: 404,
                message: 'Role does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async roles(input: PaginationDto): Promise<IResponse<{ roles: role[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take } = input;
        const [totalRecord, roles] = await this.prisma.$transaction([
            this.prisma.role.count(),
            this.prisma.role.findMany({
                take: take || 10,
                skip: skip || 0,
            }),
        ])
        return {
            code: 200,
            success: true,
            message: "Success!",
            data: {
                roles,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }

    public async update(id: number, input: RoleUpdateDto): Promise<IResponse<role>> {
        try {
            const { description, permissions, role_code, role_name } = input;
            const role = await this.prisma.role.findUnique({
                where: { id }
            })
            if (role) {
                if (role_code) {
                    const isRoleCodeExist = await this.prisma.role.findFirst({
                        where: {
                            AND: [
                                { role_code },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        },
                    })
                    if (isRoleCodeExist) {
                        return {
                            code: 400,
                            success: false,
                            message: 'Role code already exist!',
                            fieldError: "role_code",
                        }
                    }
                }
                return {
                    code: 200,
                    success: true,
                    message: 'Success!',
                    data: await this.prisma.role.update({
                        where: { id },
                        data: {
                            ...role_code && { role_code },
                            ...role_name && { role_name },
                            ...description && { description },
                            ...permissions && { permissions }
                        },
                    })
                }
            }
            return {
                code: 400,
                message: 'Role does not exist in the system!',
                success: false,
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