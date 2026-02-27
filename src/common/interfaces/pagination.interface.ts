export type SortOrder = 'ASC' | 'DESC'

/**
 * Query params for pagination and sorting (from request: ?page=1&limit=10&sortBy=created_at&sortOrder=desc)
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder | 'asc' | 'desc'
}

/**
 * Normalized params for TypeORM (skip, take, order) and for building response (page, limit, sort)
 */
export interface PaginationParams {
  page: number
  limit: number
  skip: number
  take: number
  sortBy: string
  sortOrder: SortOrder
}

/**
 * Standard shape for paginated API responses
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  sortBy: string
  sortOrder: SortOrder
}
