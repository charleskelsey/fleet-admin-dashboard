import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <main className="flex flex-col gap-8 w-full h-full p-56">
        <h1 className="font-extrabold text-8xl flex text-left">
          ADMIN DASHBOARD
        </h1>
        <div className="grid gap-2 grid-cols-2 grid-rows-2 h-1/2 w-full">
          <Link href="/user-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center w-full hover:bg-cyan-600">User Management</Link>
          <Link href="/rewards-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Rewards Management</Link>
          <Link href="/content-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Content Management</Link>
          <Link href="/ticket-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Ticket Management</Link>
        </div>



      </main>

    </div>
  );
}
