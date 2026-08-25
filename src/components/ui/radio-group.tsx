"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "~/lib/utils"
import { CircleIcon } from "lucide-react"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-2 w-full", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex size-4 cursor-pointer rounded-full transition-colors hover:border-primary focus-visible:ring-[3px] aria-invalid:ring-[3px] group/radio-group-item peer relative aspect-square shrink-0 border outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="group-aria-invalid/radio-group-item:text-destructive text-primary flex size-4 items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

function RadioOption({
  className,
  onClick,
  onMouseDown,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      {...props}
      data-slot="radio-option"
      className={cn(
        "hover:bg-muted/30 -mx-2 flex w-full cursor-pointer items-center gap-2 px-2 py-2 transition-colors",
        className
      )}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (event.defaultPrevented) {
          return
        }

        const radio = event.currentTarget.querySelector<HTMLElement>(
          '[data-slot="radio-group-item"]'
        )
        if (radio && !radio.contains(event.target as Node)) {
          // Stop native <label> activation of the visually hidden input.
          event.preventDefault()
        }
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }

        const option = event.currentTarget
        const radio = option.querySelector<HTMLElement>(
          '[data-slot="radio-group-item"]'
        )
        const input = option.querySelector<HTMLInputElement>(
          'input[type="radio"]'
        )
        const target = event.target
        if (
          !(target instanceof Node) ||
          (radio && radio.contains(target)) ||
          (input && input.contains(target))
        ) {
          return
        }

        event.preventDefault()
        input?.click()
      }}
    />
  )
}

export { RadioGroup, RadioGroupItem, RadioOption }
