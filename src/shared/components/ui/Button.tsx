// ✅ Fixed: shared/components/ui로 이동 (공통 컴포넌트)
'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

// ✅ Fixed: CVA로 스타일 관리
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
        ghost: 'hover:bg-blue-100 text-blue-700',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 text-sm',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

// ✅ Fixed: 비즈니스 로직 제거, 순수한 UI 컴포넌트
export default function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
