# Money amount field (input + suggestion chips) — design

**Status:** Approved for implementation (v1 scope locked).  
**Date:** 2026-04-11

## Goal

Extract a reusable **block** component: **money input** (formatted display, suffix `đ`, a11y) + **optional suggestion chips**, matching the current **reward** screen behavior and visuals. Parent routes own **validation**, **react-hook-form** wiring, and **how suggestions are computed** (e.g. `getSuggestions(typedDigits)`).

## Non-goals (v1)

- No second visual variant (e.g. treasury/neutral); v1 ships **reward styling only**. Other pages can migrate later behind a future `variant` or separate component.
- No change to business rules (min/max amount, rounding) inside the shared component — those stay in page-level Zod schemas and handlers.

## Placement

- **Component:** `src/components/common/MoneyAmountField.tsx` — export `MoneyAmountField`.
- **Shared formatting:** Consolidate display formatting with existing helpers where possible. Today `reward.lazy.tsx` defines local `formatVND`; `src/components/adult/reward/rewardFormat.ts` exposes `formatRewardAmountDisplay` (includes trailing ` đ`). Implementation should **use one canonical formatter** for chip labels and display strings to avoid drift (either extend `rewardFormat.ts` or add `src/utils/moneyFormat.ts` — pick one location in the implementation plan).

## Public API (controlled)

| Prop | Type | Notes |
|------|------|--------|
| `label` | `string` | Visible label (required for v1). |
| `isRequired` | `boolean` | Shows `*` when true. |
| `value` | `string` | Display value in the input (e.g. formatted amount string). |
| `onChange` | `(value: string) => void` | Compatible with current reward `handleAmountChange` receiving raw input string from the field. |
| `onBlur` | `() => void` | Pass-through for `Controller` / RHF. |
| `error` | `string \| undefined` | Shown below input when set. |
| `placeholder` | `string` | Default e.g. `"0"`. |
| `suggestions` | `number[]` | Chip amounts; **hide chip row** when empty. |
| `selectedAmount` | `number \| undefined` | Drives `aria-pressed` / selected chip styling. |
| `onPickSuggestion` | `(amount: number) => void` | Chip click handler. |
| `suggestionGroupLabel` | `string` | Optional; default e.g. `"Gợi ý số tiền"` for `aria-label` on the chip group. |
| `className` | `string` | Optional wrapper spacing. |

Internal implementation should use **`useTextField`** from `@react-aria/textfield` for the input (parity with current `AmountField` in `reward.lazy.tsx`).

## Behavior

- **Input:** `inputMode="numeric"`, `autoComplete="off"`, validation state from `error`.
- **Chips:** Same layout and classes as current `SuggestionTags` in `reward.lazy.tsx` (flex wrap, orange selected state). No chips rendered when `suggestions.length === 0`.
- **Spacing:** Preserve vertical rhythm equivalent to current form (margin below block consistent with replacing `AmountField` + `SuggestionTags`).

## Migration (first consumer)

- **`src/routes/_app/adult/_layout/reward.lazy.tsx`:** Replace local `AmountField` and `SuggestionTags` with `MoneyAmountField`; keep `handleAmountChange`, `pickSuggestion`, `getSuggestions`, RHF `Controller`, and `suggestionTagsDismissed` logic in the route.

## Testing / verification

- Manual: reward flow — type digits, see formatted value, chips appear, pick chip, submit validation unchanged.
- No new automated test required unless project convention mandates component tests for common UI; follow repo patterns.

## Future (out of v1)

- Optional `variant: 'neutral' | 'reward'` for treasury/target.
- Optional export `MoneySuggestionChips` if a screen needs chips without this input shell.
