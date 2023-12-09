export interface User {
    id: number
    first_name: string
    last_name: string
    gender: number
    date_of_birth: string
    email: string
    phone: string
    active: number
    created_date: string,
    modified_date: string,
    created_by: number,
    modified_by: number,
    users_role: Array<{ role_id: number }>
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