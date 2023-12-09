import { PromotionCreateDto } from './promotionCreate.dto';
import { IsString, IsOptional } from 'class-validator';

export class PromotionUpdateDto extends PromotionCreateDto {
    @IsString()
    @IsOptional()
    starts_at: string;

    @IsString()
    @IsOptional()
    ends_at: string;

    @IsString()
    @IsOptional()
    coupon_code: string;

    @IsString()
    @IsOptional()
    name: string;
}