import { IsNotEmpty, IsString } from 'class-validator';

export class OrderConfirmRefund {
    @IsString()
    @IsNotEmpty()
    refund_reason: string;
}