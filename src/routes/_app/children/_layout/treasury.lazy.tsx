import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { useState, useCallback, useMemo } from 'react';
import {
    Button,
    Slider,
    SliderTrack,
    SliderThumb,
    SliderOutput,
    Label,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    TextField,
    Input,
} from 'react-aria-components';
import dayjs from 'dayjs';
import { cn } from '@/utils/cn';
import { AllocationChart } from '@/components/children/treasury/AllocationChart';
import { CategorySlider } from '@/components/children/treasury/CategorySlider';

const formatMoney = (n: any) => n.toLocaleString('vi-VN') + ' đ';

const DEFAULT_CATEGORIES = [
    { id: 'savings', label: 'Tiết kiệm', icon: '/icons/save.svg', amount: 0 },
    { id: 'learning', label: 'Học tập', icon: '/icons/study.svg', amount: 0 },
    {
        id: 'charity',
        label: 'Từ thiện',
        icon: '/icons/charity-heart.svg',
        amount: 0,
    },
    {
        id: 'spending',
        label: 'Tiêu vặt',
        icon: '/icons/candy.svg',
        amount: 0,
    },
];

// Soft pastel-accent palette mapped to each category
const CAT_COLORS = {
    savings: { track: '#10b981', thumb: '#059669' }, // emerald
    learning: '#6366f1', // indigo
    charity: '#f43f5e', // rose
    spending: '#f59e0b', // amber
};

const getColor = (id: any) => {
    const c = CAT_COLORS[id as keyof typeof CAT_COLORS];
    return typeof c === 'string' ? c : c.track;
};

export const Route = createLazyFileRoute('/_app/children/_layout/treasury')({
    component: RouteComponent,
});

// function RouteComponent() {
//     const profile = useSelectedChildProfile();
//     if (!profile) return null;
//     return (
//         <div className="flex flex-col items-center justify-center px-6 py-12"></div>
//     );
// }

