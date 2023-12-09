import { ProductVariant } from "./productVariant"
import { Promotion } from "./promotion"
import { User, UserAddress } from "./user"

export interface Order {
    id: number
    created_date: string
    code: string
    modified_date: string
    payment: boolean
    status: StatusOrder
    users_id: number
    address_id: number
    promotion_id: number
    payment_method: string
    user_info_payment_id: string
    quantity: number
    total_price: number
    product_variant_id: number
    users: User
    promotion: Promotion
    billing_address: UserAddress
    product_variant: ProductVariant
    refund_reason: string
    order_history: Array<OrderHistory>
}

export enum StatusOrder {
    Open = "Open",
    Confirm = "Confirm",
    Shipped = "Shipped",
    Completed = "Completed",
    Refund = "Refund",
    Cancel = "Cancel"
}

export interface OrderHistory {
    content: string
    created_date: string
    id: number
}