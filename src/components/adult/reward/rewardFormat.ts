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
