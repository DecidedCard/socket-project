"use client";

import { supabase } from "@/util/supabase/client";
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
        <h1 className="text-head_36_B lg:text-head_48_B">오목</h1>
      </header>
      <article className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-10 border p-4 rounded-2xl items-center justify-center">
          <span className="text-body_20_B">로컬 플레이</span>
          <button
            onClick={() => navigation.push("/game")}
            className="cursor-pointer border rounded-xl p-2"
          >
            게임시작
          </button>
        </div>

        <div className="flex flex-col gap-10 border p-4 rounded-2xl items-center">
          <span className="text-body_20_B">멀티플레이</span>
          <button
            onClick={onClickCreateHandler}
            className="cursor-pointer border rounded-xl p-2"
          >
            방만들기
          </button>
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="방 번호를 입력해주세요"
              className="border p-2 rounded-xl"
            />
            <button
              onClick={onClickEnterHandler}
              className="cursor-pointer border rounded-xl p-2"
            >
              방참가하기
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
