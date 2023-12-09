import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class ProductVariantCreateDto {
    @IsNumber()
    @IsOptional()
    stock: number

    @IsNumber()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    sku: string

    @IsNumber()
    @IsOptional()
    price: number

    @IsNumber()
    @IsOptional()
    origin_price: number

    @IsNumber()
    @IsNotEmpty()
    product_id: number

    @IsNumber()
    @IsOptional()
    featured_asset_id: number

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    option_ids: number[]

}
