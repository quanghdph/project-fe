import { Injectable } from '@nestjs/common';
import { OrderCreateDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/types';
import { order, order_history } from '@prisma/client';
import { PaymentMethod, OrderStatus } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { fromString } from 'uuidv4';

@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    public async create(input: OrderCreateDto, userId: number): Promise<IResponse<order | string>> {
        try {
            const { address_id, payment_method, product_variant_id, promotion_id, quantity } = input
            const [isValidAddress, isValidProductVariant, isValidPromotion] = await Promise.all([
                this.prisma.address.findFirst({ where: { id: address_id, users_id: userId } }),
                this.prisma.product_variant.findUnique({ where: { id: product_variant_id } }),
                ...promotion_id ? [this.prisma.promotion.findUnique({ where: { id: promotion_id } })] : []
            ])
            if (!isValidAddress) {
                return {
                    code: 404,
                    message: 'Address does not exist in this customer!',
                    success: false,
                }
            }
            if (!isValidProductVariant) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in this customer!',
                    success: false,
                }
            }
            if (promotion_id) {
                if (!isValidPromotion) {
                    return {
                        code: 404,
                        message: 'Promotion does not exist in the system!',
                        success: false,
                    }
                }
            }
            let price: number = 0
            let profit: number = 0
            if (promotion_id) {
                price = isValidProductVariant.price * quantity * ((100 - isValidPromotion.discount) / 100)
                profit = price - (isValidProductVariant.origin_price * quantity)
            } else {
                price = isValidProductVariant.price * quantity
                profit = price - (isValidProductVariant.origin_price * quantity)
            }
            if (payment_method === PaymentMethod.Standard) {
                const order = await this.prisma.order.create({
                    data: {
                        payment_method,
                        quantity,
                        status: OrderStatus.Open,
                        address_id,
                        profit,
                        ...promotion_id && { promotion_id },
                        code: fromString(`${userId} ${Date.now()}`),
                        users_id: userId,
                        total_price: price,
                        product_variant_id
                    }
                })
                await Promise.all([
                    await this.prisma.order_history.create({
                        data: {
                            order_id: order.id,
                            content: "Đơn hàng được tạo lúc"
                        }
                    }),
                    await this.prisma.product_variant.update({
                        where: { id: isValidProductVariant.id },
                        data: {
                            stock: isValidProductVariant.stock - quantity
                        }
                    }),
                    ...promotion_id ? [
                        await this.prisma.promotion.update({
                            where: { id: promotion_id },
                            data: {
                                limit: isValidPromotion.limit - 1
                            }
                        })
                    ] : [],
                    await this.prisma.cart.deleteMany({
                        where: {
                            product_variant_id: isValidProductVariant.id,
                            users_id: userId
                        }
                    })
                ])
                return {
                    code: 200,
                    success: true,
                    message: 'Successfully!',
                    data: order
                }
            }
            return {
                code: 400,
                message: "Cannot use this payment method!",
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

    public async orders(input: PaginationDto): Promise<IResponse<{ orders: order[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take, search, status } = input;
        const [totalRecord, orders] = await this.prisma.$transaction([
            this.prisma.order.count(),
            this.prisma.order.findMany({
                take: take || 10,
                skip: skip || 0,
                where: {
                    ...search && {
                        code: {
                            contains: search
                        }
                    },
                    ...status && status !== 'all' && {
                        status: status as OrderStatus
                    },
                },
                include: {
                    product_variant: true,
                    promotion: true,
                    users: {
                        select: {
                            first_name: true,
                            last_name: true
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
                orders,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }

    public async ordersCustomer(input: PaginationDto, userId: number): Promise<IResponse<{ orders: order[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take } = input;
        const [totalRecord, orders] = await this.prisma.$transaction([
            this.prisma.order.count({
                where: {
                    users_id: userId
                }
            }),
            this.prisma.order.findMany({
                take: take || 10,
                skip: skip || 0,
                where: {
                    users_id: userId
                },
                include: {
                    billing_address: true,
                    order_history: true,
                    promotion: true,
                    product_variant: {
                        include: {
                            featured_asset: true
                        }
                    },
                    users: {
                        select: {
                            first_name: true,
                            last_name: true
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
                orders,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }

    public async order(id: number): Promise<IResponse<order>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
                include: {
                    promotion: true,
                    order_history: true,
                    product_variant: {
                        include: {
                            featured_asset: true,
                            product: true
                        }
                    },
                    billing_address: true,
                    users: {
                        select: {
                            first_name: true,
                            last_name: true,
                            id: true,
                        }
                    }
                }
            })
            if (order) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: order
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async confirm(id: number): Promise<IResponse<order>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === "Open") {
                    await this.prisma.order_history.create({
                        data: {
                            content: "Đơn hàng được xác nhận lúc",
                            order_id: id
                        }
                    })
                    return {
                        code: 200,
                        message: 'Successfully!',
                        success: true,
                        data: await this.prisma.order.update({
                            where: { id },
                            data: {
                                status: OrderStatus.Confirm
                            }
                        })
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async shipped(id: number): Promise<IResponse<order>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === "Confirm") {
                    await this.prisma.order_history.create({
                        data: {
                            content: "Đơn hàng được giao lúc",
                            order_id: id
                        }
                    })
                    return {
                        code: 200,
                        message: 'Successfully!',
                        success: true,
                        data: await this.prisma.order.update({
                            where: { id },
                            data: {
                                status: OrderStatus.Shipped
                            }
                        })
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async completed(id: number) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === "Shipped") {
                    await this.prisma.order_history.create({
                        data: {
                            content: "Đơn hàng được hoàn thành lúc",
                            order_id: id
                        }
                    })
                    return {
                        code: 200,
                        message: 'Successfully!',
                        success: true,
                        data: await this.prisma.order.update({
                            where: { id },
                            data: {
                                status: OrderStatus.Completed,
                                payment: true
                            }
                        })
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async refund(id: number) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === "Open" || order.status === "Confirm") {
                    const productVariant = await this.prisma.product_variant.findUnique({ where: { id: order.product_variant_id } })
                    await Promise.all([
                        await this.prisma.order_history.create({
                            data: {
                                content: "Đơn hàng được hoàn trả lúc",
                                order_id: id
                            }
                        }),
                        this.prisma.product_variant.update({
                            where: { id: order.product_variant_id },
                            data: {
                                stock: productVariant.stock + order.quantity
                            }
                        })
                    ])

                    return {
                        code: 200,
                        message: 'Successfully!',
                        success: true,
                        data: await this.prisma.order.update({
                            where: { id },
                            data: {
                                status: OrderStatus.Refund,
                                payment: true
                            }
                        })
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async cancel(id: number): Promise<IResponse<order>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === "Open" || order.status === "Confirm") {
                    const productVariant = await this.prisma.product_variant.findUnique({ where: { id: order.product_variant_id } })
                    await Promise.all([
                        this.prisma.order_history.create({
                            data: {
                                content: "Đơn hàng được hủy lúc",
                                order_id: order.id
                            }
                        }),
                        this.prisma.product_variant.update({
                            where: { id: order.product_variant_id },
                            data: {
                                stock: productVariant.stock + order.quantity
                            }
                        })
                    ])
                    return {
                        code: 200,
                        message: 'Success',
                        success: true,
                        data: await this.prisma.order.update(({
                            where: { id },
                            data: {
                                status: OrderStatus.Cancel
                            }
                        }))
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async delete(id: number): Promise<IResponse<order>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                if (order.status === OrderStatus.Cancel) {
                    await this.prisma.order_history.deleteMany({
                        where: { order_id: id }
                    })
                    return {
                        code: 200,
                        message: 'Successfully!',
                        success: true,
                        data: await this.prisma.order.delete({
                            where: { id },
                        })
                    }
                }
                return {
                    code: 400,
                    message: 'You cannot perform this action!',
                    success: false,
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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

    public async getOrderHistory(id: number): Promise<IResponse<order_history[]>> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            })
            if (order) {
                return {
                    code: 200,
                    message: 'Successfully!',
                    success: true,
                    data: await this.prisma.order_history.findMany({
                        where: { order_id: id },
                        orderBy: {
                            created_date: "asc"
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Order does not exist in the system!',
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
