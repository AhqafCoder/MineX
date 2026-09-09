"use client";

const rovers = [
  { id: "MINEX-01", status: "online" as const, battery: 78, mission: "Tunnel Inspection", signal: 96 },
  { id: "MINEX-02", status: "online" as const, battery: 91, mission: "Shaft Survey", signal: 88 },
  { id: "MINEX-03", status: "mission" as const, battery: 64, mission: "Emergency Response", signal: 74 },
  { id: "MINEX-04", status: "standby" as const, battery: 100, mission: "Standby", signal: 0 },
];

const statusConfig = {
  online: { label: "Online", color: "bg-gray-100 text-orange-600", dot: "bg-green-400" },
  mission: { label: "On Mission", color: "bg-gray-100 text-orange-600", dot: "bg-green-400" },
  standby: { label: "Standby", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

export default function FleetSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Scalability
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">From One Rover to a Fleet.</h2>
          <p className="text-gray-500">Deploy multiple rovers across large mining operations from one dashboard.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {rovers.map((rover) => {
            const cfg = statusConfig[rover.status];
            return (
              <div key={rover.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${rover.status !== "standby" ? "animate-pulse" : ""}`} />
                    {cfg.label}
                  </span>
                </div>
                <div className="font-bold text-gray-900 mb-1">{rover.id}</div>
                <div className="text-xs text-gray-500 mb-4">{rover.mission}</div>

                {/* Battery bar */}
                <div className="text-xs text-gray-500 mb-1">Battery {rover.battery}%</div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full bg-green-400 transition-all"
                    style={{ width: `${rover.battery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Fleet stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: "🤖", label: "Active Rovers", value: "4" },
            { emoji: "🎯", label: "Active Missions", value: "3" },
            { emoji: "📍", label: "Total Coverage", value: "2.8 km" },
            { emoji: "⚠️", label: "Active Alerts", value: "2" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
