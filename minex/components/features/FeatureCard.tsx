import React from 'react';

interface FeatureCardProps {
  theme: "red" | "orange" | "green" | "blue" | "purple";
  title: string;
  desc: string;
  tag: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ theme, title, desc, tag, icon }: FeatureCardProps) {
  const colors = {
    red: { border: "border-red-500", headerBg: "bg-red-500", iconBg: "bg-red-600", tagBg: "bg-red-100", tagText: "text-red-700" },
    orange: { border: "border-orange-500", headerBg: "bg-orange-500", iconBg: "bg-orange-600", tagBg: "bg-orange-100", tagText: "text-orange-700" },
    green: { border: "border-green-500", headerBg: "bg-green-500", iconBg: "bg-green-600", tagBg: "bg-green-100", tagText: "text-green-700" },
    blue: { border: "border-blue-500", headerBg: "bg-blue-500", iconBg: "bg-blue-600", tagBg: "bg-blue-100", tagText: "text-blue-700" },
    purple: { border: "border-purple-500", headerBg: "bg-purple-500", iconBg: "bg-purple-600", tagBg: "bg-purple-100", tagText: "text-purple-700" },
  }[theme];

  return (
    <div className={`rounded-2xl border-[3px] bg-white flex flex-col relative ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
      <div className={`${colors.headerBg} text-white flex items-center justify-between pl-14 pr-4 py-3 min-h-[56px] rounded-t-xl relative`}>
        <div className={`absolute -left-5 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-md ${colors.iconBg} text-2xl`}>
          {icon}
        </div>
        <h3 className="font-bold text-sm md:text-base uppercase tracking-wide leading-tight">{title}</h3>
      </div>
      <div className="p-6 text-sm text-gray-600 font-medium leading-relaxed bg-white flex-1 flex flex-col justify-between">
        <p className="mb-4">{desc}</p>
        <div className="flex justify-end">
          <span className={`${colors.tagBg} ${colors.tagText} px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide`}>
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
