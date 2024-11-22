import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <main className="flex flex-col gap-6 items-center justify-center pt-10 pb-4 px-12 border-black">
        <h1 className="font-extrabold text-4xl flex items-center justify-center text-left">
          ADMIN DASHBOARD
        </h1>
        <div className="grid gap-5 grid-flow-row h-80 w-72 border-cyan-400 p-4">
          <Link href="/user-management" className="bg-cyan-400 rounded-xl text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600 ">User Management</Link>
          <Link href="/rewards-management" className="bg-cyan-400 rounded-xl text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Rewards Management</Link>
          <Link href="/content-management" className="bg-cyan-400 rounded-xl text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Content Management</Link>
          <Link href="/ticket-management" className="bg-cyan-400 rounded-xl text-white px-4 py-2 flex items-center justify-center hover:bg-cyan-600">Ticket Management</Link>
        </div>

      </main>

    </div>
  );
}
