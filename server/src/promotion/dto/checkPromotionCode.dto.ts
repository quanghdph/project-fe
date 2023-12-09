import { IsString, IsNotEmpty } from 'class-validator';

export class CheckPromotionCodeDto {
    @IsString()
    @IsNotEmpty()
    coupon_code: string;
}