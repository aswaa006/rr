import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <>
    <style>{`
      @keyframes bloom-in {
        0% {
          opacity: 0;
          transform: scale(0.95);
          filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
          background-color: #fefcf9;
        }
        50% {
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
          background-color: #fff8d6;
        }
        100% {
          opacity: 1;
          transform: scale(1);
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.2));
          background-color: #fefcf9;
        }
      }
      @keyframes bloom-out {
        0% {
          opacity: 1;
          transform: scale(1);
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.2));
          background-color: #fefcf9;
        }
        100% {
          opacity: 0;
          transform: scale(0.95);
          filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
          background-color: #fefcf9;
        }
      }
      .animate-bloom-in {
        animation: bloom-in 450ms ease forwards;
      }
      .animate-bloom-out {
        animation: bloom-out 350ms ease forwards;
      }
    `}</style>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-bloom-in data-[state=closed]:animate-bloom-out",
        className,
      )}
      {...props}
    />
  </>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
