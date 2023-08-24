import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="text-puple-900 flex justify-between">
      <h2 className="mt-0">
        <div className="flex gap-2 items-center">
          <img
            src={session?.user?.image}
            alt=""
            className="sm:hidden w-6 h-6 rounded-md"></img>
          <div>
            {" "}
            Hello, <b>{session?.user?.name}</b>
          </div>
        </div>
      </h2>
      <div className="hidden sm:block">
        <div className="bg-gray-300 flex text-black gap-1 rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6"></img>
          <span className="px-2"> {session?.user?.name}</span>
        </div>
      </div>
    </div>
  );
}
