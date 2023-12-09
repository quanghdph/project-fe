import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Permissions } from 'src/constant';

export class RoleCreateDto {
    @IsString()
    @IsNotEmpty()
    role_name: string;

    @IsString()
    @IsNotEmpty()
    role_code: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    @IsEnum(Permissions, { each: true })
    permissions: Permissions[]
}