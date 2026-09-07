# Chat Questions — One at a Time Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the assistant asks multiple questions in one `QuestionRequest`, present them one at a time (advance on each answer) and submit all answers together once the last question is answered, instead of rendering every question simultaneously.

**Architecture:** `ChatScreen` already owns `activeQuestion` (`QuestionRequest`) and `questionAnswers` (`(string[] | null)[]` sized to the question count, one answer per question in order). The final submit already happens via the existing auto-submit effect that fires once every entry in `questionAnswers` is non-empty. We add a `currentQuestionIndex` state and render only `activeQuestion.questions[currentQuestionIndex]`. When an answer is stored for the current question we advance the index; once the last answer is stored all answers are non-null, so the existing effect posts `replyToQuestion` and clears the active question. The server submit contract (`answers: string[][]`, one per question in order) is unchanged.

**Tech Stack:** React Native, TypeScript, FlashList

---

### Task 1: Add one-at-a-time navigation state to ChatScreen

**Files:**

- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Add `currentQuestionIndex` state**

Near the existing question state declarations (`activeQuestion` / `questionAnswers`, currently at lines 82-83), add the index:

```tsx
const [activeQuestion, setActiveQuestion] = useState<QuestionRequest | null>(null);
const [questionAnswers, setQuestionAnswers] = useState<(string[] | null)[]>([]);
// Index of the question currently shown. Advances forward as the user answers;
// only one question is rendered at a time.
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
```

- [ ] **Step 2: Reset the index when a new question request arrives**

Update `handleQuestion` (currently lines 213-216):

```tsx
const handleQuestion = useCallback((request: QuestionRequest) => {
  setActiveQuestion(request);
  setQuestionAnswers(Array(request.questions.length).fill(null));
  setCurrentQuestionIndex(0);
}, []);
```

- [ ] **Step 3: Advance the index after each answer**

Update `handleQuestionSelect` (currently lines 218-224). After storing the answer, advance to the next question unless the answer just submitted was the last one (the auto-submit effect then handles the final reply):

```tsx
const handleQuestionSelect = useCallback(
  (questionIndex: number, labels: string[]) => {
    setQuestionAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = labels;
      return next;
    });
    if (!activeQuestion) return;
    // Single-select fires onSelect immediately on tap; multi/custom fire it via
    // their submit button. Either way advance to the next unanswered question.
    if (questionIndex < activeQuestion.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  },
  [activeQuestion]
);
```

> [!NOTE]
> `handleQuestionSelect` now depends on `activeQuestion` (to know the question count). Because `ChatScreen` re-creates `handleQuestionSelect` via `useCallback` with `[activeQuestion]`, this is correct and current. The `ChatSelection` memo compares props (`onSelect` identity) — a changed callback re-renders the single visible question, which is the desired behavior during the step flow.

- [ ] **Step 4: Reset the index when restoring a pending question**

Update the `listPendingQuestions` restore effect (currently lines 288-310). Keep the existing "only replace when different" guard, but also reset the index to 0 whenever the restored question differs:

```tsx
setActiveQuestion((prev) => {
  const different = !prev || prev.id !== pending.id;
  if (different) setCurrentQuestionIndex(0);
  return different ? pending : prev;
});
```

> [!IMPORTANT]
> `setCurrentQuestionIndex` is called inside the `setActiveQuestion` updater. React state updaters must be pure — mutating another state's setter inside an updater is technically a side effect. If the build agent prefers stricter correctness, replace this with a guard computed outside the updater instead:

```tsx
const prevActive = activeQuestion;
if (!prevActive || prevActive.id !== pending.id) {
  setCurrentQuestionIndex(0);
}
setActiveQuestion((prev) => (prev && prev.id === pending.id ? prev : pending));
```

This alternative is recommended: it keeps updaters free of side effects and only resets the index when the request actually changes. Both snippets produce identical behavior; pick the second form.

- [ ] **Step 5: Render only the current question**

Replace the render block that maps over all questions (currently lines 442-468). The `Ternary` keeps the `activeQuestion ? ChatSelection : MessageInput` branch, but the truthy branch now shows a single question guarded against an out-of-range index:

```tsx
<Ternary
  condition={activeQuestion ? true : false}
  truthy={
    <>
      {activeQuestion && currentQuestionIndex < activeQuestion.questions.length && (
        <View className="gap-2 px-4 pt-2">
          <ChatSelection
            key={`${activeQuestion.id}-${currentQuestionIndex}`}
            question={activeQuestion.questions[currentQuestionIndex]}
            onSelect={(labels) => handleQuestionSelect(currentQuestionIndex, labels)}
            onReject={handleRejectQuestion}
          />
        </View>
      )}
    </>
  }
  falsy={
    <MessageInput
      sessionId={sessionId}
      agent={agent}
      disabled={sendMessage.isPaused}
      onSend={handleSend}
    />
  }
/>
```

