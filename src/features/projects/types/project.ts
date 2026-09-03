/**
 * @file Project feature type definitions.
 */

import type { Project } from '../../../shared/api/types';
import type { PaginationMeta } from '@sharedType/pagination-meta';

/** Paginated project list response from the API. */
export interface ProjectListResponse {
  data: Project[];
  pagination: PaginationMeta;
}
