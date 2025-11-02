import { GameBoardReturn, PresenceMeta } from "@/hooks/useGame";
import { Player } from "@/types";
import React from "react";

export default function SelectPlayer({ game }: { game: GameBoardReturn }) {
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <article className="w-full flex flex-col justify-center items-center gap-20">
        <div className="border-2 p-4 rounded-2xl w-52 h-36 flex flex-col items-center">
          <span className="text-body_20_B border-b border-gray-400">
            플레이어
          </span>
          <div className="flex flex-col gap-1 items-center mt-4">
            {game.members.map((i, idx) =>
              !i.stone ? <span key={idx}>{i.nickname}</span> : false
            )}
          </div>
        </div>
        <div className="flex justify-evenly w-full">
          <div className="flex flex-col justify-between items-center gap-4 border p-4 rounded-2xl h-56">
            <div className="w-10 h-10 rounded-full bg-black" />
            <span className="text-body_16_B">흑돌</span>
            {game.members
              .filter((i) => i.stone === Player.Black)
              .map((i, idx) => (
                <div key={idx}>{i.nickname}</div>
              ))}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.Black)}
              className="px-4 py-2 rounded-2xl border text-body_16_B cursor-pointer"
            >
              선택
            </button>
          </div>
          <div className="flex flex-col justify-between items-center gap-4 border p-4 rounded-2xl h-56">
            <div className="w-10 h-10 rounded-full bg-white border-2" />
            <span className="text-body_16_B">백돌</span>
            {game.members
              .filter((i) => i.stone === Player.White)
              .map((i, idx) => (
                <div key={idx}>{i.nickname}</div>
              ))}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.White)}
              className="px-4 py-2 rounded-2xl border text-body_16_B cursor-pointer"
            >
              선택
            </button>
          </div>
        </div>
      </article>
      <button
        onClick={game.onClickGameStartHandler}
        className="mt-10 border px-4 py-2 rounded-2xl text-body_18_B"
      >
        게임시작
      </button>
    </main>
  );
}
