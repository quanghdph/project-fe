import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductVariantToCartDto, OptionCreateDto, OptionUpdateDto, ProductCreateDto, ProductVariantCreateDto, ProductVariantUpdateDto } from './dto';
import { IResponse } from 'src/common/types';
import { cart, product, product_option, product_variant } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { ProductUpdateDto, OptionBulkCreateDto } from './dto';
import { uniqBy } from 'lodash'

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async productCreate(input: ProductCreateDto): Promise<IResponse<product>> {
        try {
            const { active, category_id, description, name, featured_asset_id } = input
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.product.create({
                    data: {
                        active,
                        name,
                        category_id,
                        description,
                        featured_asset_id
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

    public async product(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    product_variants: {
                        include: {
                            featured_asset: true,
                            product_options: {
                                select: {
                                    product_option: {
                                        select: {
                                            value: true,
                                            id: true,
                                            name: true
                                        }

                                    }
                                }
                            }
                        }
                    },
                    featured_asset: true,
                }
            })
            if (product) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: product
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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

    public async delete(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                select: {
                    product_variants: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            if (product) {
                await Promise.all([
                    this.prisma.$transaction(product.product_variants.map((product_variant) => this.prisma.product_variant_option.deleteMany({ where: { product_variant_id: product_variant.id } }))),
                ])
                await Promise.all([
                    this.prisma.product_variant.deleteMany({ where: { product_id: id } }),
                    this.prisma.product_option.deleteMany({ where: { product_id: id } }),
                ])
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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

    public async products(input: PaginationDto): Promise<IResponse<{ products: product[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search, categories, price, options, status } = input;
            const [totalRecord, products] = await this.prisma.$transaction([
                this.prisma.product.count({
                    where: {
                        ...search && {
                            name: {
                                contains: search
                            },
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                        ...categories && {
                            category_id: { in: Array.isArray(categories) ? [...categories].map((category) => +category) : [+categories] }
                        },
                        ...price && {
                            product_variants: {
                                some: {
                                    price: {
                                        gte: +price
                                    }
                                }
                            }
                        },
                        ...options && {
                            product_variants: {
                                some: {
                                    product_options: {
                                        some: {
                                            product_option: {
                                                value: { in: options }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                }),
                this.prisma.product.findMany({
                    ...take && { take },
                    ...skip && { skip },
                    where: {
                        ...search && {
                            name: {
                                contains: search
                            },
                        },
                        ...status && status !== 'all' && {
                            active: status === 'active' ? true : false
                        },
                        ...categories && {
                            category_id: { in: Array.isArray(categories) ? [...categories].map((category) => +category) : [+categories] }
                        },
                        ...price && {
                            product_variants: {
                                some: {
                                    price: {
                                        gte: +price
                                    }
                                }
                            }
                        },
                        ...options && {
                            product_variants: {
                                some: {
                                    product_options: {
                                        some: {
                                            product_option: {
                                                value: { in: options }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        featured_asset: true,
                        category: true,
                        product_variants: {
                            include: {
                                featured_asset: true
                            }
                        },
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    products,
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

    public async productUpdate(input: ProductUpdateDto, id: number): Promise<IResponse<product>> {
        try {
            const { active, name, featured_asset_id, description, category_id } = input
            const product = await this.prisma.product.findUnique({
                where: { id }
            })
            if (product) {
                const [isAssetValid] = await Promise.all([
                    ...featured_asset_id ? [this.prisma.asset.findUnique({ where: { id: featured_asset_id } })] : [],
                ])
                if (featured_asset_id && !isAssetValid) {
                    return {
                        code: 404,
                        success: false,
                        fieldError: "featured_asset_id",
                        message: 'Asset does not exist in the system!',
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product.update({
                        data: {
                            featured_asset_id,
                            ...name && { name },
                            ...description && { description },
                            category_id,
                            active
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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

    public async productVariant(id: number): Promise<IResponse<product_variant>> {
        try {
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id },
                include: {
                    featured_asset: true,
                }
            })
            if (productVariant) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: productVariant
                }
            }
            return {
                code: 404,
                message: 'Product variant does not exist in the system!',
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

    public async productVariantUpdate(input: ProductVariantUpdateDto, id: number): Promise<IResponse<product_variant>> {
        try {
            const { name, price, sku, stock, featured_asset_id, origin_price } = input
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id },
            })
            if (productVariant) {
                if (sku) {
                    const isSkuExist = await this.prisma.product_variant.findFirst({
                        where: {
                            AND: [
                                { sku },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        },
                    })
                    if (isSkuExist) {
                        return {
                            code: 400,
                            success: false,
                            message: 'Sku code already exist!',
                            fieldError: "sku",
                        }
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_variant.update({
                        where: { id },
                        data: {
                            ...name && { name },
                            ...price && { price },
                            ...sku && { sku },
                            ...stock && { stock },
                            ...origin_price && { origin_price },
                            ...featured_asset_id && { featured_asset_id }
                        },
                    })
                }
            }
            return {
                code: 404,
                message: 'Product variant does not exist in the system!',
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

    public async productVariants(input: PaginationDto, productId: number): Promise<IResponse<{ product_variants: product_variant[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, product_variants] = await this.prisma.$transaction([
                this.prisma.product_variant.count(),
                this.prisma.product_variant.findMany({
                    where: {
                        product_id: productId
                    },
                    take: take || 10,
                    skip: skip || 0,
                    include: {
                        featured_asset: true,
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    product_variants,
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

    public async optionBulkCreate(input: OptionBulkCreateDto): Promise<IResponse<product_option[]>> {
        try {
            const { options } = input
            const opts = options.map((option) => {
                return option.value.map((v) => {
                    return {
                        name: option.name,
                        value: v,
                        product_id: option.product_id
                    }
                })
            }).flat(1)
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.$transaction(
                    opts.map((opt) => this.prisma.product_option.create({
                        data: {
                            name: opt.name,
                            value: opt.value,
                            product_id: opt.product_id,
                        }
                    }))
                )
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async optionCreate(input: OptionCreateDto): Promise<IResponse<product_option>> {
        try {
            const { name, value, product_id } = input
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.product_option.create({
                    data: {
                        name,
                        value,
                        product_id
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

    public async productVariantCreate(input: ProductVariantCreateDto): Promise<IResponse<product_variant>> {
        try {
            const { option_ids, price, product_id, sku, stock, name, origin_price } = input
            const isSkuValid = await this.prisma.product_variant.findUnique({
                where: { sku }
            })
            if (isSkuValid) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "sku",
                    message: 'Sku already exists in the system!',
                }
            }
            return {
                code: 200,
                success: true,
                data: await this.prisma.product_variant.create({
                    data: {
                        sku,
                        price,
                        origin_price,
                        stock,
                        name,
                        product_id,
                        product_options: {
                            createMany: {
                                data: option_ids.map((id) => {
                                    return {
                                        product_option_id: id
                                    }
                                })
                            }
                        }
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

    public async productVariantBulkCreate(input: { variants: ProductVariantCreateDto[] }): Promise<IResponse<product_variant[]>> {
        try {
            const { variants } = input
            const skus = await this.prisma.$transaction(
                variants.map((variant) => this.prisma.product_variant.findUnique({ where: { sku: variant.sku } }))
            )
            const isSkuNotExist = skus.some(el => el !== null);
            const skusExist = skus.filter((el) => el !== null)
            if (isSkuNotExist) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "sku",
                    valuesError: skusExist.map((sku) => sku.sku),
                    message: 'Sku already exists in the system!',
                }
            }
            return {
                code: 200,
                success: true,
                data: await this.prisma.$transaction(
                    variants.map((variant) => {
                        return this.prisma.product_variant.create({
                            data: {
                                sku: variant.sku,
                                price: variant.price,
                                origin_price: variant.origin_price,
                                name: variant.name,
                                stock: variant.stock,
                                product_id: variant.product_id,
                                product_options: {
                                    createMany: {
                                        data: variant.option_ids.map((id) => {
                                            return {
                                                product_option_id: id
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    })
                )
            }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async productVariantDelete(id: number): Promise<IResponse<product_variant>> {
        try {
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id }
            })
            if (productVariant) {
                await this.prisma.product_variant_option.deleteMany({
                    where: { product_variant_id: id }
                })
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_variant.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product variant does not exist in the system!',
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

    public async updateProductOption(input: OptionUpdateDto, id: number): Promise<IResponse<product_option>> {
        try {
            const { value } = input
            const productOption = await this.prisma.product_option.findUnique({
                where: { id }
            })
            if (productOption) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_option.update({
                        where: { id },
                        data: {
                            value
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product option does not exist in the system!',
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

    // ** Cart **
    public async addProductVariantToCart(input: AddProductVariantToCartDto, customerId: number, productVariantId: number): Promise<IResponse<cart>> {
        try {
            const { quantity } = input
            const [productVariant, isVariantExistInCard] = await Promise.all([
                this.prisma.product_variant.findUnique({
                    where: { id: productVariantId },
                }),
                this.prisma.cart.findMany({
                    where: {
                        product_variant_id: productVariantId,
                        users_id: customerId
                    }
                })
            ])
            if (!productVariant) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in the system!',
                    success: false,
                }
            }
            if (isVariantExistInCard && isVariantExistInCard.length) {
                return {
                    code: 400,
                    message: 'This product already exists on the whole card!',
                    success: false,
                }
            }
            return {
                code: 200,
                message: 'Successfully!',
                success: true,
                data: await this.prisma.cart.create({
                    data: {
                        quantity,
                        users_id: customerId,
                        product_variant_id: productVariantId
                    },
                    include: {
                        product_variant: {
                            include: {
                                product: true
                            }
                        }
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

    public async removeProductVariantFromCart(customerId: number, productVariantId: number): Promise<IResponse<{}>> {
        try {
            const isProductVariantExistInCard = await this.prisma.cart.findFirst({
                where: {
                    product_variant_id: productVariantId,
                    users_id: customerId
                }
            })
            if (!isProductVariantExistInCard) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in card!',
                    success: false,
                }
            }
            await this.prisma.cart.deleteMany({
                where: {
                    users_id: customerId,
                    product_variant_id: productVariantId
                }
            })
            return {
                code: 200,
                success: true,
                message: "Successfully",
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async updateProductVariantInCart(input: AddProductVariantToCartDto, customerId: number, productVariantId: number): Promise<IResponse<{}>> {
        try {
            const { quantity } = input
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id: productVariantId },
                select: {
                    stock: true
                }
            })
            if (!productVariant) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in the system!',
                    success: false,
                }
            }
            const isProductVariantExistInCard = await this.prisma.cart.findFirst({
                where: {
                    product_variant_id: productVariantId,
                    users_id: customerId
                }
            })
            if (!isProductVariantExistInCard) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in card!',
                    success: false,
                }
            }
            if (productVariant.stock - quantity <= 0 || productVariant.stock - quantity >= productVariant.stock) {
                return {
                    code: 400,
                    message: 'Quantity exceeded limit quantity!',
                    success: false,
                    fieldError: "quantity"
                }
            }
            return {
                code: 200,
                success: true,
                message: "Successfully",
                data: await this.prisma.cart.updateMany({
                    where: {
                        product_variant_id: productVariantId,
                        users_id: customerId
                    },
                    data: {
                        quantity
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

    public async getListProductVariantFromCart(customerId: number): Promise<IResponse<cart[]>> {
        try {
            const [carts] = await this.prisma.$transaction([
                this.prisma.cart.findMany({
                    where: {
                        users_id: customerId
                    },
                    include: {
                        product_variant: {
                            include: {
                                product: true,
                                featured_asset: true
                            }
                        }
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: carts
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async getItemOnCart(cartId: number): Promise<IResponse<cart>> {
        try {
            const cart = await this.prisma.cart.findUnique({
                where: { id: cartId },
                include: {
                    product_variant: {
                        include: {
                            featured_asset: true
                        }
                    }
                }
            })
            if (cart) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: cart
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in cart!',
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

    public async getProductNewArrivals() {
        try {
            const [products] = await this.prisma.$transaction([
                this.prisma.product.findMany({
                    take: 12,
                    skip: 0,
                    where: {
                        active: true,
                    },
                    orderBy: {
                        created_date: "desc"
                    },
                    include: {
                        featured_asset: true,
                        product_variants: {
                            include: {
                                featured_asset: true
                            }
                        },
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: products
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async getPorudctMostBought() {
        try {
            const [variants] = await this.prisma.$transaction([
                // @ts-ignore: Unreachable code error
                this.prisma.order.groupBy({
                    by: ["product_variant_id"],
                    _sum: {
                        product_variant_id: true
                    },
                    orderBy: {
                        _sum: {
                            product_variant_id: "desc"
                        }
                    },
                }),
            ])
            // @ts-ignore: Unreachable code error
            const products = []
            for (const element of variants) {
                const product = (await this.prisma.product.findMany({
                    where: {
                        product_variants: {
                            some: {
                                id: element.product_variant_id
                            }
                        }
                    },
                    include: {
                        featured_asset: true,
                        product_variants: true
                    }
                }))
                products.push(product)
            }
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: uniqBy(products.flat(1), "id").slice(0, 8)
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async getProductOptions(): Promise<IResponse<product_option[]>> {
        try {
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: await this.prisma.product_option.findMany({
                    where: {
                        product: {
                            active: true
                        }
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
}