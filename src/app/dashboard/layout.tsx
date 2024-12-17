import { AppSidebar } from "@/components/pages/app-sidebar";
import Header from "@/components/pages/header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BalanceProvider } from "@/context/BalanceContext";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function generateStaticParams() {
  // return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <SidebarProvider>
        <AppSidebar />
        <main className="container">
          <div className="flex flex-row items-center gap-4 w-full">
            <SidebarTrigger size='icon' />
            <Header />
          </div>
          <BalanceProvider>
            {children}
          </BalanceProvider>
        </main>
      </SidebarProvider>
      {/* <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav
            items={dashboardConfig.mainNav}
            params={{ lang: `${lang}` }}
          />
          <div className="flex items-center space-x-3">
            <LocaleChange url={"/dashboard"} />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
              params={{ lang: `${lang}` }}
              dict={dict.dropdown}
            />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav
            items={dashboardConfig.sidebarNav}
            params={{ lang: `${lang}` }}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter
        className="border-t border-border"
        params={{ lang: `${lang}` }}
        dict={dict.common}
      /> */}
    </div>
  );
}
