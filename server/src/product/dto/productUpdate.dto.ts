import { IsString, IsOptional } from 'class-validator';
import { ProductCreateDto } from './productCreate.dto';

export class ProductUpdateDto extends ProductCreateDto {
    @IsString()
    @IsOptional()
    name: string;
}