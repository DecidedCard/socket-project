import { PresenceMeta } from "@/hooks/useGame";
import { Player } from "@/types";
import React from "react";

export default function SelectPlayer({
  members,
  onClickUpdateStoneHandler,
  onClickGameStartHandler,
}: {
  members: PresenceMeta[];
  onClickUpdateStoneHandler: (stone: Player) => Promise<void>;
  onClickGameStartHandler: () => void;
}) {
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <article className="w-1/2 flex flex-col justify-center items-center">
        <div>
          <span>플레이어</span>
          <div className="flex flex-col gap-1 items-center">
            {members.map((i, idx) =>
              !i.stone ? <span key={idx}>{i.nickname}</span> : false
            )}
          </div>
        </div>
        <div className="flex justify-evenly w-full">
          <div className="flex flex-col">
            <span>흑돌</span>
            {members.map((i, idx) =>
              i.stone === Player.Black ? (
                <div key={idx}>{i.nickname}</div>
              ) : (
                false
              )
            )}
            <button onClick={() => onClickUpdateStoneHandler(Player.Black)}>
              선택
            </button>
          </div>
          <div className="flex flex-col">
            <span>백돌</span>
            {members.map((i, idx) =>
              i.stone === Player.White ? (
                <div key={idx}>{i.nickname}</div>
              ) : (
                false
              )
            )}
            <button onClick={() => onClickUpdateStoneHandler(Player.White)}>
              선택
            </button>
          </div>
        </div>
      </article>
      <button onClick={onClickGameStartHandler}>게임시작</button>
    </main>
  );
}
