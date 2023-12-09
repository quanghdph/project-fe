import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class PromotionCreateDto {
    @IsString()
    @IsNotEmpty()
    starts_at: string;

    @IsString()
    @IsNotEmpty()
    ends_at: string;

    @IsString()
    @IsNotEmpty()
    coupon_code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsOptional()
    limit: number;

    @IsNumber()
    @IsOptional()
    discount: number;

    @IsBoolean()
    @IsOptional()
    active: boolean
}