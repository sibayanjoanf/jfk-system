import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="-mt-[90px] lg:ml-20 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}