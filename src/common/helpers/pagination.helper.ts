import type {
  PaginatedResult,
  PaginationOptions,
  PaginationParams,
  SortOrder,
} from '../interfaces/pagination.interface'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

/**
 * Normalize sort order string to SortOrder.
 */
function normalizeSortOrder(value: PaginationOptions['sortOrder']): SortOrder {
  if (!value) return 'DESC'
  const order = String(value).toUpperCase()
  return order === 'ASC' ? 'ASC' : 'DESC'
}

/**
 * Get normalized pagination and sort params for TypeORM and for response.
 * Use skip/take in QueryBuilder; use sortBy/sortOrder in .orderBy(alias + sortBy, sortOrder).
 * If allowedSortFields is provided, sortBy is validated against it (defaults to first field); otherwise raw sortBy is used.
 */
export function getPaginationParams(
  options: PaginationOptions = {},
  allowedSortFields?: string[],
): PaginationParams {
  const page = Math.max(1, Number(options.page) || DEFAULT_PAGE)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(options.limit) || DEFAULT_LIMIT))
  const skip = (page - 1) * limit
  const sortOrder = normalizeSortOrder(options.sortOrder)

  let sortBy: string
  if (allowedSortFields?.length) {
    const requested = options.sortBy?.trim()
    sortBy = requested && allowedSortFields.includes(requested) ? requested : allowedSortFields[0]
  } else {
    sortBy = options.sortBy?.trim() || 'id'
  }

  return { page, limit, skip, take: limit, sortBy, sortOrder }
}

/**
 * Build a standard paginated result from TypeORM's getManyAndCount / findAndCount result.
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  params: Pick<PaginationParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>,
): PaginatedResult<T> {
  const { page, limit, sortBy, sortOrder } = params
  const totalPages = Math.ceil(total / limit) || 1
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    sortBy,
    sortOrder,
  }
}
