import { Product } from "./product"

export interface Cateogry {
    category_name: string
    category_code: string
    description: string
    id: number
    active: number
    created_date: string
    modified_date: string
    created_by: number
    modified_by: string
    product: Array<Product>
}