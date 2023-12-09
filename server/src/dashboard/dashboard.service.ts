import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardDto } from './dto';

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async dashboard(input: DashboardDto) {
        try {
            const { end_day, money, start_day } = input
            const [
                totalProducts,
                totalCustomers,
                totalAdministrators,
                totalOrders,
                totalOrdersOpen,
                totalOrderConfirm,
                totalOrderShipped,
                totalOrderCompleted,
                totalOrderRefund,
                totalOrderCancel,
                potentialCustomers,
                salesReport,
                hotSellingProducts
            ] = await this.prisma.$transaction([
                this.prisma.product.count(),
                this.prisma.users.count({
                    where: {
                        users_role: {
                            some: {
                                role: {
                                    role_code: "Customer"
                                }
                            }
                        }
                    }
                }),
                this.prisma.users.count({
                    where: {
                        users_role: {
                            some: {
                                role: {
                                    NOT: {
                                        role_code: "Customer"
                                    }
                                }
                            }
                        }
                    }
                }),
                this.prisma.order.count(),
                this.prisma.order.count({
                    where: {
                        status: "Open"
                    }
                }),
                this.prisma.order.count({
                    where: {
                        status: "Confirm"
                    }
                }),
                this.prisma.order.count({
                    where: {
                        status: "Shipped"
                    }
                }),
                this.prisma.order.count({
                    where: {
                        status: "Completed"
                    }
                }),
                this.prisma.order.count({
                    where: {
                        status: "Refund"
                    }
                }),
                this.prisma.order.count({
                    where: {
                        status: "Cancel"
                    }
                }),
                // @ts-ignore: Unreachable code error
                this.prisma.order.groupBy({
                    by: ['users_id'],
                    _sum: {
                        total_price: true
                    }
                }),
                this.prisma.order.findMany({
                    where: {
                        AND: [
                            {
                                created_date: {
                                    lte: end_day || new Date().toISOString(),
                                }
                            },
                            {
                                created_date: {
                                    gte: start_day,
                                }
                            }
                        ]
                    },
                    include: {
                        product_variant: true
                    }
                }),
                // @ts-ignore: Unreachable code error
                this.prisma.order.groupBy({
                    by: ['product_variant_id'],
                    _sum: {
                        quantity: true
                    },
                    orderBy: {
                        _sum: {
                            quantity: 'desc'
                        }
                    }

                }),
            ])
            // @ts-ignore: Unreachable code error
            let psc = [];
            for (const element of potentialCustomers) {
                const user = await this.prisma.users.findUnique({ where: { id: element.users_id } })
                if (element._sum.total_price >= money) {
                    const { hashed_rt, password, ...other } = user
                    psc.push({ ...element, user: other })
                }
            }

            let vrs = [];
            for (const element of hotSellingProducts) {
                const variant = await this.prisma.product_variant.findUnique(
                    {
                        where: {
                            id: element.product_variant_id
                        },
                        include: {
                            product: true
                        }
                    })
                if (vrs.length < 4) {
                    vrs.push({ ...element, variant })
                }
            }
            return {
                totalProducts,
                totalCustomers,
                totalAdministrators,
                totalOrders,
                totalOrdersOpen,
                totalOrderConfirm,
                totalOrderShipped,
                totalOrderCompleted,
                totalOrderRefund,
                totalOrderCancel,
                potentialCustomers: psc,
                salesReport,
                hotSellingProducts: vrs
            }
        } catch (error) {
            console.log(error)
        }
    }
}

