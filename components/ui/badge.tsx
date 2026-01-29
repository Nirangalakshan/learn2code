import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        outline: "text-emerald-600 border-emerald-500/50 dark:text-emerald-400",
        success:
          "border-transparent bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/20",
        warning:
          "border-transparent bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20",
        destructive:
          "border-transparent bg-linear-to-r from-red-500 to-pink-500 text-white shadow-md shadow-red-500/20",
        purple:
          "border-transparent bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20",
        glass: "bg-white/20 backdrop-blur-sm border-white/30 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
