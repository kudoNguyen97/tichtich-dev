# MoneyAmountField implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable `MoneyAmountField` (reward-styled input + optional suggestion chips) and migrate `reward.lazy.tsx` to use it, with a single canonical VND amount formatter in `rewardFormat.ts`.

**Architecture:** One presentational component in `src/components/common/` uses `useTextField` from `@react-aria/textfield` (same as current inline `AmountField`). Chip row renders only when `suggestions.length > 0`. Parent keeps all RHF state, `getSuggestions`, and dismiss logic. Number formatting for display lives in `src/components/adult/reward/rewardFormat.ts` so chips and future callers stay consistent.

**Tech stack:** React 19, TypeScript, Tailwind, `@react-aria/textfield`, `react-hook-form` (consumer only), existing `@/utils/cn`.

---

## File map

| File | Action |
|------|--------|
| `src/components/adult/reward/rewardFormat.ts` | Add `formatVndAmount`; refactor `formatRewardAmountDisplay` to reuse it |
| `src/components/common/MoneyAmountField.tsx` | **Create** — `MoneyAmountField` export |
| `src/routes/_app/adult/_layout/reward.lazy.tsx` | Remove local `AmountField`, `SuggestionTags`, local `formatVND`; import component + `formatVndAmount` for schema string |

---

### Task 1: Canonical `formatVndAmount` in `rewardFormat.ts`

**Files:**
- Modify: `src/components/adult/reward/rewardFormat.ts`

- [ ] **Step 1: Implement helpers**

Replace the file contents with:

```ts
/** Số tiền chỉ phần số (locale de-DE), ví dụ 1000 → "1.000". Dùng cho input và chuỗi trong schema. */
export function formatVndAmount(n: number): string {
    if (n !== 0 && !n) return '';
    return n.toLocaleString('de-DE');
}

/** Số tiền hiển thị kiểu VN: 230.000 đ */
export function formatRewardAmountDisplay(n: number): string {
    const s = formatVndAmount(n);
    return s === '' ? '' : `${s} đ`;
}
```

- [ ] **Step 2: Verify callers still typecheck**

`RewardSummaryDetails.tsx` only imports `formatRewardAmountDisplay` — signature unchanged.

