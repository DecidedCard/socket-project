"use client";

import { Room } from "@/types";
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
    }

    let { data: channel, error } = await supabase
      .from("channel")
      .select("*")
      .eq("id", input);

    if (error) {
      console.error("insert error", error);
      return;
    }

    if (!!channel?.length) {
      if (channel[0].check) {
        alert("인원이 가득찼습니다.");
        return;
      }

      const { data, error } = await supabase
        .from("channel")
        .update({ check: true })
        .eq("id", channel[0].id)
        .select();

      if (error) {
        console.error("update error", error);
        alert("방을 참가하는 중에 문제가 발생하였습니다.");
        return;
      }

      navigation.push(`/game/${data[0].id}`);
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
