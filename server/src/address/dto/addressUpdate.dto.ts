import { IsString, IsOptional, IsNumber } from 'class-validator';
import { AddressCreateDto } from './addressCreate.dto';

export class AddressUpdateDto extends AddressCreateDto {
    @IsString()
    @IsOptional()
    street_line_1: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    province: string;

    @IsString()
    @IsOptional()
    postal_code: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsNumber()
    @IsOptional()
    customer_id: number;
}