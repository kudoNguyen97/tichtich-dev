export type Locale = 'en' | 'vi';

export type Theme = 'light' | 'dark' | 'system';

export interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
}
