import { OptionName } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator"

export class OptionCreateDto {
    @IsEnum(OptionName)
    @IsNotEmpty()
    name: OptionName

    @IsArray()
    value: string

    @IsNumber()
    @IsNotEmpty()
    product_id: number
}