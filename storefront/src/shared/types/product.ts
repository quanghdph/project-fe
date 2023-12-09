import { Asset } from "./asset"
import { Cateogry } from "./category"
import { ProductVariant } from "./productVariant"

export interface Product {
    id: number
    name: string
    description: string
    slug: string
    category_id: number
    category: Cateogry
    active: number
    created_date: number
    modified_date: number
    featured_asset_id: number
    featured_asset: Asset
    product_variants: Array<ProductVariant>
}