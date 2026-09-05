export interface OpencodeSkill {
  /** The unique name of the skill (lowercase, hyphen-separated) */
  name: string;

  /** Description of what the skill does and when it should trigger */
  description: string;

  /** File path or location tag (e.g., "<built-in>" or absolute file path) */
  location: string;

  /** The full Markdown content of the skill */
  content: string;
}
