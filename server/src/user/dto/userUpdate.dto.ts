import { RegisterDto } from 'src/auth/dto';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserUpdateDto extends RegisterDto {
    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string;
}