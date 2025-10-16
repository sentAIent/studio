
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  Plane,
  ShoppingCart,
  Users,
  Package,
  BarChart,
  Settings,
  LifeBuoy,
  Bot,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { usePathname } from '@/hooks/use-pathname';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Plane },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
];

const secondaryMenuItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help & Support', icon: LifeBuoy },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-950 text-white">
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/50">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg">
                        AvatarSpeak
                    </h1>
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Back to Avatar">
                            <Bot />
                            <span>Back to Avatar</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                {secondaryMenuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b border-cyan-400/20 bg-black/30 backdrop-blur-md">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
             <h1 className="text-white font-bold text-xl md:text-2xl">
                {menuItems.find(item => item.href === pathname)?.label || secondaryMenuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
            <div></div>
          </header>
          <main className="container mx-auto py-12 px-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
