"use client";

import { Target, Flag, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistance, formatTime } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function MissionPanel({ state }: Props) {
  const progress = Math.min(100, (state.distance / 1200) * 100);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Mission</h3>
            <p className="text-xs text-gray-500">Tunnel Inspection</p>
          </div>
        </div>
        <div className="text-xs font-bold px-2 py-1 bg-gray-50 text-orange-600 rounded-md border border-gray-100">
          IN PROGRESS
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Completion Progress</span>
              <span className="font-bold text-orange-600">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Flag className="w-3.5 h-3.5" /> Covered
              </div>
              <div className="font-bold text-gray-900">{formatDistance(state.distance)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Clock className="w-3.5 h-3.5" /> Elapsed
              </div>
              <div className="font-bold text-gray-900">{formatTime(state.missionElapsed)}</div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/mission"
          className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-colors group mt-auto"
        >
          <span className="text-sm font-semibold text-gray-900">View Mission Details</span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
