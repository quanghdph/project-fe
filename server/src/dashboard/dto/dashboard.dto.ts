import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class DashboardDto {
    @IsString()
    @IsOptional()
    start_day: string

    @IsString()
    @IsOptional()
    end_day: string

    @Transform(({ value }) => +value)
    @IsOptional()
    money: number
}

