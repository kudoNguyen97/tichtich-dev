import { I18nProvider } from 'react-aria';
import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    Heading,
} from 'react-aria-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarDate } from '@internationalized/date';
import { TichTichModal } from '@/components/common/TichTichModal';
import { cn } from '@/utils/cn';
import {
    calendarDateToIsoString,
    getTodayCalendarDate,
    isoDateStringToCalendarDate,
} from '@/utils/targetGoalDates';

export interface MissionDatePickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    /** YYYY-MM-DD hoặc rỗng */
    value: string;
    onSelect: (iso: string) => void;
    minValue?: CalendarDate;
    maxValue?: CalendarDate;
    title?: string;
    /** Đổi key khi mở picker khác để Calendar reset tháng/focus */
    resetKey?: string;
}

export function MissionDatePickerDialog({
    isOpen,
    onClose,
    value,
    onSelect,
    minValue,
    maxValue,
    title = 'Chọn ngày',
    resetKey = 'default',
}: MissionDatePickerDialogProps) {
    const selected = value ? isoDateStringToCalendarDate(value) : null;
    const defaultFocused = selected ?? minValue ?? getTodayCalendarDate();
    const today = getTodayCalendarDate();
    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span>
                    <span className="text-base font-bold text-tichtich-black capitalize">
                        {title}
                    </span>
                </span>
            }
            size="md"
        >
            <I18nProvider locale="vi-VN">
                <Calendar
                    key={resetKey}
                    className="min-w-[280px] mx-auto outline-none"
                    value={selected}
                    defaultFocusedValue={defaultFocused}
                    minValue={minValue}
                    maxValue={maxValue}
                    onChange={(d) => {
                        onSelect(calendarDateToIsoString(d));
                        onClose();
                    }}
                >
                    <div className="mb-2 flex items-center justify-between gap-2 px-1">
                        <Button
                            slot="previous"
                            className="flex size-9 items-center justify-center rounded-lg text-tichtich-black outline-none hover:bg-black/5"
                        >
                            <ChevronLeft className="size-6" aria-hidden />
                        </Button>
                        <Heading className="flex-1 text-center text-sm font-bold text-tichtich-black capitalize" />
                        <Button
                            slot="next"
                            className="flex size-9 items-center justify-center rounded-lg text-tichtich-black outline-none hover:bg-black/5"
                        >
                            <ChevronRight className="size-6" aria-hidden />
                        </Button>
                    </div>
                    <CalendarGrid weekdayStyle="short" className="w-full">
                        {(date) => (
                            <CalendarCell
                                date={date}
                                className={({
                                    isSelected,
                                    isFocused,
                                    isDisabled,
                                }) =>
                                    cn(
                                        'flex size-9 items-center justify-center text-sm outline-none cursor-pointer',
                                        date.compare(today) === 0 &&
                                            'rounded-full bg-tichtich-primary-100 font-semibold',
                                        isDisabled &&
                                            'cursor-default opacity-40',
                                        isSelected &&
                                            'rounded-full bg-tichtich-primary-200 font-semibold text-white',
                                        !isSelected &&
                                            !isDisabled &&
                                            'rounded-full hover:bg-black/5',
                                        isFocused &&
                                            !isSelected &&
                                            'ring-2 ring-tichtich-primary-200/30'
                                    )
                                }
                            />
                        )}
                    </CalendarGrid>
                </Calendar>
            </I18nProvider>
        </TichTichModal>
    );
}
