import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressCreateDto, AddressUpdateDto } from './dto';
import { IResponse } from 'src/common/types';
import { address } from '@prisma/client';
import { SetDefaultShippingAddressDto } from './dto';

@Injectable()
export class AddressService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async create(input: AddressCreateDto): Promise<IResponse<address>> {
        try {
            const { city, country, default_shipping_address, postal_code, province, street_line_1, street_line_2, customer_id } = input
            const isCustomerValid = await this.prisma.users.findUnique({
                where: { id: customer_id }
            })
            if (!isCustomerValid) {
                return {
                    code: 404,
                    message: 'Customer does not exist in the system!',
                    success: false,
                }
            }
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.address.create({
                    data: {
                        city,
                        country,
                        default_shipping_address,
                        postal_code,
                        province,
                        street_line_1,
                        street_line_2,
                        users_id: customer_id
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

    public async addresses(customerId: number): Promise<IResponse<address[]>> {
        try {
            const [isValidCustomer] = await Promise.all([
                this.prisma.users.findUnique({
                    where: { id: customerId },
                }),
            ])
            if (!isValidCustomer) {
                return {
                    code: 404,
                    message: 'Customer does not exist in the system!',
                    success: false,
                }
            }
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.address.findMany({
                    where: {
                        users_id: customerId
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

    public async delete(id: number): Promise<IResponse<address>> {
        try {
            const address = await this.prisma.address.findUnique({
                where: { id }
            })
            if (address) {
                return {
                    code: 200,
                    message: 'Delete successfully!',
                    success: true,
                    data: await this.prisma.address.delete({ where: { id } })
                }

            }
            return {
                code: 404,
                message: 'Address does not exist in the system!',
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

    public async address(id: number): Promise<IResponse<address>> {
        try {
            const address = await this.prisma.address.findUnique({
                where: { id }
            })
            if (address) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: address
                }
            }
            return {
                code: 404,
                message: 'Address does not exist in the system!',
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

    public async update(id: number, input: AddressUpdateDto): Promise<IResponse<address>> {
        try {
            const { city, country, postal_code, province, street_line_1, street_line_2 } = input;
            const address = await this.prisma.address.findUnique({
                where: { id }
            })
            if (address) {
                return {
                    code: 200,
                    success: true,
                    message: 'Successfully!',
                    data: await this.prisma.address.update({
                        where: { id },
                        data: {
                            ...city && { city },
                            ...country && { country },
                            ...postal_code && { postal_code },
                            ...province && { province },
                            ...street_line_1 && { street_line_1 },
                            ...street_line_2 && { street_line_2 }
                        },
                    })
                }
            }
            return {
                code: 404,
                message: 'Address does not exist in the system!',
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

    public async setDefaultShippingAddress(input: SetDefaultShippingAddressDto, id: number): Promise<IResponse<address>> {
        try {
            const { customer_id } = input
            const [isValidCustomer, address] = await Promise.all([
                this.prisma.users.findUnique({
                    where: { id: customer_id },
                    select: {
                        address: {
                            select: {
                                id: true
                            }
                        }
                    }
                }),
                await this.prisma.address.findUnique({
                    where: { id }
                })
            ])
            if (!isValidCustomer) {
                return {
                    code: 404,
                    message: 'Customer does not exist in the system!',
                    success: false,
                }
            }
            if (address) {
                await this.prisma.$transaction(
                    isValidCustomer.address.map((address) => this.prisma.address.update({
                        where: { id: address.id },
                        data: {
                            default_shipping_address: false
                        }
                    }))
                )
                return {
                    code: 200,
                    success: true,
                    message: 'Successfully!',
                    data: await this.prisma.address.update({
                        where: { id },
                        data: {
                            default_shipping_address: true
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Address does not exist in the system!',
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
