import { IsNumber, IsOptional, IsString } from "class-validator";
import { RateCreateDto } from "./rateCreate.dto";

export class RateUpdateDto extends RateCreateDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsNumber()
    @IsOptional()
    product_id: number;

    @IsNumber()
    @IsOptional()
    stars: number;

    @IsString()
    @IsOptional()
    content: string;
}