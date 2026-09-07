import { Project } from '../types/project';

/**
 * Utility to extract the folder/directory name from an absolute worktree path.
 */
function getWorktreeBasename(path: string): string {
  return path.split(/[/\\]/).filter(Boolean).pop() || path;
}

/**
 * Calculates a search relevance score for a project.
 * Higher score = higher position in the sorted list.
 */
function calculateRelevanceScore(project: Project, normalizedQuery: string): number {
  const name = project.name?.toLowerCase() ?? '';
  const folderName = getWorktreeBasename(project.worktree).toLowerCase();
  const fullPath = project.worktree.toLowerCase();

  // 4: Exact match on project name or folder name
  if (name === normalizedQuery || folderName === normalizedQuery) {
    return 4;
  }

  // 3: Name or folder name starts with query
  if (name.startsWith(normalizedQuery) || folderName.startsWith(normalizedQuery)) {
    return 3;
  }

  // 2: Name or folder name contains query
  if (name.includes(normalizedQuery) || folderName.includes(normalizedQuery)) {
    return 2;
  }

  // 1: Worktree path contains query somewhere
  if (fullPath.includes(normalizedQuery)) {
    return 1;
  }

  // 0: No match
  return 0;
}

/**
 * Sorts a list of projects so matching items appear at the top.
 *
 * Score Hierarchy:
 * 1. Exact match (name / folder name)
 * 2. Starts with query (name / folder name)
 * 3. Contains query (name / folder name)
 * 4. Contains query (full worktree path)
 * 5. Non-matching items (sorted by `updated` timestamp descending)
 */
export function sortProjectsByQuery(projects: Project[], query: string): Project[] {
  const normalizedQuery = query.trim().toLowerCase();

  // If query is empty, default to most recently updated
  if (!normalizedQuery) {
    return [...projects].sort((a, b) => b.time.updated - a.time.updated);
  }

  return [...projects].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, normalizedQuery);
    const scoreB = calculateRelevanceScore(b, normalizedQuery);

    // Primary sort: Relevance score (descending)
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // Secondary sort: Most recently updated project first
    return b.time.updated - a.time.updated;
  });
}
