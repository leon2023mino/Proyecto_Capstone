import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 🎨 Variantes del Card
 * Usamos cva para permitir estilos más ricos y configurables.
 */

const cardVariants = cva(
  `
  rounded-xl border bg-card text-card-foreground 
  shadow-sm transition-all duration-200
  `,
  {
    variants: {
      variant: {
        default: "bg-card shadow-sm",

        outline: "border border-border bg-background shadow-none",

        flat: "border border-transparent shadow-none bg-background",

        ghost:
          "border border-transparent shadow-none bg-transparent hover:bg-accent/30",

        hoverable:
          "bg-card shadow-sm hover:shadow-lg hover:-translate-y-[2px]",

        elevated:
          "bg-card shadow-md hover:shadow-xl hover:-translate-y-[3px]",

        soft:
          "bg-muted/40 border border-border shadow-sm backdrop-blur-sm",

        gradient:
          "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 shadow-md",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

/**
 * 💳 Card principal
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof cardVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * 🏷 Header del Card
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * 🔠 Título del Card
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold text-lg text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * 📝 Descripción del Card
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * 📦 Contenido
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-2", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * 🔚 Footer
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 pt-2", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
