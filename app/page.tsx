"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const navigation = useRouter();

  return (
    <main className="flex flex-col justify-evenly items-center h-full">
      <header>
        <h1>오목</h1>
      </header>
      <button
        className="cursor-pointer"
        onClick={() => navigation.push("/game")}
      >
        게임시작
      </button>
    </main>
  );
}
