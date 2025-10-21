"use client";

import { Player } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Game() {
  const navigation = useRouter();
  const board = Array.from({ length: 8 }, () => Array(8).fill(0));
  const [check, setCheck] = useState<{ color: string; check: boolean }[][]>(
    Array.from({ length: 9 }, () => Array(9).fill({ color: "", check: false }))
  );
  const [player, setPlayer] = useState<Player>(Player.Black);

  const onClickHandler = (index: [number, number], player: Player) => {
    setCheck((prev) =>
      prev.map((row, rowIndex) => {
        return row.map((i, idx) =>
          rowIndex === index[0] && idx === index[1]
            ? { color: player, check: true }
            : i
        );
      })
    );
    setPlayer((prev) => (prev === Player.Black ? Player.White : Player.Black));
  };

  const onClickReset = () => {
    setCheck(
      Array.from({ length: 9 }, () =>
        Array(9).fill({ color: "", check: false })
      )
    );
    setPlayer(Player.Black);
  };

  return (
    <main className="flex flex-col justify-evenly items-center h-full px-20">
      <button
        className="absolute top-2 right-2 cursor-pointer"
        onClick={() => navigation.replace("/")}
      >
        뒤로가기
      </button>
      <article className="relative w-full max-w-[800px] aspect-square">
        <div className="flex flex-col border h-full">
          {board.map((row, rowindex) => {
            return (
              <div key={rowindex} className="flex flex-1">
                {row.map((item, index) => {
                  return (
                    <div
                      key={`${rowindex}${index}`}
                      className="flex-1 border"
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="absolute -inset-[6%] flex flex-col">
          {check.map((row, rowindex) => {
            return (
              <div key={rowindex} className="flex flex-1">
                {row.map((item, index) => {
                  return (
                    <div
                      key={`${rowindex}${index}`}
                      className="group flex-1 flex items-center justify-center"
                    >
                      {item.check ? (
                        <div
                          className={`w-3/4 h-3/4 rounded-full  ${
                            item.color === Player.Black
                              ? "bg-black"
                              : "border-2"
                          }`}
                        ></div>
                      ) : (
                        <button
                          onClick={() =>
                            onClickHandler([rowindex, index], player)
                          }
                          className={`w-3/4 h-3/4 rounded-full hidden group-hover:block ${
                            player === Player.Black ? "bg-black" : "border-2"
                          }`}
                        ></button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </article>
      <button onClick={onClickReset} className="cursor-pointer">
        초기화
      </button>
    </main>
  );
}
