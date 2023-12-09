import { Asset } from "./asset"
import { Product } from "./product"
import { ProductOption } from "./productOption"

export interface ProductVariant {
    id: number
    stock: number
    sku: string
    origin_price: number
    price: number
    created_date: number
    name: string
    modified_date: number
    created_by: number
    modified_by: number
    product_id: number
    featured_asset: Asset
    product: Product
    featured_asset_id: number
    product_options: Array<{ product_option: ProductOption }>
}