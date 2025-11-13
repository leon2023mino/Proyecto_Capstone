import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * 🎨 Button Styles (Mejorado)
 * Adaptado para la paleta de “Mi Barrio Digital”
 * con animaciones suaves, bordes modernos, sombras ligeras
 * y variantes mejor definidas.
 */

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2 
  whitespace-nowrap rounded-md font-semibold
  transition-all duration-200 active:scale-[0.97]
  disabled:pointer-events-none disabled:opacity-50
  focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none

  [&_svg]:pointer-events-none 
  [&_svg:not([class*='size-'])]:size-4
  [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        /** 🌿 Botón principal – verde institucional */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",

        /** ❌ Rojo – eliminar, acciones críticas */
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm",

        /** 🔳 Outline – con borde claro y hover elegante */
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-xs",

        /** 🔘 Secundario – gris suave moderno */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",

        /** 👻 Ghost – fondo transparente con hover sutil */
        ghost:
          "hover:bg-accent hover:text-accent-foreground bg-transparent shadow-none",

        /** 🔗 Link */
        link: "text-primary underline-offset-4 hover:underline p-0",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },

      /** 🟩 Bordes redondeados tipo “pill button” */
      round: {
        true: "rounded-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      round: false,
    },
  }
);

function Button({
  className,
  variant,
  size,
  round,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, round, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
