import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ProductVariantCreateDto } from './productVariantCreate.dto';

export class ProductVariantUpdateDto extends ProductVariantCreateDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    sku: string;

    @IsNumber()
    @IsOptional()
    product_id: number
}