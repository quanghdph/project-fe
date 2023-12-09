import { Transform } from 'class-transformer';
export class PaginationDto {
    @Transform(({ value }) => +value)
    skip?: number;

    @Transform(({ value }) => +value)
    take?: number;

    search?: string

    categories?: number[]

    price?: number

    options?: string[]

    status?: string
}
