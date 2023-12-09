import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRolesToUserDto {
    @IsArray()
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    role_ids: number[];
}