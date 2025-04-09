
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-[#0B5681]",
      className
    )}
    {...props}
  >
    <svg 
      viewBox="0 0 200 200" 
      className="h-3/4 w-3/4 text-white"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="80" fill="none" stroke="#FFFFFF" strokeWidth="8" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="100" cy="70" r="20" fill="#FFFFFF" />
      <path d="M70,115 L130,115 Q140,115 140,125 L140,145 L60,145 L60,125 Q60,115 70,115" fill="#FFFFFF" />
      <path d="M100,90 L100,145" stroke="#0B5681" strokeWidth="6" />
      <path d="M100,90 L100,105 L110,115 L90,115 Z" fill="#0B5681" />
    </svg>
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