Run: `npm run build`  
Expected: success (no emit errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/adult/reward/rewardFormat.ts
git commit -m "refactor(reward): add formatVndAmount and reuse in formatRewardAmountDisplay"
```

---

### Task 2: Create `MoneyAmountField` component

**Files:**
- Create: `src/components/common/MoneyAmountField.tsx`

- [ ] **Step 1: Add the component**

```tsx
import { useRef } from 'react';
import { useTextField } from '@react-aria/textfield';
import { cn } from '@/utils/cn';
import { formatRewardAmountDisplay } from '@/components/adult/reward/rewardFormat';

export interface MoneyAmountFieldProps {
    label: string;
    isRequired?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    placeholder?: string;
    suggestions: number[];
    selectedAmount?: number;
    onPickSuggestion: (amount: number) => void;
    suggestionGroupLabel?: string;
    className?: string;
}

const inputClassName = [
    'w-full h-[52px] rounded-xl border bg-white',
    'pl-4 pr-10 text-lg font-bold text-orange-500',
    'outline-none transition-colors placeholder:text-gray-300',
    'focus:ring-2 focus:ring-orange-300',
].join(' ');

export function MoneyAmountField({
    label,
    isRequired = false,
    value,
    onChange,
    onBlur,
    error,
    placeholder = '0',
    suggestions,
    selectedAmount,
    onPickSuggestion,
    suggestionGroupLabel = 'Gợi ý số tiền',
    className,
}: MoneyAmountFieldProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { labelProps, inputProps, errorMessageProps } = useTextField(
        {
            label,
            isRequired,
            value,
            onChange,
            onBlur,
            validationState: error ? 'invalid' : 'valid',
            inputMode: 'numeric',
            autoComplete: 'off',
        },
        ref
    );

    return (
        <div className={cn(className)}>
            <div className="mb-5">
                <label
                    {...labelProps}
                    className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-2"
                >
                    {label}{' '}
                    {isRequired && (
                        <span className="text-red-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>

                <div className="relative">
                    <input
                        {...inputProps}
                        ref={ref}
                        placeholder={placeholder}
                        className={cn(
                            inputClassName,
                            error
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-amber-300 hover:border-amber-400 focus:border-orange-400'
                        )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-orange-400 pointer-events-none select-none">
                        đ
                    </span>
                </div>

                {error ? (
                    <p
                        {...errorMessageProps}
                        role="alert"
                        className="mt-1.5 text-xs text-red-500"
                    >
                        {error}
                    </p>
                ) : null}
            </div>

            {suggestions.length > 0 ? (
                <div
                    role="group"
                    aria-label={suggestionGroupLabel}
                    className="flex flex-wrap gap-2 -mt-2 mb-5"
                >
                    {suggestions.map((amount) => {
                        const isSelected = amount === selectedAmount;
                        return (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => onPickSuggestion(amount)}
                                aria-pressed={isSelected}
                                className={[
                                    'px-4 py-2 rounded-xl border text-sm font-bold transition-colors',
                                    isSelected
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'bg-white border-amber-300 text-orange-500 hover:bg-amber-50 hover:border-amber-400',
                                ].join(' ')}
                            >
                                {formatRewardAmountDisplay(amount)}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`  
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/MoneyAmountField.tsx
git commit -m "feat(common): add MoneyAmountField for reward-style amount + chips"
```

---

### Task 3: Migrate `reward.lazy.tsx`

**Files:**
- Modify: `src/routes/_app/adult/_layout/reward.lazy.tsx`

- [ ] **Step 1: Update imports**

At top of file:
- Add: `import { MoneyAmountField } from '@/components/common/MoneyAmountField';`
- Add: `import { formatVndAmount } from '@/components/adult/reward/rewardFormat';`
- Remove: `import { useTextField } from '@react-aria/textfield';` **only if** no longer used — **keep** `useTextField` because `MessageField` still uses it.

- [ ] **Step 2: Replace helpers**

- Delete local function `formatVND` (lines ~40–44).
- In the Zod schema, replace `formatVND(MIN_AMOUNT)` with `` `${formatVndAmount(MIN_AMOUNT)}đ` `` (keep same Vietnamese message punctuation as today: note **no** space before `đ` in that sentence, matching existing `}đ.` pattern).

- [ ] **Step 3: Remove local `AmountField` and `SuggestionTags`**

Delete the entire `AmountField` function block and the entire `SuggestionTags` function block (previously ~lines 61–218).

- [ ] **Step 4: Wire the form `Controller`**

Remove the old `Controller` + `AmountField` and the separate `{!suggestionTagsDismissed && <SuggestionTags ... />}`. Replace with **one** `Controller` that always renders `MoneyAmountField`. When the user picks a chip, `suggestionTagsDismissed` is true and only chips should disappear — pass empty suggestions, **do not** wrap the `Controller` in `{!suggestionTagsDismissed && ...}` (that would hide the input too).

```tsx
<Controller
    name="amount"
    control={control}
    render={({ field: { onBlur } }) => (
        <MoneyAmountField
            label="Tặng thưởng"
            isRequired
            value={displayValue}
            onChange={handleAmountChange}
            onBlur={onBlur}
            error={amountFieldError}
            suggestions={suggestionTagsDismissed ? [] : suggestions}
            selectedAmount={currentAmount}
            onPickSuggestion={pickSuggestion}
        />
    )}
/>
```

- [ ] **Step 5: Run build and quick manual check**

Run: `npm run build`  
Expected: success.

Manual (optional): `npm run dev`, open adult reward route, type digits → formatted input + chips; pick chip → chips hide; submit → same validation.

- [ ] **Step 6: Commit**

```bash
git add src/routes/_app/adult/_layout/reward.lazy.tsx
git commit -m "refactor(reward): use MoneyAmountField and formatVndAmount"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| Component at `src/components/common/MoneyAmountField.tsx` | Task 2 |
| `useTextField` for input | Task 2 |
| Props: label, value, onChange, onBlur, error, suggestions, selectedAmount, onPickSuggestion, etc. | Task 2 |
| Canonical formatter | Task 1; chips use `formatRewardAmountDisplay` via Task 2 |
| First consumer `reward.lazy.tsx` | Task 3 |
| Dismiss chips without hiding input | Task 3 Step 4 (`suggestions={suggestionTagsDismissed ? [] : suggestions}`) |

## Placeholder scan

No TBD steps; all code blocks are complete.

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-11-money-amount-field.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach do you want?**
