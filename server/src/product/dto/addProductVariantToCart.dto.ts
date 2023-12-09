import { IsNumber, IsOptional } from "class-validator"

export class AddProductVariantToCartDto {
    @IsNumber()
    @IsOptional()
    quantity: number
}

