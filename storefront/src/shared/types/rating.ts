import { User } from "./user"

export interface Rating {
    id: number
    content: string
    users: User
    stars: number
    title: string
    cmt_datetime: string
}