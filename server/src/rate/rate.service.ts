import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateCreateDto, RateUpdateDto } from './dto';
import { IResponse } from 'src/common/types';
import { rate } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class RateService {
    constructor(private readonly prisma: PrismaService) { }

    public async create(input: RateCreateDto, userId: number): Promise<IResponse<rate>> {
        try {
            const { content, product_id, title, stars } = input;
            const isProductIdValid = await this.prisma.product.findUnique({
                where: { id: product_id },
            });
            if (!isProductIdValid) {
                return {
                    code: 404,
                    success: false,
                    fieldError: 'product_id',
                    message: 'Product does not exist in the system!',
                };
            }
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.rate.create({
                    data: {
                        content,
                        product_id,
                        stars,
                        title,
                        user_id: userId
                    }
                }),
            };
        } catch (error) {
            return {
                code: 500,
                message: 'An error occurred in the system!',
                success: false,
            };
        }
    }

    public async delete(id: number): Promise<IResponse<rate>> {
        try {
            const rate = await this.prisma.rate.findUnique({
                where: { id },
            });
            if (rate) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.rate.delete({
                        where: { id },
                    }),
                };
            }
            return {
                code: 404,
                message: 'Rate does not exist in the system!',
                success: false,
            };
        } catch (error) {
            return {
                code: 500,
                message: 'An error occurred in the system!',
                success: false,
            };
        }
    }

    public async rate(id: number): Promise<IResponse<rate>> {
        try {
            const rate = await this.prisma.rate.findUnique({
                where: { id },
            });
            if (rate) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: rate,
                };
            }
            return {
                code: 404,
                message: 'Rate does not exist in the system!',
                success: false,
            };
        } catch (error) {
            return {
                code: 500,
                message: 'An error occurred in the system!',
                success: false,
            };
        }
    }

    public async rates(input: PaginationDto, productId: number): Promise<IResponse<{ rates: rate[]; totalPage: number; skip: number; take: number; total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, rates] = await this.prisma.$transaction([
                this.prisma.rate.count({
                    where: {
                        product_id: productId
                    }
                }),
                this.prisma.rate.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        product_id: productId
                    },
                    include: {
                        users: true
                    }
                }),
            ]);
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: {
                    rates,
                    totalPage: take
                        ? Math.ceil(totalRecord / take)
                        : Math.ceil(totalRecord / 10),
                    total: totalRecord,
                    skip: skip || 0,
                    take: take || 10,
                },
            };
        } catch (error) {
            return {
                code: 500,
                message: 'An error occurred in the system!',
                success: false,
            };
        }
    }

    public async update(
        input: RateUpdateDto,
        id: number,
    ): Promise<IResponse<rate>> {
        try {
            const { content, stars, title } = input;
            const rate = await this.prisma.rate.findUnique({
                where: { id },
            });
            if (rate) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.rate.update({
                        data: {
                            ...(title && { title }),
                            ...(stars && { stars }),
                            ...(content && { content }),
                        },
                        where: { id },
                    }),
                };
            }
            return {
                code: 404,
                message: 'Rate does not exist in the system!',
                success: false,
            };
        } catch (error) {
            return {
                code: 500,
                message: 'An error occurred in the system!',
                success: false,
            };
        }
    }
}
