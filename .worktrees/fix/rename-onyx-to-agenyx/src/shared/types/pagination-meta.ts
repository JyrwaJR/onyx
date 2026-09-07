/**
 * @file Pagination metadata for list endpoints.
 *
 * Describes the current page, total items, and page size.
 */

/** Pagination metadata returned by paginated list endpoints. */
export interface PaginationMeta {
  /** Current page number (1-indexed). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  totalItems: number;
  /** Total number of pages. */
  totalPages: number;
}
