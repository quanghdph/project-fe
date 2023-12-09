import { Role } from "./role"

export interface User {
    id: number
    first_name: string
    last_name: string
    gender: boolean
    date_of_birth: string
    email: string
    phone: string
    active: boolean
    created_date: string,
    modified_date: string,
    users_role: Array<{ role_id: number, role: Role }>
    address: Array<UserAddress>
}

export interface UserAddress {
    city: string
    country: string
    created_date: string
    default_shipping_address: boolean
    id: number
    modified_date: string
    postal_code: string
    province: string
    street_line_1: string
    street_line_2: string
}