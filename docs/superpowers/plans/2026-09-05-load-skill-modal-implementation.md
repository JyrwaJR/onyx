# Load Skill Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a bottom sheet modal in the chat screen that pulls skills from the API and allows the user to load them.

**Architecture:**
- Add a "Load Skill" button to the `ContextBar`.
- Create a `LoadSkillModal` component using React Native `Modal` to act as the bottom sheet.
- Fetch available skills using `useSkills`.
- When a skill is selected, trigger the skill load using the `/session/:id/command` endpoint with `command: "skill load"`.

**Tech Stack:** React Native, TypeScript, React Query.

---

### Task 1: Create RunCommand API Hook

**Files:**
- Create: `src/features/chat/hooks/use-run-command.ts`
- Modify: `src/features/chat/hooks/index.ts`

- [ ] **Step 1: Implement `useRunCommand` hook**
  - Use `useMutation` to post to `/session/:id/command`.

- [ ] **Step 2: Export from `hooks/index.ts`**

### Task 2: Create `LoadSkillModal` Component

**Files:**
- Create: `src/features/chat/components/LoadSkillModal.tsx`

- [ ] **Step 1: Implement `LoadSkillModal`**
  - Use `Modal` from `react-native`.
  - Fetch skills using `useSkills`.
  - Display list of skills.
  - Implement skill selection: `runCommand({ command: 'skill', arguments: 'load <skill-name>' })`.

### Task 3: Update `ContextBar`

**Files:**
- Modify: `src/features/chat/components/ContextBar.tsx`

- [ ] **Step 1: Add "Load Skill" button**
  - Add button to `ContextBar`.
  - Manage modal visibility state using `useState`.
  - Add the `LoadSkillModal` to the component.