> [!NOTE]
> `handleQuestionSelect` is now invoked with `currentQuestionIndex` as the `questionIndex`, so the stored answer lands at the correct slot in `questionAnswers`. The `key` includes the index so each newly shown question mounts with fresh local state in `ChatSelection`.

- [ ] **Step 6: Verify the full flow**

The existing auto-submit effect (lines 312-323) already fires when every entry of `questionAnswers` is non-empty, calling `replyToQuestion(activeQuestion.id, answers)` then `setActiveQuestion(null)`. After the last question is answered, `currentQuestionIndex` becomes `questions.length - 1` (no advance) and all answers are filled, so the effect triggers the single final submit. No change to that effect is required.

- [ ] **Step 7: Commit**

```bash
git add src/features/chat/screens/ChatScreen.tsx
git commit -m "feat(chat): present multi-question requests one at a time"
```

---

### Task 2 (optional): Surface progress within ChatSelection

**Files:**

- Modify: `src/features/chat/components/ChatSelection.tsx`

This is an optional UX nicety — it shows "Question N of M" so the user knows how many steps remain. It does not affect the one-at-a-time logic. If omitted, skip this task and the plan remains complete.

- [ ] **Step 1: Add an optional `stepLabel` prop**

Add to the props type and component signature:

```tsx
type ChatSelectionProps = {
  /** The question data rendered as a selectable list. */
  question: ChatQuestion;
  /** Callback fired with the selected option labels once the question is answered. */
  onSelect: (labels: string[]) => void;
  /** Callback fired when the user dismisses/rejects the question. */
  onReject?: () => void;
  /** Optional label shown above the question, e.g. "Question 2 of 3". */
  stepLabel?: string;
};

export const ChatSelection = memo(function ChatSelection({
  question: chatQuestion,
  onSelect,
  onReject,
  stepLabel,
}: ChatSelectionProps) {
```

- [ ] **Step 2: Render the step label**

Inside the card `<View>` (before the question header):

```tsx
<View className="gap-3 rounded-md border border-[#dac1ba]/30 bg-[#fcf9f6] p-4">
  {stepLabel ? (
    <Text className="text-xs font-semibold uppercase tracking-wide text-[#8f482f]">
      {stepLabel}
    </Text>
  ) : null}
  <View className="flex-row items-start justify-between gap-2">
```

- [ ] **Step 3: Pass the label from ChatScreen**

In ChatScreen's render (Task 1, Step 5), add the `stepLabel` prop:

```tsx
<ChatSelection
  key={`${activeQuestion.id}-${currentQuestionIndex}`}
  question={activeQuestion.questions[currentQuestionIndex]}
  stepLabel={`Question ${currentQuestionIndex + 1} of ${activeQuestion.questions.length}`}
  onSelect={(labels) => handleQuestionSelect(currentQuestionIndex, labels)}
  onReject={handleRejectQuestion}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/features/chat/components/ChatSelection.tsx src/features/chat/screens/ChatScreen.tsx
git commit -m "feat(chat): show step progress in sequential question selection"
```

---

## Manual Verification

1. Ask the assistant a question that produces a `QuestionRequest` with multiple `questions` (e.g. a multi-step configuration prompt, or two separate option requests in one reply).
2. Confirm only the **first** question renders in the bottom input area (not all of them).
3. Answer it — for single-select, tapping an option advances; for multi/custom, pressing **Send answer** advances.
4. Confirm the **second** question now renders, and so on through the last question.
5. On the last question, confirm the final answer triggers exactly **one** `replyToQuestion` call (check the network tab for `POST .../question/<id>/reply` with an `answers` array of `string[][]` matching the question count and order).
6. Confirm the question area clears afterward and `MessageInput` returns.
7. Reload the app while a multi-question request is pending and confirm the restored flow starts again at question 1.

## Edge Cases

- **Single-question request:** `currentQuestionIndex` stays `0`, the single `ChatSelection` renders, answering fills the sole slot → auto-submit fires. Unchanged from today.
- **Reject:** `handleRejectQuestion` rejects the whole request and clears `activeQuestion`; `currentQuestionIndex` is reset on the next request via `handleQuestion`.
- **Empty questions array:** the render guard `currentQuestionIndex < activeQuestion.questions.length` (0 < 0 is false) renders nothing; the auto-submit effect early-returns for a zero-length request. Preserves current behavior.
- **Rapid new question while answering:** a fresh `handleQuestion` resets `questionAnswers` and `currentQuestionIndex`, and its `key` (request id + index) remounts the visible question cleanly.
