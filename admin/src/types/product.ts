import { Asset } from "./asset"
import { ProductVariant } from "./productVariant"

export interface Product {
    id: number
    name: string
    description: string
    slug: string
    category_id: number
    active: boolean
    created_date: number
    modified_date: number
    featured_asset_id: number
    featured_asset: Asset
    product_variants: Array<ProductVariant>
}