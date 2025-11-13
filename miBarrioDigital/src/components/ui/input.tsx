import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input estilizado para Mi Barrio Digital
 * - Fondo blanco SIEMPRE
 * - Bordes suaves
 * - Marker verde al enfocar
 * - Texto negro
 * - Placeholder gris suave
 * - Sombras sutiles
 * - Mejor integración con dark mode
 */

const baseStyles = `
  w-full h-10 px-3 py-2 
  text-sm text-foreground placeholder:text-muted-foreground
  bg-white dark:bg-input/20
  border border-border rounded-lg
  transition-all duration-150
  outline-none
  disabled:cursor-not-allowed disabled:opacity-60
  shadow-sm
`;

const focusStyles = `
  focus:border-primary
  focus:ring-2 focus:ring-primary/40
`;

const invalidStyles = `
  aria-invalid:border-destructive aria-invalid:ring-destructive/30
`;

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(baseStyles, focusStyles, invalidStyles, className)}
      {...props}
    />
  );
}

export { Input };
