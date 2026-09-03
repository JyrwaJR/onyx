/**
 * @file Session feature type definitions.
 */

import type { Session } from '../../../shared/api/types';
import type { PaginationMeta } from '@sharedType/pagination-meta';

/** Paginated session list response from the API. */
export interface SessionListResponse {
  data: Session[];
  pagination: PaginationMeta;
}
