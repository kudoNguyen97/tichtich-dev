/** So tien chi phan so (locale de-DE), vi du 1000 -> "1.000". Dung cho input va chuoi trong schema. */
export function formatVndAmount(n: number): string {
    if (n !== 0 && !n) return '';
    return n.toLocaleString('de-DE');
}

/** So tien hien thi kieu VN: 230.000 d */
export function formatRewardAmountDisplay(n: number): string {
    const s = formatVndAmount(n);
    return s === '' ? '' : `${s} đ`;
}
