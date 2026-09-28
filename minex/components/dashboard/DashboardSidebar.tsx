"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Map, Camera, Activity, AlertTriangle, FileText, Settings, HelpCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  roverState: "active" | "standby" | "emergency";
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { id: "map", label: "Live Map", icon: Map, href: "/dashboard/map" },
  { id: "vision", label: "Vision AI", icon: Camera, href: "/dashboard/vision" },
  { id: "environment", label: "Environment", icon: Activity, href: "/dashboard/environment" },
  { id: "telemetry", label: "Telemetry", icon: Activity, href: "/dashboard/telemetry" },
  { id: "alerts", label: "Alerts", icon: AlertTriangle, href: "/dashboard/alerts" },
  { id: "mission", label: "Mission", icon: Target, href: "/dashboard/mission" },
  { id: "reports", label: "Reports", icon: FileText, href: "/dashboard/reports" },
];

export default function DashboardSidebar({ collapsed, onToggle, activeView, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "bg-white border-r border-gray-100 flex flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MineX</span>
          </Link>
        )}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 mx-auto">
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isActive 
                  ? "bg-gray-50 text-orange-600 font-semibold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-orange-600" : "text-gray-500")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-3 py-2 w-full">
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
}
