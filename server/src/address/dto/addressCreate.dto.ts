import { IsOptional, IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class AddressCreateDto {
    @IsString()
    @IsNotEmpty()
    street_line_1: string;

    @IsString()
    @IsOptional()
    street_line_2: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    province: string;

    @IsString()
    @IsNotEmpty()
    postal_code: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsBoolean()
    @IsOptional()
    default_shipping_address: boolean;

    @IsNumber()
    @IsNotEmpty()
    customer_id: number;
}