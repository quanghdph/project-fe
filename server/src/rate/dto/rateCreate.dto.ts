import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class RateCreateDto {
    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsOptional()
    stars: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}