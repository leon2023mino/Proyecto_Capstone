"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Root
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

// Trigger
function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

// Close button
function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

// Portal
function SheetPortal(
  props: React.ComponentProps<typeof SheetPrimitive.Portal>
) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// Overlay ADAPTADO
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

// Content ADAPTADO (el panel)
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col bg-card text-card-foreground shadow-2xl",
          "transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out",
          "rounded-none sm:rounded-l-xl border-l border-border",
          // SIDE VARIANTS
          side === "right" &&
            "right-0 inset-y-0 w-[85%] sm:w-[380px] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" &&
            "left-0 inset-y-0 w-[85%] sm:w-[380px] data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          side === "top" &&
            "top-0 inset-x-0 h-auto data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          side === "bottom" &&
            "bottom-0 inset-x-0 h-auto data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          className
        )}
        {...props}
      >
        {/* Children */}
        {children}

        {/* Close Button MODERNO */}
        <SheetPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-md p-1",
            "text-foreground/70 hover:text-foreground hover:bg-accent",
            "transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring/40"
          )}
        >
          <XIcon className="size-5" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

// Header
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("p-5 flex flex-col gap-1.5 border-b border-border", className)}
      {...props}
    />
  );
}

// Footer
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto p-5 flex flex-col gap-2 border-t border-border", className)}
      {...props}
    />
  );
}

// Title
function SheetTitle(
  props: React.ComponentProps<typeof SheetPrimitive.Title> & { className?: string }
) {
  return (
    <SheetPrimitive.Title
      {...props}
      className={cn("text-xl font-semibold text-foreground", props.className)}
    />
  );
}

// Description
function SheetDescription(
  props: React.ComponentProps<typeof SheetPrimitive.Description> & { className?: string }
) {
  return (
    <SheetPrimitive.Description
      {...props}
      className={cn("text-muted-foreground text-sm", props.className)}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
