import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRolesToUserDto, UserUpdateDto } from './dto';
import { IResponse } from 'src/common/types';
import { PaginationDto } from 'src/common/dto';
import { users } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async assignRolesToUser(userId: number, input: AssignRolesToUserDto): Promise<IResponse<{}>> {
        try {
            const { role_ids } = input
            // Need check list role exsit here
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                include: {
                    users_role: {
                        select: {
                            role_id: true
                        }
                    }
                }
            })
            if (user) {
                // ** Delete all roles of user before
                await this.prisma.users.update({
                    where: { id: userId },
                    data: {
                        users_role: {
                            deleteMany: user?.users_role.map((role) => {
                                return {
                                    role_id: role.role_id
                                }
                            })
                        }
                    }
                })
                // ** assign new roles for this user
                await this.prisma.users.update({
                    where: { id: userId },
                    data: {
                        users_role: {
                            createMany: {
                                data: role_ids.map((role_id) => {
                                    return {
                                        role_id
                                    }
                                })
                            }
                        }
                    }
                })
                return {
                    code: 200,
                    success: true,
                    message: 'Success!',
                }
            }
            return {
                code: 400,
                message: 'User does not exist in the system!',
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

    public async delete(id: number): Promise<IResponse<users>> {
        try {
            const user = await this.prisma.users.findUnique({
                where: { id }
            })
            if (user) {
                await this.prisma.users_role.deleteMany({
                    where: { user_id: id }
                })
                return {
                    code: 200,
                    message: 'Delete successfully!',
                    success: true,
                    data: await this.prisma.users.delete({ where: { id } })
                }

            }
            return {
                code: 404,
                message: 'User does not exist in the system!',
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

    /* Administrators */
    public async administrators(input: PaginationDto, userId: number): Promise<IResponse<{ administrators: Omit<users, "hashed_rt" | "password">[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search, status } = input;
            const [totalRecord, administrators] = await this.prisma.$transaction([
                this.prisma.users.count({
                    where: {
                        AND: [
                            {
                                NOT: {
                                    id: userId,
                                }
                            },
                            {
                                users_role: {
                                    every: {
                                        NOT: {
                                            role: {
                                                role_code: "customer"
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        ...search && {
                            OR: [
                                {
                                    email: {
                                        contains: search
                                    }
                                },
                                {
                                    first_name: {
                                        contains: search
                                    }
                                },
                                {
                                    last_name: {
                                        contains: search
                                    }
                                },
                                {
                                    phone: {
                                        contains: search
                                    }
                                }
                            ]
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                    },
                }),
                this.prisma.users.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        AND: [
                            {
                                NOT: {
                                    id: userId,
                                }
                            },
                            {
                                users_role: {
                                    every: {
                                        NOT: {
                                            role: {
                                                role_code: "customer"
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        ...search && {
                            OR: [
                                {
                                    email: {
                                        contains: search
                                    }
                                },
                                {
                                    first_name: {
                                        contains: search
                                    }
                                },
                                {
                                    last_name: {
                                        contains: search
                                    }
                                },
                                {
                                    phone: {
                                        contains: search
                                    }
                                }
                            ]
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                    },
                    select: {
                        email: true,
                        id: true,
                        first_name: true,
                        last_name: true,
                        gender: true,
                        date_of_birth: true,
                        phone: true,
                        active: true,
                        created_date: true,
                        modified_date: true,
                        users_role: {
                            include: {
                                role: true
                            }
                        }
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    administrators,
                    totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                    total: totalRecord,
                    skip: skip || 0,
                    take: take || 10
                }
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async administrator(id: number): Promise<IResponse<Omit<users, "hashed_rt" | "password">>> {
        try {
            const administrator = await this.prisma.users.findUnique({
                where: { id },
                select: {
                    email: true,
                    id: true,
                    first_name: true,
                    last_name: true,
                    gender: true,
                    date_of_birth: true,
                    phone: true,
                    active: true,
                    created_date: true,
                    modified_date: true,
                    users_role: {
                        select: {
                            role_id: true
                        }
                    }
                }
            })
            if (administrator) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: administrator
                }
            }
            return {
                code: 404,
                message: 'Administrator does not exist in the system!',
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

    public async updateAdministrator(id: number, input: UserUpdateDto): Promise<IResponse<Omit<users, "hashed_rt" | "password">>> {
        try {
            const { active, date_of_birth, email, first_name, gender, last_name, phone } = input;
            const administrator = await this.prisma.users.findUnique({
                where: { id }
            })
            if (administrator) {
                if (email) {
                    const isEmailExist = await this.prisma.users.findFirst({
                        where: {
                            AND: [
                                { email },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        },
                    })
                    if (isEmailExist) {
                        return {
                            code: 400,
                            success: false,
                            message: 'Email already exist!',
                            fieldError: "email",
                        }
                    }
                }
                return {
                    code: 200,
                    success: true,
                    message: 'Success!',
                    data: await this.prisma.users.update({
                        where: { id },
                        data: {
                            ...date_of_birth && { date_of_birth },
                            ...email && { email },
                            ...first_name && { first_name },
                            ...last_name && { last_name },
                            ...phone && { phone },
                            active,
                            gender,
                        },
                        select: {
                            email: true,
                            id: true,
                            first_name: true,
                            last_name: true,
                            gender: true,
                            date_of_birth: true,
                            phone: true,
                            active: true,
                            created_date: true,
                            modified_date: true,
                            users_role: {
                                select: {
                                    role_id: true
                                }
                            }
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Administrator does not exist in the system!',
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

    /* Customer */
    public async customers(input: PaginationDto): Promise<IResponse<{ customers: Omit<users, "hashed_rt" | "password">[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search, status } = input;
            const customerRole = await this.prisma.role.findUnique({
                where: { role_code: "customer" }
            })
            const [totalRecord, customers] = await this.prisma.$transaction([
                this.prisma.users.count({
                    where: {
                        ...search && {
                            OR: [
                                {
                                    email: {
                                        contains: search
                                    }
                                },
                                {
                                    first_name: {
                                        contains: search
                                    }
                                },
                                {
                                    last_name: {
                                        contains: search
                                    }
                                },
                                {
                                    phone: {
                                        contains: search
                                    }
                                }
                            ]
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                        users_role: {
                            some: {
                                role_id: customerRole.id
                            }
                        }
                    },
                }),
                this.prisma.users.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        ...search && {
                            OR: [
                                {
                                    email: {
                                        contains: search
                                    }
                                },
                                {
                                    first_name: {
                                        contains: search
                                    }
                                },
                                {
                                    last_name: {
                                        contains: search
                                    }
                                },
                                {
                                    phone: {
                                        contains: search
                                    }
                                }
                            ]
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                        users_role: {
                            some: {
                                role_id: customerRole.id
                            }
                        }
                    },
                    select: {
                        email: true,
                        id: true,
                        first_name: true,
                        last_name: true,
                        gender: true,
                        date_of_birth: true,
                        phone: true,
                        active: true,
                        created_date: true,
                        modified_date: true,
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    customers,
                    totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                    total: totalRecord,
                    skip: skip || 0,
                    take: take || 10
                }
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async customer(id: number): Promise<IResponse<Omit<users, "hashed_rt" | "password">>> {
        try {
            const administrator = await this.prisma.users.findUnique({
                where: { id },
                select: {
                    email: true,
                    id: true,
                    first_name: true,
                    last_name: true,
                    gender: true,
                    date_of_birth: true,
                    phone: true,
                    active: true,
                    created_date: true,
                    modified_date: true,
                    address: {
                        select: {
                            city: true,
                            country: true,
                            created_date: true,
                            default_shipping_address: true,
                            id: true,
                            modified_date: true,
                            postal_code: true,
                            province: true,
                            street_line_1: true,
                            street_line_2: true,
                        }
                    }
                }
            })
            if (administrator) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: administrator
                }
            }
            return {
                code: 404,
                message: 'Customer does not exist in the system!',
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

    public async updateCustomer(id: number, input: UserUpdateDto): Promise<IResponse<Omit<users, "hashed_rt" | "password">>> {
        try {
            const { active, date_of_birth, email, first_name, gender, last_name, phone } = input;
            const customer = await this.prisma.users.findUnique({
                where: { id }
            })
            if (customer) {
                if (email) {
                    const isEmailExist = await this.prisma.users.findFirst({
                        where: {
                            AND: [
                                { email },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        },
                    })
                    if (isEmailExist) {
                        return {
                            code: 400,
                            success: false,
                            message: 'Email code already exist!',
                            fieldError: "email",
                        }
                    }
                }
                return {
                    code: 200,
                    success: true,
                    message: 'Success!',
                    data: await this.prisma.users.update({
                        where: { id },
                        data: {
                            ...date_of_birth && { date_of_birth },
                            ...email && { email },
                            ...first_name && { first_name },
                            ...last_name && { last_name },
                            ...phone && { phone },
                            active,
                            gender,
                        },
                        select: {
                            email: true,
                            id: true,
                            first_name: true,
                            last_name: true,
                            gender: true,
                            date_of_birth: true,
                            phone: true,
                            active: true,
                            created_date: true,
                            modified_date: true,
                            address: {
                                select: {
                                    city: true,
                                    country: true,
                                    created_date: true,
                                    default_shipping_address: true,
                                    id: true,
                                    modified_date: true,
                                    postal_code: true,
                                    province: true,
                                    street_line_1: true,
                                    street_line_2: true,
                                }
                            }
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Customer does not exist in the system!',
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
