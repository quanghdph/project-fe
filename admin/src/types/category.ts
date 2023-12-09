import { Product } from "./product"

export interface Cateogry {
    category_name: string
    category_code: string
    description: string
    id: number
    active: boolean
    created_date: string
    modified_date: string
    parent_id: number
    product: Array<Product>
}