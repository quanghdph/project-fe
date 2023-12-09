import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"
import { OptionName } from "@prisma/client"

export class OptionBulkCreateDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Option)
    options: Array<Option>
}

export class Option {
    @IsEnum(OptionName)
    @IsNotEmpty()
    name: OptionName

    @IsArray()
    value: Array<string>

    @IsNumber()
    @IsNotEmpty()
    product_id: number
}