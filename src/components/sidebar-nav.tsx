"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Target, ListTodo } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "OKRs",
    href: "/okrs",
    icon: Target,
  },
  {
    title: "To Dos",
    href: "/todos",
    icon: ListTodo,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <Icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
} 