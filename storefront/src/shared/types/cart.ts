import { ProductVariant } from "./productVariant"

export interface Cart {
    id: number
    quantity: number
    product_variant: ProductVariant
}