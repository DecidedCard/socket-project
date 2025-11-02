import { SIZE } from '@/const'
import { GameBoardReturn, PresenceMeta } from '@/hooks/useGame'
import { Player } from '@/types'
import { useRouter } from 'next/navigation'
import React from 'react'
import ArrowIcon from './ArrowIcon'

export default function GameBoard({ game }: { game: GameBoardReturn }) {
  const navigation = useRouter()

  return (
    <main className="flex h-full flex-col items-center justify-evenly px-20">
      <button
        aria-label="뒤로가기"
        onClick={() => navigation.replace('/')}
        className="absolute top-2 left-2 cursor-pointer"
      >
        <ArrowIcon type="Left" className="h-5 w-5 lg:h-8 lg:w-8" />
      </button>
      <article className="relative aspect-square w-full max-w-[900px]">
        <div className="flex h-full flex-col border">
          {Array.from({ length: SIZE - 1 }, () => Array(SIZE - 1).fill(0)).map(
            (row, rowindex) => {
              return (
                <div key={rowindex} className="flex flex-1">
                  {row.map((_, index) => {
                    return (
                      <div
                        key={`${rowindex}${index}`}
                        className="flex-1 border"
                      ></div>
                    )
                  })}
                </div>
              )
            }
          )}
        </div>
        <div className="absolute -inset-[3%] flex flex-col">
          {game.check.map((row, rowindex) => {
            return (
              <div key={rowindex} className="flex flex-1">
                {row.map((item, index) => {
                  return (
                    <div
                      key={`${rowindex}${index}`}
                      className="group flex flex-1 items-center justify-center"
                    >
                      {item ? (
                        <div
                          className={`h-3/4 w-3/4 rounded-full ${
                            item === Player.Black
                              ? 'bg-black'
                              : 'border-2 bg-white'
                          }`}
                        ></div>
                      ) : (
                        (!game.me || game.me.stone === game.player) && (
                          <button
                            onClick={() =>
                              game.onClickHandler(rowindex, index, game.player)
                            }
                            className={`hidden h-3/4 w-3/4 cursor-pointer rounded-full group-hover:block ${
                              game.player === Player.Black
                                ? 'bg-black'
                                : 'border-2 bg-white'
                            }`}
                          ></button>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </article>
      {game.winner && (
        <article className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-10 bg-black/60">
          <div className="flex h-14 items-center rounded-2xl bg-white px-10">
            {game.winner === Player.Black ? '흑돌' : '백돌'}이 승리했습니다.
          </div>
          <div className="flex gap-4">
            <button
              onClick={game.onClickReset}
              className="flex h-10 cursor-pointer items-center rounded-2xl bg-white px-4"
            >
              초기화
            </button>
            <button
              onClick={() => navigation.back()}
              className="flex h-10 cursor-pointer items-center rounded-2xl bg-white px-4"
            >
              처음으로
            </button>
          </div>
        </article>
      )}
    </main>
  )
}
