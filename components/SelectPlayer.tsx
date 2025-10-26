import { GameBoardReturn, PresenceMeta } from "@/hooks/useGame";
import { Player } from "@/types";
import React from "react";

export default function SelectPlayer({ game }: { game: GameBoardReturn }) {
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <article className="w-1/2 flex flex-col justify-center items-center">
        <div>
          <span>플레이어</span>
          <div className="flex flex-col gap-1 items-center">
            {game.members.map((i, idx) =>
              !i.stone ? <span key={idx}>{i.nickname}</span> : false
            )}
          </div>
        </div>
        <div className="flex justify-evenly w-full">
          <div className="flex flex-col">
            <span>흑돌</span>
            {game.members.map((i, idx) =>
              i.stone === Player.Black ? (
                <div key={idx}>{i.nickname}</div>
              ) : (
                false
              )
            )}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.Black)}
            >
              선택
            </button>
          </div>
          <div className="flex flex-col">
            <span>백돌</span>
            {game.members.map((i, idx) =>
              i.stone === Player.White ? (
                <div key={idx}>{i.nickname}</div>
              ) : (
                false
              )
            )}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.White)}
            >
              선택
            </button>
          </div>
        </div>
      </article>
      <button onClick={game.onClickGameStartHandler}>게임시작</button>
    </main>
  );
}
