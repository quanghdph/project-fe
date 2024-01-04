import { Role } from "./role"

export interface User {
    id: number
    firstName: string
    lastName: string
    gender: boolean
    dateOfBirth: string
    email: string
    phoneNumber: string
    createDate: string,
    updateDate: string,
    users_role: Array<{ role_id: number, role: Role }>
    address: Array<UserAddress>
    customerCode: string
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