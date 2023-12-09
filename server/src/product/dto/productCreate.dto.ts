import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class ProductCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsOptional()
    category_id: number

    @IsNumber()
    @IsOptional()
    featured_asset_id: number
    
    @IsBoolean()
    @IsOptional()
    active: boolean;
}