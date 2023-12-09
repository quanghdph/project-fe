import { IsString, IsEmail, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsOptional()
    hashed_rt: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsBoolean()
    @IsOptional()
    gender: boolean;

    @IsString()
    @IsOptional()
    date_of_birth: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    phone: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}