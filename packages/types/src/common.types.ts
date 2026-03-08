/**
 * @file Common utility type definitions
 * @module @pompcore/types/common
 */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/** Paginated query result */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
