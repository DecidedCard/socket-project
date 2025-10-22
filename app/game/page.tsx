"use client";

import { Cell, Player } from "@/types";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

const SIZE = 15;

export default function Game() {
  const navigation = useRouter();
  const [check, setCheck] = useState<Cell[][]>(
    Array.from({ length: SIZE + 1 }, () => Array(SIZE + 1).fill(null))
  );
  const [player, setPlayer] = useState<Player>(Player.Black);
  const [winner, setWinner] = useState<Player | null>(null);

  const inBounds = (r: number, c: number) =>
    r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const checkWin = (b: Cell[][], r: number, c: number, p: Player) => {
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ] as const;

    for (const [dr, dc] of dirs) {
      let cnt = 1;

      let nr = r + dr,
        nc = c + dc;
      while (inBounds(nr, nc) && b[nr][nc] === p) {
        cnt++;
        nr += dr;
        nc += dc;
      }
      nr = r - dr;
      nc = c - dc;
      while (inBounds(nr, nc) && b[nr][nc] === p) {
        cnt++;
        nr -= dr;
        nc -= dc;
      }

      if (cnt >= 5) return true;
    }
    return false;
  };

  const onClickHandler = (r: number, c: number, player: Player) => {
    setCheck((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = player;

      if (checkWin(next, r, c, player)) {
        setWinner(player);
      }
      return next;
    });
    setPlayer((p) => (p === Player.Black ? Player.White : Player.Black));
  };

  const onClickReset = () => {
    setCheck(
      Array.from({ length: SIZE + 1 }, () => Array(SIZE + 1).fill(null))
    );
    setPlayer(Player.Black);
    setWinner(null);
  };

  return (
    <main className="flex flex-col justify-evenly items-center h-full px-20">
      <button
        className="absolute top-2 right-2 cursor-pointer"
        onClick={() => navigation.replace("/")}
      >
        뒤로가기
      </button>
      <article className="relative w-full max-w-[900px] aspect-square">
        <div className="flex flex-col border h-full">
          {Array.from({ length: SIZE }, () => Array(SIZE).fill(0)).map(
            (row, rowindex) => {
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
            }
          )}
        </div>
        <div className="absolute -inset-[3%] flex flex-col">
          {check.map((row, rowindex) => {
            return (
              <div key={rowindex} className="flex flex-1">
                {row.map((item, index) => {
                  return (
                    <div
                      key={`${rowindex}${index}`}
                      className="group flex-1 flex items-center justify-center"
                    >
                      {item ? (
                        <div
                          className={`w-3/4 h-3/4 rounded-full  ${
                            item === Player.Black
                              ? "bg-black"
                              : "border-2 bg-white"
                          }`}
                        ></div>
                      ) : (
                        !winner && (
                          <button
                            onClick={() =>
                              onClickHandler(rowindex, index, player)
                            }
                            className={`w-3/4 h-3/4 rounded-full hidden group-hover:block ${
                              player === Player.Black
                                ? "bg-black"
                                : "border-2 bg-white"
                            }`}
                          ></button>
                        )
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
      {winner && (
        <article className="absolute w-full h-full z-10 flex flex-col gap-10 items-center justify-center bg-black/60">
          <div className="h-14 rounded-2xl bg-white flex items-center px-10">
            {winner === Player.Black ? "흑돌" : "백돌"}이 승리했습니다.
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClickReset}
              className="h-10 px-4 flex items-center rounded-2xl bg-white cursor-pointer"
            >
              초기화
            </button>
            <button
              onClick={() => navigation.back()}
              className="h-10 px-4 flex items-center rounded-2xl bg-white cursor-pointer"
            >
              처음으로
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
