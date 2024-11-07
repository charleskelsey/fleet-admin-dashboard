import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <main className="flex flex-col gap-6 w-full h-full pt-40 pb-4 px-12 border border-black">
        <h1 className="font-extrabold text-8xl flex text-left">
          ADMIN DASHBOARD
        </h1>
        <div className="grid gap-2 grid-cols-2 grid-rows-2 h-full w-full border border-cyan-400 p-4">
          <Link href="/user-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center w-full hover:bg-cyan-600">User Management</Link>
          <Link href="/rewards-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Rewards Management</Link>
          <Link href="/content-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Content Management</Link>
          <Link href="/ticket-management" className="bg-cyan-400 text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Ticket Management</Link>
        </div>



      </main>

    </div>
  );
}
