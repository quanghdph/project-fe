import { PaymentMethod } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class OrderCreateDto {
    @IsNumber()
    @IsNotEmpty()
    address_id: number;

    @IsNumber()
    @IsOptional()
    promotion_id: number

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod

    @IsNumber()
    @IsOptional()
    quantity: number

    @IsNumber()
    @IsOptional()
    product_variant_id: number

}