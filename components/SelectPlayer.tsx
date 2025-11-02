import { GameBoardReturn, PresenceMeta } from '@/hooks/useGame'
import { Player } from '@/types'
import React from 'react'

export default function SelectPlayer({ game }: { game: GameBoardReturn }) {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <article className="flex w-full flex-col items-center justify-center gap-20">
        <div className="flex h-36 w-52 flex-col items-center rounded-2xl border-2 p-4">
          <span className="text-body_20_B border-b border-gray-400">
            플레이어
          </span>
          <div className="mt-4 flex flex-col items-center gap-1">
            {game.members
              .filter((member) => !member.stone)
              .map((i) => (
                <span key={i.id}>{i.nickname}</span>
              ))}
          </div>
        </div>
        <div className="flex w-full justify-evenly">
          <div className="flex h-56 flex-col items-center justify-between gap-4 rounded-2xl border p-4">
            <div className="h-10 w-10 rounded-full bg-black" />
            <span className="text-body_16_B">흑돌</span>
            {game.members
              .filter((i) => i.stone === Player.Black)
              .map((i) => (
                <div key={i.id}>{i.nickname}</div>
              ))}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.Black)}
              className="text-body_16_B cursor-pointer rounded-2xl border px-4 py-2"
            >
              선택
            </button>
          </div>
          <div className="flex h-56 flex-col items-center justify-between gap-4 rounded-2xl border p-4">
            <div className="h-10 w-10 rounded-full border-2 bg-white" />
            <span className="text-body_16_B">백돌</span>
            {game.members
              .filter((i) => i.stone === Player.White)
              .map((i) => (
                <div key={i.id}>{i.nickname}</div>
              ))}
            <button
              onClick={() => game.onClickUpdateStoneHandler(Player.White)}
              className="text-body_16_B cursor-pointer rounded-2xl border px-4 py-2"
            >
              선택
            </button>
          </div>
        </div>
      </article>
      <button
        onClick={game.onClickGameStartHandler}
        className="text-body_18_B mt-10 rounded-2xl border px-4 py-2"
      >
        게임시작
      </button>
    </main>
  )
}
