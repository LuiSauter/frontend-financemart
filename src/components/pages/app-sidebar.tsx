'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartArea, ChartNoAxesColumn, ChartNoAxesCombined, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

const projects = [
  { name: "Mis cuentas", url: "/cuentas", icon: () => <Wallet /> },
  { name: "Balances", url: "/balances", icon: () => <ChartNoAxesCombined /> },
  { name: "Análisis patrimonial", url: "/analisis-patrimonial", icon: () => <ChartArea /> },
  { name: "Análisis financiero", url: "/analisis-financiero", icon: () => <ChartNoAxesColumn /> },
  // Add more projects as needed
];

export function AppSidebar() {
  const router = useRouter()
  const path = usePathname()
  console.log(path)
  return (
    <Sidebar className="border-r-zinc-900">
      {/* <SidebarHeader className="bg-zinc-900" /> */}
      <SidebarContent className="bg-zinc-900 p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild className="space-y-4">
                    <Button
                      variant={path === `/dashboard${project.url}` ? "default" : "ghost"}
                      className="justify-start text-white mb-2"
                      onClick={() => {
                        router.push("/dashboard/" + project.url)
                      }}
                    >
                      <project.icon />
                      {project.name}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter className="bg-zinc-900" /> */}
    </Sidebar>
  )
}
