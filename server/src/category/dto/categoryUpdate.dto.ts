import { IsString, IsOptional } from 'class-validator';
import { CategoryCreateDto } from './categoryCreate.dto';

export class CategoryUpdateDto extends CategoryCreateDto {
    @IsString()
    @IsOptional()
    category_name: string;

    @IsString()
    @IsOptional()
    category_code: string;
}