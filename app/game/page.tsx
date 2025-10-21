"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Game() {
  const navigation = useRouter();
  const board = Array.from({ length: 8 }, () => Array(8).fill(0));
  const [check, setCheck] = useState<{ color: string; check: boolean }[][]>(
    Array.from({ length: 9 }, () => Array(9).fill({ color: "", check: false }))
  );

  const onClickHandler = (index: [number, number]) => {
    setCheck((prev) =>
      prev.map((row, rowIndex) => {
        return row.map((i, idx) =>
          rowIndex === index[0] && idx === index[1] ? { ...i, check: true } : i
        );
      })
    );
  };

  const onClickReset = () => {
    setCheck(
      Array.from({ length: 9 }, () =>
        Array(9).fill({ color: "", check: false })
      )
    );
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
                        <div className="w-1/2 h-1/2 rounded-full bg-black"></div>
                      ) : (
                        <button
                          onClick={() => onClickHandler([rowindex, index])}
                          className="w-1/2 h-1/2 rounded-full bg-black hidden group-hover:block"
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
