/**
 * @file Project feature type definitions.
 *
 * The OpenCode `/project` endpoint returns a plain `Project[]` array
 * (no pagination envelope). This type reflects that.
 */

import type { Project } from '../../../shared/api/types';

/** Project list response from the API — a plain array. */
export type ProjectListResponse = Project[];
