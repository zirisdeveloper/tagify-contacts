
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
      xmlns="http://www.w3.org/apk/res/android"
      viewBox="0 0 108 108" 
      className="h-3/4 w-3/4 text-white"
      aria-hidden="true"
    >
      <circle cx="54" cy="54" r="30" fill="#FFFFFF" />
      <circle cx="54" cy="54" r="25" fill="#0B5681" />
      <circle cx="54" cy="38" r="10" fill="#FFFFFF" />
      <path d="M42,60 L66,60 Q72,60 72,66 L72,70 L36,70 L36,66 Q36,60 42,60" fill="#FFFFFF" />
      <path d="M54,50 L58,56 L50,56 Z" fill="#0B5681" />
      <path d="M54,54 L54,70" fill="#0B5681" />
    </svg>
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
