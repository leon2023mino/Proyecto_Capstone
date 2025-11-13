import { cn } from "@/lib/utils"

/**
 * Skeleton Mi Barrio Digital
 * - Fondo gris-azulado suave
 * - Animación pulida
 * - Bordes redondeados coherentes con el sistema
 * - Compatible con dark mode
 */

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        "bg-[hsl(var(--muted))] text-transparent",
        "animate-pulse",
        "dark:bg-[hsl(var(--muted)/0.3)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
