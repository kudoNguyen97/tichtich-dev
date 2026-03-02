export function formatNumber(value: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(
    value: number,
    currency = 'USD',
    locale = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatDate(
    date: string | Date,
    locale = 'en-US',
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }
): string {
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '…';
}
