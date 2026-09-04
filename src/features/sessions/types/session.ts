/**
 * @file Session feature type definitions.
 *
 * The OpenCode `/session` endpoint returns a plain `Session[]` array
 * (no pagination envelope). This type reflects that.
 */

import type { SessionT } from '../../../shared/api/types';

/** Session list response from the API — a plain array. */
export type SessionListResponse = SessionT[];
