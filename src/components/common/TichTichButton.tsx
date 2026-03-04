/**
 * Button Component
 * Variants: primary | secondary | outline | outline-primary | ghost | danger
 * Sizes: sm | md | lg | icon
 */

import { Button as AriaButton } from "react-aria-components";
import type { ButtonProps } from "react-aria-components";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[40px] font-semibold transition-all duration-200",
    "cursor-pointer select-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-tichtich-primary-200 text-white",
          "hover:brightness-110",
          "focus-visible:ring-tichtich-primary-200",
        ],
        secondary: [
          "bg-tichtich-primary-300 text-tichtich-primary-200",
          "hover:brightness-95",
          "focus-visible:ring-tichtich-primary-300",
        ],
        outline: [
          "bg-white text-tichtich-black border border-tichtich-black",
          "hover:bg-gray-50",
          "focus-visible:ring-tichtich-black",
        ],
        "outline-primary": [
          "bg-white text-tichtich-primary-200 border border-tichtich-primary-200",
          "hover:bg-tichtich-primary-300/40",
          "focus-visible:ring-tichtich-primary-200",
        ],
        ghost: [
          "bg-transparent text-tichtich-black",
          "hover:bg-black/5",
          "focus-visible:ring-tichtich-black",
        ],
        danger: [
          "bg-tichtich-red text-white",
          "hover:brightness-110",
          "focus-visible:ring-tichtich-red",
        ],
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'outline-primary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'|'icon'} [props.size='md']
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isDisabled]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

interface TichTichButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function TichTichButton({
  variant,
  size,
  fullWidth,
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: TichTichButtonProps) {
  return (
    <AriaButton
      isDisabled={isDisabled || isLoading}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </AriaButton>
  );
}
