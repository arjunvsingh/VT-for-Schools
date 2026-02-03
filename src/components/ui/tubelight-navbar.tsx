"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-off-white/5 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = isActive(item.url)

        return (
          <Link
            key={item.name}
            href={item.url}
            className={cn(
              "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
              "text-off-white/80 hover:text-acid-lime",
              active && "bg-off-white/10 text-acid-lime",
            )}
          >
            <span className="hidden md:inline">{item.name}</span>
            <span className="md:hidden">
              <Icon size={18} strokeWidth={2.5} />
            </span>
            {active && (
              <motion.div
                layoutId="lamp"
                className="absolute inset-0 w-full bg-acid-lime/5 rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-acid-lime rounded-t-full">
                  <div className="absolute w-12 h-6 bg-acid-lime/20 rounded-full blur-md -top-2 -left-2" />
                  <div className="absolute w-8 h-6 bg-acid-lime/20 rounded-full blur-md -top-1" />
                  <div className="absolute w-4 h-4 bg-acid-lime/20 rounded-full blur-sm top-0 left-2" />
                </div>
              </motion.div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
