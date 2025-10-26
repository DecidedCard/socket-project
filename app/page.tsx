"use client";

import { supabase } from "@/utill/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const navigation = useRouter();
  const [input, setInput] = useState("");

  const onClickCreateHandler = async () => {
    const { data, error } = await supabase
      .from("channel")
      .insert([{ check: false }])
      .select();

    if (error) {
      console.error("insert error", error);
      return;
    }

    navigation.push(`/game/${data[0].id}`);
  };

  const onClickEnterHandler = async () => {
    if (!input) {
      alert("참가할 방을 입력해주세요");
      return;
    }

    const { data, error } = await supabase
      .from("channel")
      .update({ check: true })
      .eq("id", input)
      .eq("check", false)
      .select();

    if (error) {
      console.error("update error", error);
      alert("방 참가 중 오류가 발생했습니다.");
      return;
    }

    if (data?.length) {
      navigation.push(`/game/${data[0].id}`);
    } else {
      alert("방이 존재하지 않거나 인원이 가득 찼습니다.");
    }
  };

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
      <button onClick={onClickCreateHandler}>방만들기</button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={onClickEnterHandler}>방참가하기</button>
    </main>
  );
}
