export interface Pagination {
    take?: number,
    skip?: number
    search?: string
    status?: string
}

export interface Params {
    page: number
    limit: number
    filter: string
}