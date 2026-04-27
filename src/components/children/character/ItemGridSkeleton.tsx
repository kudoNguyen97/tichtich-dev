interface Props {
    count?: number;
}

export function ItemGridSkeleton({ count = 6 }: Props) {
    return (
        <div
            className="mt-3 grid grid-cols-3 gap-3"
            aria-busy="true"
            aria-live="polite"
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center gap-2 rounded-lg p-2"
                >
                    <div className="aspect-square w-full animate-pulse rounded-xl bg-[#ACA290]/70" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-[#ACA290]/60" />
                    <div className="h-3 w-2/5 animate-pulse rounded bg-[#ACA290]/60" />
                </div>
            ))}
        </div>
    );
}
