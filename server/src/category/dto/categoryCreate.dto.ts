
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CategoryCreateDto {
    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsString()
    @IsNotEmpty()
    category_code: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}