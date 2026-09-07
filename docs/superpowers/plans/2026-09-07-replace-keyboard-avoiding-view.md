# Replace KeyboardAvoidingView with KeyboardStickyView Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all occurrences of `KeyboardAvoidingView` from `react-native` with `KeyboardStickyView` from `react-native-keyboard-controller` across the codebase.

**Architecture:** We will replace the standard `KeyboardAvoidingView` component with the `KeyboardStickyView` component in the identified screen components. This ensures better handling of keyboard interactions, especially with `react-native-keyboard-controller`.

**Tech Stack:**

- React Native
- react-native-keyboard-controller

---

### Task 1: Replace in `src/features/sessions/components/NewSessionForm.tsx`

**Files:**

- Modify: `src/features/sessions/components/NewSessionForm.tsx`

- [ ] **Step 1: Read the file to get context**
      Run: `read src/features/sessions/components/NewSessionForm.tsx`

- [ ] **Step 2: Edit imports**
      Remove `KeyboardAvoidingView` from `react-native` imports.
      Add `import { KeyboardStickyView } from 'react-native-keyboard-controller';`

- [ ] **Step 3: Replace component**
      Replace `<KeyboardAvoidingView ...>` with `<KeyboardStickyView ...>`.
      Note: Check if props need adjustment (e.g., `behavior` prop might not be needed or might need mapping).

- [ ] **Step 4: Verify/Commit**
      Run build command to ensure no errors.
      `git add src/features/sessions/components/NewSessionForm.tsx`
      `git commit -m "refactor: replace KeyboardAvoidingView with KeyboardStickyView in NewSessionForm"`

### Task 2: Replace in `.worktrees/fix/rename-onyx-to-agenyx/src/features/chat/screens/ChatScreen.tsx`

**Files:**

- Modify: `.worktrees/fix/rename-onyx-to-agenyx/src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Read the file to get context**
      Run: `read .worktrees/fix/rename-onyx-to-agenyx/src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 2: Edit imports**
      Remove `KeyboardAvoidingView` from `react-native` imports.
      Add `import { KeyboardStickyView } from 'react-native-keyboard-controller';`

- [ ] **Step 3: Replace component**
      Replace `<KeyboardAvoidingView ...>` with `<KeyboardStickyView ...>`.

- [ ] **Step 4: Verify/Commit**
      Run build command to ensure no errors.
      `git add .worktrees/fix/rename-onyx-to-agenyx/src/features/chat/screens/ChatScreen.tsx`
      `git commit -m "refactor: replace KeyboardAvoidingView with KeyboardStickyView in ChatScreen"`

### Task 3: Replace in `.worktrees/fix/rename-onyx-to-agenyx/src/features/sessions/components/NewSessionForm.tsx`

**Files:**

- Modify: `.worktrees/fix/rename-onyx-to-agenyx/src/features/sessions/components/NewSessionForm.tsx`

- [ ] **Step 1: Read the file to get context**
      Run: `read .worktrees/fix/rename-onyx-to-agenyx/src/features/sessions/components/NewSessionForm.tsx`

- [ ] **Step 2: Edit imports**
      Remove `KeyboardAvoidingView` from `react-native` imports.
      Add `import { KeyboardStickyView } from 'react-native-keyboard-controller';`

- [ ] **Step 3: Replace component**
      Replace `<KeyboardAvoidingView ...>` with `<KeyboardStickyView ...>`.

- [ ] **Step 4: Verify/Commit**
      Run build command to ensure no errors.
      `git add .worktrees/fix/rename-onyx-to-agenyx/src/features/sessions/components/NewSessionForm.tsx`
      `git commit -m "refactor: replace KeyboardAvoidingView with KeyboardStickyView in NewSessionForm (worktree)"`

---
