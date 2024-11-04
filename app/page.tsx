import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <main className="flex flex-col gap-8 items-center justify-center">
        <h1 className="font-extrabold text-2xl">
          ADMIN DASHBOARD
        </h1>

        <Link href="/user-management" className="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-cyan-600">User Management</Link>
        <Link href="/rewards-management" className="bg-cyan-400 text-white px-4 py-2 rounded-full  hover:bg-cyan-600">Rewards Management</Link>
        <Link href="/content-management" className="bg-cyan-400 text-white px-4 py-2 rounded-full  hover:bg-cyan-600">Content Management</Link>
        <Link href="/ticket-management" className="bg-cyan-400 text-white px-4 py-2 rounded-full  hover:bg-cyan-600">Ticket Management</Link>


      </main>

    </div>
  );
}
