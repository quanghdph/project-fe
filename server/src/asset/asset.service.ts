import { Injectable } from '@nestjs/common';
import { asset } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { IResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class AssetService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly prisma: PrismaService
    ) { }

    public async upload(files: Array<Express.Multer.File>): Promise<IResponse<asset[]>> {
        try {
            const images = await Promise.all(files.map(async (file) => {
                return await this.cloudinaryService.uploadImage(file);
            }));
            const assets = await this.prisma.$transaction(
                images.map((image) => this.prisma.asset.create({
                    data: {
                        name: this.getFileName(image.url),
                        url: image.url,
                        width: image.width,
                        height: image.height,
                        format: image.format,
                        cloudinary_asset_id: image.asset_id,
                        cloudinary_public_id: image.public_id,
                    }
                }))
            )
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: assets
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async asset(id: number): Promise<IResponse<asset>> {
        try {
            const asset = await this.prisma.asset.findUnique({
                where: { id }
            })
            if (asset) {
                return {
                    code: 200,
                    message: 'Success!',
                    success: true,
                    data: asset
                }
            }
            return {
                code: 404,
                message: 'Asset does not exist in the system!',
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

    public async delete(id: number): Promise<IResponse<asset>> {
        try {
            const asset = await this.prisma.asset.findUnique({
                where: { id }
            })
            if (asset) {
                const [assetDelete, _assetCloudinaryDelete] = await Promise.all([
                    this.prisma.asset.delete({ where: { id } }),
                    this.cloudinaryService.deleteImage(asset.cloudinary_public_id),
                    this.prisma.product.updateMany({
                        where: {
                            featured_asset_id: id
                        },
                        data: {
                            featured_asset_id: null
                        }
                    }),
                    this.prisma.product_variant.updateMany({
                        where: {
                            featured_asset_id: id
                        },
                        data: {
                            featured_asset_id: null
                        }
                    })
                ])
                return {
                    code: 200,
                    message: 'Success!',
                    success: true,
                    data: assetDelete
                }
            }
            return {
                code: 404,
                message: 'Asset does not exist in the system!',
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

    public async assets(input: PaginationDto): Promise<IResponse<{ assets: asset[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search } = input;
            const [totalRecord, assets] = await this.prisma.$transaction([
                this.prisma.asset.count(),
                this.prisma.asset.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        ...search && {
                            name: {
                                contains: search
                            },
                        }
                    },
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    assets,
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

    private getFileName(url: string) {
        return url.substring(url.lastIndexOf('/') + 1);
    }
}
