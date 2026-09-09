"use client";

import { useState } from "react";
import { AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { alerts as initialAlerts, Alert } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts.slice(0, 3));

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertStyles = (priority: string) => {
    switch (priority) {
      case "critical": return { bg: "bg-gray-50 border-gray-100", text: "text-red-800", icon: "text-red-500", dot: "bg-red-500" };
      case "warning":
      case "high": return { bg: "bg-gray-50 border-gray-100", text: "text-orange-800", icon: "text-orange-600", dot: "bg-orange-500" };
      case "medium": return { bg: "bg-gray-50 border-gray-100", text: "text-yellow-800", icon: "text-yellow-600", dot: "bg-yellow-500" };
      default: return { bg: "bg-gray-50 border-gray-100", text: "text-blue-800", icon: "text-orange-600", dot: "bg-orange-600" };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Alert Center</h3>
            <p className="text-xs text-gray-500">{alerts.length} Active System Alerts</p>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="w-5 h-5 rounded-full bg-gray-100 text-red-600 text-[10px] font-bold flex items-center justify-center">
            {alerts.length}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
            <CheckCircle2 className="w-8 h-8 mb-2 text-orange-600" />
            <span className="text-sm font-medium">No active alerts</span>
          </div>
        ) : (
          alerts.map(alert => {
            const styles = getAlertStyles(alert.priority);
            return (
              <div key={alert.id} className={cn("p-3 rounded-xl border relative pr-10", styles.bg)}>
                <div className="flex items-start gap-2.5">
                  <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", styles.dot, alert.priority === "critical" && "animate-pulse")} />
                  <div>
                    <div className={cn("text-xs font-bold mb-0.5", styles.text)}>{alert.title}</div>
                    <div className={cn("text-[11px] leading-relaxed opacity-80", styles.text)}>{alert.description}</div>
                    <div className={cn("text-[9px] font-semibold mt-2 opacity-60", styles.text)}>
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className={cn("absolute top-2 right-2 p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity", styles.text)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
