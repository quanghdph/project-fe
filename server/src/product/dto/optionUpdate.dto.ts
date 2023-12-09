import { IsNotEmpty, IsString } from "class-validator"

export class OptionUpdateDto {
    @IsString()
    @IsNotEmpty()
    value: string
}