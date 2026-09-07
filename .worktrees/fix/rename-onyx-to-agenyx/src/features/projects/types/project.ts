/**
 * @file Project feature type definitions.
 *
 * Types match the verified v1 OpenCode `Project` schema (`Project` object
 * returned by `GET /project` and `GET /project/current`).
 */

/** Version control system backing a project (v1 supports `git`). */
export type ProjectVcs = 'git';

/** Project display metadata (icon overrides). */
export interface ProjectIcon {
  url?: string;
  override?: string;
  color?: string;
}

/** Project lifecycle timestamps (milliseconds since epoch). */
export interface ProjectTime {
  created: number;
  updated: number;
  initialized?: number;
}

/** Commands associated with a project. */
export interface ProjectCommands {
  /** Startup script to run when creating a new workspace (worktree). */
  start?: string;
}

/** OpenCode project as returned by the v1 `/project` endpoints. */
export interface Project {
  id: string;
  /** Absolute path to the project worktree. */
  worktree: string;
  name?: string;
  icon?: ProjectIcon;
  commands?: ProjectCommands;
  vcs?: ProjectVcs;
  sandboxes: string[];
  time: ProjectTime;
}

/** Project list response from the API — a plain array. */
export type ProjectListResponse = Project[];
