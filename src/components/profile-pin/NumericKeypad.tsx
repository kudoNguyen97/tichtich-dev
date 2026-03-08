import { Delete } from 'lucide-react';
import { cn } from '@/utils/cn';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'] as const;

interface NumericKeypadProps {
  pinLength: number;
  currentLength: number;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  className?: string;
}

export function NumericKeypad({
  pinLength,
  currentLength,
  onDigit,
  onBackspace,
  className,
}: NumericKeypadProps) {
  const canAdd = currentLength < pinLength;

  return (
    <div
      className={cn(
        'grid w-full max-w-[280px] grid-cols-3 gap-3',
        className
      )}
    >
      {KEYS.map((key, i) => {
        const uniqueKey = `keypad-${i}`;
        if (key === '') return <div key={uniqueKey} />;
        if (key === 'delete') {
          return (
            <button
              key={uniqueKey}
              type="button"
              onClick={onBackspace}
              disabled={currentLength === 0}
              className="flex h-20 w-20 items-center justify-center rounded-full border border-tichtich-black cursor-pointer bg-white text-tichtich-black transition-opacity hover:bg-gray-50 active:scale-95 disabled:opacity-30"
              aria-label="Xóa"
            >
              <Delete className="size-5" />
            </button>
          );
        }
        return (
          <button
            key={uniqueKey}
            type="button"
            onClick={() => onDigit(key)}
            disabled={!canAdd}
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-full border border-tichtich-black cursor-pointer bg-white text-xl font-semibold text-tichtich-black transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
