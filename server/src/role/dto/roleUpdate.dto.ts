import { RoleCreateDto } from './roleCreate.dto';
import { IsString, IsOptional } from 'class-validator';

export class RoleUpdateDto extends RoleCreateDto {
    @IsString()
    @IsOptional()
    role_name: string;

    @IsString()
    @IsOptional()
    role_code: string;
}