import "@/app/globals.css";

export const metadata = {
  title: "Dashboard — MineX",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We use bg-gray-50 for the dashboard wrapper so the white panels pop nicely
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans antialiased overflow-hidden selection:bg-gray-100 selection:text-orange-600">
      {children}
    </div>
  );
}
