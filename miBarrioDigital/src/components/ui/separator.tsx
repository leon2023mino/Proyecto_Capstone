import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Separator estilizado para Mi Barrio Digital
 * - Más sutil y elegante
 * - Compatible con orientación horizontal/vertical
 * - Tonos suaves consistentes con border global
 */

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      data-slot="separator"
      className={cn(
        // ------ Base Styles ------
        "shrink-0 bg-border/80 dark:bg-border/60 transition-colors",

        // Horizontal: línea fina y elegante
        "data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full",

        // Vertical: línea más delgada aún
        "data-[orientation=vertical]:w-[1px] data-[orientation=vertical]:h-full",

        // Custom class overrides
        className
      )}
      {...props}
    />
  );
}

export { Separator };