function RouteComponent() {
    const [totalInput, setTotalInput] = useState('200000');
    const total = Number(totalInput) || 0;
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    const allocated = useMemo(
        () => categories.reduce((s, c) => s + c.amount, 0),
        [categories]
    );

    const isFullyAllocated = total > 0 && allocated === total;

    const handleSliderChange = useCallback(
        (id: any, newValue: any) => {
            setCategories((prev) => {
                const otherSum = prev.reduce(
                    (s, c) => (c.id === id ? s : s + c.amount),
                    0
                );
                const maxAllowed = Math.max(0, total - otherSum);
                const clamped = Math.min(newValue, maxAllowed);
                return prev.map((c) =>
                    c.id === id ? { ...c, amount: clamped } : c
                );
            });
        },
        [total]
    );

    const applyPreset = (ratios: any) => {
        if (total <= 0) return;
        setCategories((prev) =>
            prev.map((c, i) => ({
                ...c,
                amount: Math.floor(total * (ratios[i] / 100)),
            }))
        );
    };

    const percentOf = (amount: any) =>
        total > 0 ? Math.round((amount / total) * 100) : 0;

    const handleSubmit = () => {
        if (!isFullyAllocated) return;
        console.log('Submit thêm tiền:', { total, categories });
    };

    // return (
    //     <div className="min-h-screen flex justify-center">
    //         <div className="w-full max-w-[680px] px-4 py-8 space-y-5">
    //             {/* ── Tabs (React Aria) ── */}
    //             <Tabs defaultSelectedKey="add" className="w-full">
    //                 <TabList
    //                     aria-label="Chức năng"
    //                     className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white shadow-sm border border-[#e5e7eb] mb-4"
    //                 >
    //                     {[
    //                         { key: 'add', label: '💰 Thêm tiền' },
    //                         { key: 'spend', label: '💸 Chi tiền' },
    //                     ].map(({ key, label }) => (
    //                         <Tab
    //                             key={key}
    //                             id={key}
    //                             className={({ isSelected }) =>
    //                                 `cursor-pointer rounded-xl py-3 text-sm font-bold text-center transition-all duration-200 outline-none
    //                 ${
    //                     isSelected
    //                         ? 'bg-[#1a1a2e] text-white shadow-md'
    //                         : 'text-[#6b7280] hover:text-[#1a1a2e]'
    //                 }`
    //                             }
    //                         >
    //                             {label}
    //                         </Tab>
    //                     ))}
    //                 </TabList>

    //                 {/* ── Tab: Thêm tiền ── */}
    //                 <TabPanel id="add">
    //                     <div className="rounded-3xl bg-white border border-[#e5e7eb] p-6 shadow-sm space-y-7">
    //                         {/* Header + progress */}
    //                         <div className="flex items-start justify-between">
    //                             <div>
    //                                 <h1 className="text-xl font-black text-[#1a1a2e]">
    //                                     Cùng chia tiền nào 🎯
    //                                 </h1>
    //                                 <p className="text-sm text-[#9ca3af] mt-0.5">
    //                                     Kéo thanh trượt để phân bổ
    //                                 </p>
    //                             </div>
    //                             <div className="text-right">
    //                                 <p className="text-xs text-[#9ca3af]">
    //                                     Đã chia
    //                                 </p>
    //                                 <p className="text-base font-extrabold text-[#1a1a2e]">
    //                                     {formatMoney(allocated)}
    //                                 </p>
    //                                 <p className="text-xs text-[#9ca3af]">
    //                                     / {formatMoney(total)}
    //                                 </p>
    //                             </div>
    //                         </div>

    //                         {/* Total input (React Aria TextField) */}
    //                         <TextField
    //                             aria-label="Số tiền muốn chia"
    //                             value={totalInput}
    //                             onChange={(val) => {
    //                                 setTotalInput(val);
    //                                 setCategories(DEFAULT_CATEGORIES);
    //                             }}
    //                             className="space-y-1.5"
    //                         >
    //                             <Label className="text-sm font-bold text-[#374151] block">
    //                                 Số tiền muốn chia
    //                             </Label>
    //                             <Input
    //                                 type="number"
    //                                 placeholder="Nhập số tiền..."
    //                                 className="w-full rounded-xl border-2 border-[#e5e7eb] bg-[#f9fafb] px-4 py-3
    //                            text-sm font-semibold text-[#1a1a2e] placeholder:text-[#d1d5db]
    //                            focus:outline-none focus:border-[#1a1a2e] transition-colors"
    //                             />
    //                         </TextField>

    //                         {/* Distribution visual bar */}
    //                         <div className="space-y-2">
    //                             <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
    //                                 Phân bổ hiện tại
    //                             </p>
    //                             <div className="flex gap-1.5 h-10 rounded-xl overflow-hidden">
    //                                 {categories.map((c) => {
    //                                     const pct = percentOf(c.amount);
    //                                     return (
    //                                         <div
    //                                             key={c.id}
    //                                             className="flex flex-col items-center justify-center transition-all duration-500 min-w-[2%]"
    //                                             style={{
    //                                                 flex: Math.max(pct, 2),
    //                                                 backgroundColor: getColor(
    //                                                     c.id
    //                                                 ),
    //                                                 borderRadius: 10,
    //                                             }}
    //                                         >
    //                                             {pct >= 10 && (
    //                                                 <span className="text-[11px] font-black text-white drop-shadow-sm">
    //                                                     {c.icon} {pct}%
    //                                                 </span>
    //                                             )}
    //                                         </div>
    //                                     );
    //                                 })}
    //                                 {allocated < total && (
    //                                     <div
    //                                         className="bg-[#f3f4f6] rounded-xl flex items-center justify-center transition-all duration-500"
    //                                         style={{
    //                                             flex: Math.max(
    //                                                 100 - percentOf(allocated),
    //                                                 2
    //                                             ),
    //                                         }}
    //                                     >
    //                                         <span className="text-[11px] text-[#d1d5db] font-bold">
    //                                             {100 - percentOf(allocated)}%
    //                                         </span>
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         </div>

    //                         {/* Sliders (React Aria Slider) */}
    //                         <div className="space-y-6">
    //                             {categories.map((c) => {
    //                                 const pct = percentOf(c.amount);
    //                                 const color = getColor(c.id);
    //                                 return (
    //                                     <Slider
    //                                         key={c.id}
    //                                         aria-label={c.label}
    //                                         minValue={0}
    //                                         maxValue={Math.max(total, 1)}
    //                                         step={1000}
    //                                         value={c.amount}
    //                                         onChange={(val) =>
    //                                             handleSliderChange(c.id, val)
    //                                         }
    //                                         className="space-y-2"
    //                                     >
    //                                         <div className="flex items-center justify-between">
    //                                             <Label className="text-sm font-bold text-[#1a1a2e] flex items-center gap-1.5">
    //                                                 <span className="text-base">
    //                                                     {c.icon}
    //                                                 </span>
    //                                                 {c.label}
    //                                                 <span
    //                                                     className="ml-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-white"
    //                                                     style={{
    //                                                         backgroundColor:
    //                                                             color,
    //                                                     }}
    //                                                 >
    //                                                     {pct}%
    //                                                 </span>
    //                                             </Label>
    //                                             <SliderOutput className="text-sm font-extrabold text-[#1a1a2e]">
    //                                                 {formatMoney(c.amount)}
    //                                             </SliderOutput>
    //                                         </div>

    //                                         <SliderTrack className="relative h-3 w-full rounded-full bg-[#f3f4f6]">
    //                                             {/* filled portion */}
    //                                             <div
    //                                                 className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
    //                                                 style={{
    //                                                     width: `${pct}%`,
    //                                                     backgroundColor: color,
    //                                                 }}
    //                                             />
    //                                             <SliderThumb
    //                                                 className="top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg
    //                                    flex items-center justify-center text-base cursor-grab active:cursor-grabbing
    //                                    outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform
    //                                    hover:scale-110 active:scale-95"
    //                                                 style={{
    //                                                     backgroundColor: color,
    //                                                 }}
    //                                             >
    //                                                 <span className="pointer-events-none select-none text-sm leading-none">
    //                                                     {c.icon}
    //                                                 </span>
    //                                             </SliderThumb>
    //                                         </SliderTrack>
    //                                     </Slider>
    //                                 );
    //                             })}
    //                         </div>

    //                         {/* Preset buttons */}
    //                         <div className="grid grid-cols-2 gap-3">
    //                             {[
    //                                 {
    //                                     label: '40-30-20-10',
    //                                     sub: 'T.Kiệm · H.Tập · T.Thiện · T.Vặt',
    //                                     ratios: [40, 30, 20, 10],
    //                                 },
    //                                 {
    //                                     label: 'Chia đều',
    //                                     sub: 'Mỗi túi một phần bằng nhau',
    //                                     ratios: [25, 25, 25, 25],
    //                                 },
    //                             ].map(({ label, sub, ratios }) => (
    //                                 <Button
    //                                     key={label}
    //                                     onPress={() => applyPreset(ratios)}
    //                                     className="rounded-2xl border-2 border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-left
    //                              cursor-pointer hover:border-[#1a1a2e] hover:bg-white transition-all duration-150
    //                              outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a2e] pressed:scale-[.98]"
    //                                 >
    //                                     <p className="text-sm font-extrabold text-[#1a1a2e]">
    //                                         {label}
    //                                     </p>
    //                                     <p className="text-xs text-[#9ca3af] mt-0.5">
    //                                         {sub}
    //                                     </p>
    //                                 </Button>
    //                             ))}
    //                         </div>

    //                         {/* Submit */}
    //                         <Button
    //                             onPress={handleSubmit}
    //                             isDisabled={!isFullyAllocated}
    //                             className={`w-full py-4 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-200
    //                 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1a1a2e]
    //                 pressed:scale-[.98]
    //                 ${
    //                     isFullyAllocated
    //                         ? 'bg-[#1a1a2e] text-white shadow-lg hover:bg-[#2d2d4a] cursor-pointer'
    //                         : 'bg-[#f3f4f6] text-[#d1d5db] cursor-not-allowed'
    //                 }`}
    //                         >
    //                             {isFullyAllocated
    //                                 ? '✅ Xác nhận thêm tiền'
    //                                 : `Còn ${formatMoney(total - allocated)} chưa chia`}
    //                         </Button>
    //                     </div>
    //                 </TabPanel>

    //                 {/* ── Tab: Chi tiền ── */}
    //                 <TabPanel id="spend">
    //                     <div
    //                         className="rounded-3xl bg-white border border-[#e5e7eb] p-6 shadow-sm
    //                           flex flex-col items-center justify-center min-h-[260px] gap-3"
    //                     >
    //                         <span className="text-5xl">🚧</span>
    //                         <p className="text-base font-bold text-[#374151]">
    //                             Chức năng chi tiền
    //                         </p>
    //                         <p className="text-sm text-[#9ca3af] text-center max-w-[240px]">
    //                             Đang được phát triển, sẽ ra mắt sớm thôi!
    //                         </p>
    //                     </div>
    //                 </TabPanel>
    //             </Tabs>
    //         </div>
    //     </div>
    // );
    return (
        <div className=" mx-auto min-h-screen bg-background">
            <div className="p-4">
                {/* ── Top bar ── */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                        {dayjs().format('DD/MM/YYYY')}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                        Hôm nay conan làm gì ?
                    </span>
                </div>

                <Tabs defaultSelectedKey="add" className="flex flex-col gap-4">
                    <TabList
                        aria-label="Chức năng"
                        className="grid grid-cols-2 gap-3"
                    >
                        {[
                            { key: 'add', symbol: '+', label: 'Thêm tiền' },
                            { key: 'spend', symbol: '−', label: 'Chi tiền' },
                        ].map(({ key, symbol, label }) => (
                            <Tab
                                key={key}
                                id={key}
                                className={({ isSelected }) =>
                                    cn(
                                        'bg-tichtich-primary-300',
                                        isSelected
                                            ? 'border-2 border-tichtich-black'
                                            : 'border-1.5 border-tichtich-primary-200',
                                        'rounded-2xl p-3'
                                    )
                                }
                            >
                                <div className="size-11 rounded-full bg-tichtich-primary-200 flex items-center justify-center text-2xl text-white font-bold leading-none">
                                    {symbol}
                                </div>
                                <span className="text-sm font-bold text-tichtich-black">
                                    {label}
                                </span>
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanel id="add" className="flex flex-col gap-4">
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-tichtich-black">
                                Hôm nay mình nhận{' '}
                                <span className="text-tichtich-red">*</span>
                            </label>
                            <div className="bg-white border border-tichtich-primary-200 rounded-xl h-13 flex items-center gap-2 p-3">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatMoney(total)}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        );
                                        setTotalInput(raw || '0');
                                        setCategories(DEFAULT_CATEGORIES);
                                    }}
                                    className="flex-1 border-none outline-none text-base font-bold text-tichtich-black bg-transparent"
                                />
                                <span className="text-sm font-bold text-muted-foreground">
                                    đ
                                </span>
                            </div>
                        </div>

                        {/* Split section */}
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-4">
                            {/* Header */}
                            <div>
                                <p className="text-base font-bold text-tichtich-black mb-0">
                                    Cùng chia tiền nào
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 mb-0">
                                    Đã chia:{' '}
                                    <span className="text-tichtich-red font-bold">
                                        {formatMoney(allocated)}
                                    </span>
                                    /{formatMoney(total)}
                                </p>
                            </div>

                            {/* Distribution visual */}
                            <div>
                                <p className="text-sm font-bold text-tichtich-black mb-0">
                                    Danh mục đang phân bổ
                                </p>
                                {/* <div className="relative h-14 mb-1">
                                    {categories.map((c, i) => {
                                        if (i !== 1 && i !== 3) return null;
                                        const leftPct = categories
                                            .slice(0, i)
                                            .reduce(
                                                (s, x) =>
                                                    s +
                                                    Math.max(
                                                        percentOf(x.amount),
                                                        1
                                                    ),
                                                0
                                            );
                                        const myPct = Math.max(
                                            percentOf(c.amount),
                                            1
                                        );
                                        const totalFlex =
                                            categories.reduce(
                                                (s, x) =>
                                                    s +
                                                    Math.max(
                                                        percentOf(x.amount),
                                                        1
                                                    ),
                                                0
                                            ) +
                                            (allocated < total
                                                ? Math.max(
                                                      100 -
                                                          percentOf(allocated),
                                                      1
                                                  )
                                                : 0);
                                        const leftActual =
                                            (leftPct / totalFlex) * 100;
                                        const widthActual =
                                            (myPct / totalFlex) * 100;
                                        return (
                                            <div
                                                key={c.id}
                                                className={`absolute left-[${leftActual + widthActual / 2}%] translate-x-[-50%] top-0 flex flex-col items-center gap-2 transition-left duration-300`}
                                            >
                                                <span className="text-xs text-muted-foreground font-bold whitespace-nowrap">
                                                    {c.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-bold whitespace-nowrap">
                                                    {formatMoney(c.amount)}
                                                </span>
                                                <div className="size-8 rounded-full bg-tichtich-primary-200 flex items-center justify-center text-base cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform hover:scale-110 active:scale-95">
                                                    {c.icon}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div> */}
                                <AllocationChart
                                    categories={categories}
                                    total={total}
                                    allocated={allocated}
                                />

                                {/* Bar */}
                                {/* <div className="flex rounded-xl overflow-hidden h-12">
                                    {categories.map((c, i) => {
                                        const pct = Math.max(
                                            percentOf(c.amount),
                                            1
                                        );
                                        return (
                                            <div
                                                key={c.id}
                                                className={`flex-[${pct}] bg-[${getColor(c.id)}] flex items-center justify-center transition-flex duration-400`}
                                            >
                                                <span className="text-xs font-bold text-white">
                                                    {percentOf(c.amount)}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {allocated < total && (
                                        <div
                                            className={`flex-[${Math.max(100 - percentOf(allocated), 1)}] bg-[#F5EDD8] transition-flex duration-400`}
                                        />
                                    )}
                                </div> */}

                                {/* Icons BELOW bar (savings index 0, charity index 2) */}
                                {/* <div className="relative h-14 mt-1">
                                    {categories.map((c, i) => {
                                        if (i !== 0 && i !== 2) return null;
                                        const leftPct = categories
                                            .slice(0, i)
                                            .reduce(
                                                (s, x) =>
                                                    s +
                                                    Math.max(
                                                        percentOf(x.amount),
                                                        1
                                                    ),
                                                0
                                            );
                                        const myPct = Math.max(
                                            percentOf(c.amount),
                                            1
                                        );
                                        const totalFlex =
                                            categories.reduce(
                                                (s, x) =>
                                                    s +
                                                    Math.max(
                                                        percentOf(x.amount),
                                                        1
                                                    ),
                                                0
                                            ) +
                                            (allocated < total
                                                ? Math.max(
                                                      100 -
                                                          percentOf(allocated),
                                                      1
                                                  )
                                                : 0);
                                        const leftActual =
                                            (leftPct / totalFlex) * 100;
                                        const widthActual =
                                            (myPct / totalFlex) * 100;
                                        return (
                                            <div
                                                key={c.id}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${leftActual + widthActual / 2}%`,
                                                    transform:
                                                        'translateX(-50%)',
                                                    top: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    transition: 'left 0.3s',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            '#F5A623',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {c.icon}
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: '#888',
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {c.label}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: '#888',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {formatMoney(c.amount)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div> */}
                            </div>

                            {categories.map((c) => (
                                <CategorySlider
                                    key={c.id}
                                    category={{
                                        id: c.id,
                                        name: c.label,
                                        icon: c.icon,
                                    }}
                                    value={c.amount}
                                    maxValue={total - allocated + c.amount}
                                    totalAmount={total}
                                    onChange={(val) =>
                                        handleSliderChange(c.id, val)
                                    }
                                />
                            ))}

                            {/* Presets */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 12,
                                }}
                            >
                                {[
                                    {
                                        label: '40-30-20-10',
                                        sub: 'T.Kiệm · H.Tập · T.Thiện · T.Vặt',
                                        ratios: [40, 30, 20, 10],
                                    },
                                    {
                                        label: 'Chia đều',
                                        sub: 'Mỗi túi một phần bằng nhau',
                                        ratios: [25, 25, 25, 25],
                                    },
                                ].map(({ label, sub, ratios }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => applyPreset(ratios)}
                                        className="preset-btn"
                                        style={{
                                            backgroundColor: '#fff',
                                            border: '1.5px solid #E8DECE',
                                            borderRadius: 18,
                                            padding: '16px 12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 900,
                                                color: '#1a1a1a',
                                                margin: 0,
                                            }}
                                        >
                                            {label}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                color: '#aaa',
                                                marginTop: 4,
                                                marginBottom: 0,
                                            }}
                                        >
                                            {sub}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isFullyAllocated}
                                className="submit-btn"
                                style={{
                                    width: '100%',
                                    padding: '16px 0',
                                    borderRadius: 18,
                                    border: 'none',
                                    backgroundColor: '#E8E0D0',
                                    color: isFullyAllocated
                                        ? '#1a1a1a'
                                        : '#bbb',
                                    fontSize: 15,
                                    fontWeight: 800,
                                    cursor: isFullyAllocated
                                        ? 'pointer'
                                        : 'not-allowed',
                                }}
                            >
                                {isFullyAllocated
                                    ? '✅ Lưu kho báu'
                                    : 'Lưu kho báu'}
                            </button>

                            {/* Remaining hint */}
                            {!isFullyAllocated && total > 0 && (
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: '#bbb',
                                        textAlign: 'center',
                                        margin: 0,
                                    }}
                                >
                                    Còn {formatMoney(total - allocated)}đ chưa
                                    phân bổ
                                </p>
                            )}
                        </div>
                    </TabPanel>

                    {/* ── Tab: Chi tiền ── */}
                    <TabPanel id="spend">
                        <div
                            style={{
                                backgroundColor: '#FDEBC7',
                                border: '1px solid #EDD9A8',
                                borderRadius: 20,
                                padding: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                minHeight: 220,
                            }}
                        >
                            <span style={{ fontSize: 40 }}>🚧</span>
                            <p
                                style={{
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: '#1a1a1a',
                                    margin: 0,
                                }}
                            >
                                Chức năng chi tiền
                            </p>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: '#aaa',
                                    textAlign: 'center',
                                    maxWidth: 220,
                                    margin: 0,
                                }}
                            >
                                Đang được phát triển, sẽ ra mắt sớm thôi!
                            </p>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
