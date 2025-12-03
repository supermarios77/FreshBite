import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-normal tracking-widest uppercase ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-foreground/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/70",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground dark:hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-foreground/80 border-2 border-foreground rounded-none tracking-widest uppercase",
      },
      size: {
        default: "h-12 px-5 py-3 text-sm sm:text-base", // Increased from h-10 for better accessibility
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-base sm:text-lg", // Increased from h-11 for better accessibility
        icon: "h-12 w-12", // Increased from h-10 for better touch targets
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

