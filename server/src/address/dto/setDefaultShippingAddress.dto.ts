import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetDefaultShippingAddressDto {
    @IsNumber()
    @IsNotEmpty()
    customer_id: number;
}